/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import fonts from '../../../assets/fonts';
import ChatListBox from '../../../components/ChatListBox';
import CustomText from '../../../components/CustomText';
import ScreenWrapper from '../../../components/ScreenWrapper';
import { colors } from '../../../utils/colors';

import { useSelector } from 'react-redux';
import CustomButton from '../../../components/CustomButton';
import EmptyComponent from '../../../components/EmptyComponent';
import Header from '../../../components/Header';
import ApiRequest, { get } from '../../../services/ApiRequest';

const ChatList = () => {
  //

  const isFocus = useIsFocused();
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [bottomLoader, setBottomLoader] = useState(false);

  const { token } = useSelector(state => state.user);

  const onRefresh = () => {
    setRefreshing(true);
    getConversationData();
  };

  const handleScroll = () => {
    setScrolled(true);
  };

  const handleNavigation = async item => {
    const dataToSend = {
      id: item?.otherUser?._id,
      img: item?.otherUser?.profileImage,
      name: item?.otherUser?.firstName,
      chatUserId: item?.otherUser?.user_id,
    };

    navigation.navigate('ChatScreen', { data: dataToSend });
  };

  const getConversationData = async () => {
    try {
      const response = await get('msg/conversations/');

      const dataToGet = {
        type: 'get_chat_reports',
        user_id: token,
      };
      const res = await ApiRequest(dataToGet);
      const userIds = res.data?.users || [];

      if (response.data?.success) {
        const filteredConversations = response.data?.conversations?.filter(
          conversation => !userIds.includes(conversation?.otherUser?.user_id),
        );
        setData(filteredConversations);
      } else {
        setData([]);
      }

      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      console.log(error, 'in getting chatlist');
    }
  };

  const getMoreConversations = async () => {
    try {
      if (data?.length >= 9 && !bottomLoader && isFocus) {
        setBottomLoader(true);

        const url = `msg/conversations/${data[data?.length - 1]?._id}`;

        const dataToGet = {
          type: 'get_chat_reports',
          user_id: token,
        };
        const res = await ApiRequest(dataToGet);
        const userIds = res.data?.users || [];

        const response = await get(url);

        if (response.data?.success) {
          const newConversations = response.data?.conversations?.filter(
            conversation => !userIds.includes(conversation?.otherUser?.user_id),
          );

          const existingIds = new Set(data.map(item => item?.otherUser?._id));
          const uniqueNewConversations = newConversations.filter(
            conv => !existingIds.has(conv?.otherUser?._id),
          );

          setData([...data, ...uniqueNewConversations]);
        }

        setBottomLoader(false);
        setScrolled(false);
      }
    } catch (error) {
      console.log(error, 'in getting more conversation');
      setBottomLoader(false);
      setScrolled(false);
    }
  };

  useEffect(() => {
    getMoreConversations();
  }, [scrolled]);

  useFocusEffect(
    useCallback(() => {
      getConversationData();
    }, []),
  );

  const renderItem = useCallback(
    ({ item }) => (
      <ChatListBox onPress={() => handleNavigation(item)} item={item} />
    ),
    [],
  );

  return (
    <ScreenWrapper
      headerUnScrollable={() => <Header headerColor="#FFF" title={'Chat'} />}
      paddingHorizontal={0.1}
      paddingBottom={70}
      scrollEnabled={false}>
      {token ? (
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primaryColor]}
            />
          }
          ListFooterComponent={
            bottomLoader && (
              <View style={styles.footer}>
                <ActivityIndicator color={colors.primaryColor} size={40} />
              </View>
            )
          }
          windowSize={10}
          initialNumToRender={10}
          renderItem={renderItem}
          removeClippedSubviews
          maxToRenderPerBatch={30}
          onEndReachedThreshold={0.5}
          onScrollEndDrag={handleScroll}
          ListEmptyComponent={!refreshing && EmptyComponent}
          keyExtractor={item => item?.otherUser?._id?.toString()}
          contentContainerStyle={{ flex: data?.length > 1 ? 0 : 1 }}
        />
      ) : (
        <View style={styles.blurContainer}>
          <CustomText textStyle={styles.signInText} label={'loginRequired'} />
          <CustomButton
            width="80%"
            marginTop={14}
            title={'Login'}
            onPress={() => navigation.navigate('AuthStack')}
          />
        </View>
      )}
    </ScreenWrapper>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    paddingHorizontal: 22,
    elevation: 5,
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
  },
  signInText: {
    fontSize: 18,
    color: colors.black,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },
  footer: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

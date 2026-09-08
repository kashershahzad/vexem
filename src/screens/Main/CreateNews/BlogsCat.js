/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import fonts from '../../../assets/fonts';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import ScreenWrapper from '../../../components/ScreenWrapper';
import ApiRequest from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import EmptyComponent from '../../../components/EmptyComponent';

const BlogsCat = () => {
  const { loginUser } = useSelector(store => store.user);
  const navigation = useNavigation();
  const [Category, setCategory] = useState([]);
  const [refreshing, setrefreshing] = useState(true);

  const getCategory = async () => {
    try {
      setrefreshing(true);
      let body = {
        type: 'get_data',
        table_name: 'blog_categories',
        cat_ids: loginUser?.news_cat_ids,
      };
      const res = await ApiRequest(body);
      if (res.data?.data) {
        setCategory(res?.data?.data);
      }
      setrefreshing(false);
    } catch (error) {
      console.log(error, 'errrr in getting blogs cat');
      setrefreshing(false);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <ScreenWrapper
      paddingHorizontal={0.1}
      scrollEnabled
      statusBarColor="white"
      headerUnScrollable={() => <Header title={'News and Blogs'} />}>
      <View style={styles.container}>
        <FlatList
          data={Category}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={getCategory}
              colors={[colors.primaryColor]}
            />
          }
          ListEmptyComponent={!refreshing && EmptyComponent}
          contentContainerStyle={{ paddingTop: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CreateNews', { catdata: item })
              }
              style={styles?.molecule}
              key={item.id}>
              <CustomText
                label={item?.translations}
                fontFamily={fonts.regular}
                fontSize={16}
                numberOfLines={1}
                translation
              />
              <View style={styles.icn}>
                <Icons family={'AntDesign'} name={'right'} />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenWrapper>
  );
};

export default BlogsCat;

const styles = StyleSheet.create({
  molecule: {
    height: 55,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icn: {
    backgroundColor: colors.mainBg,
    width: 32,
    height: 32,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
});

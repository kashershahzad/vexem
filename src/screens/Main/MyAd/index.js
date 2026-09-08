import React, { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';

import { useSelector } from 'react-redux';
import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import CustomText from '../../../components/CustomText';
import EmptyComponent from '../../../components/EmptyComponent';
import Header from '../../../components/Header';
import ScreenWrapper from '../../../components/ScreenWrapper';
import TopTab from '../../../components/TopTab';
import ApiRequest from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import { imgUrl } from '../../../utils/constants';
import ListViewCard from '../Result/molecules/ListViewCard';

const tabName = ['Active', 'Pending', 'Rejected', 'Sold Out'];

const MyAd = ({ navigation }) => {
  const { token } = useSelector(state => state.user);

  const [tab, setTab] = useState(0);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const statusMap = {
    0: 'active',
    1: 'pending',
    2: 'rejected',
    3: 'sold_out',
  };

  const filteredData = data?.filter(item => item?.status === statusMap[tab]);

  const handleLike = async (id, index) => {
    try {
      let status = '';
      let updatedData = [...filteredData];
      status = updatedData[index].like === 'like' ? 'dislike' : 'like';
      updatedData[index].like = status;
      setData(updatedData);

      const dataToSend = {
        type: 'add_data',
        table_name: 'blog_likes',
        user_id: token,
        item_id: id,
        like_type: status,
      };

      await ApiRequest(dataToSend);

      handleMyAds();
    } catch (error) {
      console.log(error, 'err in like dislike');
    }
  };

  const handleMyAds = async () => {
    if (!token) return;
    setRefreshing(true);

    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'items',
        specific_user: token,
        user_id: token,
      };

      const response = await ApiRequest(dataToGet);
      if (response.data.data) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error, 'err in my ads');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    handleMyAds();
  }, []);

  return (
    <ScreenWrapper
      scrollEnabled
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleMyAds}
          colors={[colors.primaryColor]}
        />
      }
      paddingBottom={70}
      headerUnScrollable={() => (
        <Header headerColor={colors.white} title={'My Ads'} />
      )}>
      {token ? (
        <>
          <TopTab tabNames={tabName} tab={tab} setTab={setTab} />
          {(filteredData?.length === undefined || filteredData?.length <= 0) &&
            !refreshing && (
              <EmptyComponent
                title={`No ${
                  statusMap[tab] == 'sold_out'
                    ? 'Sold Out'
                    : statusMap[tab].charAt(0).toUpperCase() +
                      statusMap[tab].slice(1)
                } Ads Found`}
              />
            )}
          {filteredData?.map((item, index) => (
            <ListViewCard
              key={item.id}
              title={item?.name}
              item={item}
              price={item?.price}
              description={item?.description}
              source={{ uri: imgUrl + item?.images }}
              onPress={() => {
                navigation.navigate('Detail', {
                  itemId: item?.id,
                });
              }}
              onLike={() => handleLike(item?.id, index)}
              button={
                item?.status === 'active'
                  ? 'Active'
                  : item?.status === 'rejected'
                  ? 'Rejected'
                  : item?.status === 'pending'
                  ? 'Pending'
                  : 'Sold Out'
              }
            />
          ))}
        </>
      ) : (
        <View style={styles.blurContainer}>
          <CustomText textStyle={styles.signInText} label={'loginRequired'} />
          <CustomButton
            width="87%"
            marginTop={14}
            title={'Login'}
            onPress={() => navigation.navigate('AuthStack')}
          />
        </View>
      )}
    </ScreenWrapper>
  );
};

export default MyAd;

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 18,
    color: colors.black,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },
});

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { useSelector } from 'react-redux';
import ListViewCard from '../../Result/molecules/ListViewCard';
import EmptyComponent from '../../../../components/EmptyComponent';
import ScreenWrapper from '../../../../components/ScreenWrapper';
import { colors } from '../../../../utils/colors';
import Header from '../../../../components/Header';
import ApiRequest from '../../../../services/ApiRequest';
import { imgUrl } from '../../../../utils/constants';

const Favourite = () => {
  //

  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const { token } = useSelector(store => store.user);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLike = async id => {
    try {
      const updatedData = data.filter(item => item?.item?.id !== id);
      setData(updatedData);
      const dataToSend = {
        type: 'add_data',
        table_name: 'blog_likes',
        user_id: token,
        like_type: 'dislike',
        item_id: id,
      };

      await ApiRequest(dataToSend);
      fetchData();
    } catch (error) {
      console.log(error, 'err in favourites');
    }
  };

  const fetchData = async () => {
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'blog_likes',
        specific_user: token,
        item_id: 1,
      };

      const response = await ApiRequest(dataToGet);

      if (response.data.data) {
        const array = response.data.data;
        setData(array);
      }
      setRefreshing(false);
    } catch (error) {
      console.log(error, 'err in getting favourites');
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScreenWrapper
      scrollEnabled
      statusBarColor={colors.white}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primaryColor]}
        />
      }
      headerUnScrollable={() => <Header title={'Favorites'} />}>
      <FlatList
        data={data}
        contentContainerStyle={{
          paddingTop: data?.length > 0 ? 20 : 0,
          flex: 1,
        }}
        ListEmptyComponent={!refreshing && EmptyComponent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ListViewCard
            item={item?.item}
            source={{ uri: imgUrl + item?.item?.images }}
            title={item?.item?.name}
            key={item.id}
            price={item?.item?.price}
            description={item?.item?.description}
            date={
              item?.item?.item_type === 'ad'
                ? item?.item?.date
                : item?.item?.end_date
            }
            time={
              item?.item?.item_type === 'ad'
                ? item?.item?.time
                : item?.item?.end_time
            }
            isLike={true}
            onLike={() => handleLike(item?.item?.id)}
          />
        )}
      />
    </ScreenWrapper>
  );
};

export default Favourite;

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import EmptyComponent from '../../../../components/EmptyComponent';
import Header from '../../../../components/Header';
import ScreenWrapper from '../../../../components/ScreenWrapper';
import ApiRequest from '../../../../services/ApiRequest';
import { colors } from '../../../../utils/colors';
import ListViewCard from '../../Result/molecules/ListViewCard';

const MyOfferAds = () => {
  //

  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const { token, loginUser } = useSelector(store => store.user);

  const fetchData = async () => {
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'items',
        user_id: token,
        item_type: 'offer',
        store_id: loginUser?.store_id,
      };

      setRefreshing(true);

      const res = await ApiRequest(dataToGet);

      if (res.data?.data) {
        setData(res.data.data);
      }
      setRefreshing(false);
    } catch (error) {
      console.log(error, 'err in getting offer ads');
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  return (
    <ScreenWrapper
      scrollEnabled
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchData}
          colors={[colors.primaryColor]}
        />
      }
      headerUnScrollable={() => <Header title={'My Offer Ads'} />}>
      <FlatList
        data={data}
        contentContainerStyle={{ paddingTop: 20, flex: 1 }}
        ListEmptyComponent={!refreshing && EmptyComponent}
        renderItem={({ item }) => (
          <ListViewCard
            title={item?.name}
            description={item?.end_date}
            item={item}
            price={item?.price}
            source={{ uri: item?.image }}
            onPress={() => navigation.navigate('OfferAdDetails', { ad: item })}
          />
        )}
      />
    </ScreenWrapper>
  );
};

export default MyOfferAds;

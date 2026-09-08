import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import EmptyComponent from '../../../../components/EmptyComponent';
import Header from '../../../../components/Header';
import ScreenWrapper from '../../../../components/ScreenWrapper';
import ApiRequest from '../../../../services/ApiRequest';
import { colors } from '../../../../utils/colors';
import ListViewCard from '../../Result/molecules/ListViewCard';

const FeaturedAd = () => {
  //

  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const { token } = useSelector(store => store.user);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const fetchData = async () => {
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'items',
        specific_user: token,
      };
      const response = await ApiRequest(dataToGet);
      if (response.data.data) {
        const array = response.data.data;
        const filterData = array.filter(item => item?.featured === '1');
        setData(filterData);
      }
      setRefreshing(false);
    } catch (error) {
      console.log(error, 'err in getting feature ads');
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
      headerUnScrollable={() => <Header title={'My Featured Ads'} />}>
      <FlatList
        data={data}
        contentContainerStyle={{ paddingTop: 30, flex: 1 }}
        ListEmptyComponent={!refreshing && EmptyComponent}
        renderItem={({ item }) => (
          <ListViewCard
            featured
            item={item}
            source={{ uri: item?.image }}
            title={item?.name}
            key={item.id}
            price={item?.price}
            description={item?.description}
            date={item?.item_type === 'ad' ? item?.date : item?.end_date}
            time={item?.item_type === 'ad' ? item?.time : item?.end_time}
          />
        )}
      />
    </ScreenWrapper>
  );
};

export default FeaturedAd;

import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import EmptyComponent from '../../../components/EmptyComponent';
import Header from '../../../components/Header';
import ScreenWrapper from '../../../components/ScreenWrapper';
import ApiRequest from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import NewsCard from './molecules/NewsCard';

const Events = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const fetchData = useCallback(async () => {
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'blogs',
        cat_type: 'event',
      };
      const res = await ApiRequest(dataToGet);

      const array = res.data.data;
      if (array) {
        setData(array);
      }
      setRefreshing(false);
    } catch (error) {
      console.log(error);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ScreenWrapper
      paddingBottom={12}
      scrollEnabled
      refreshControl={
        <RefreshControl
          onRefresh={onRefresh}
          refreshing={refreshing}
          colors={[colors.primaryColor]}
        />
      }
      headerUnScrollable={() => <Header title={'Events'} />}>
      <FlatList
        data={data}
        contentContainerStyle={{ paddingTop: 20 }}
        ListEmptyComponent={
          !refreshing && <EmptyComponent style={{ marginTop: '50%' }} />
        }
        renderItem={({ item }) => (
          <NewsCard
            item={item}
            key={item?.id}
            title={item?.tags}
            source={item?.image}
            onPress={() =>
              navigation.navigate('NewsDetails', {
                blogId: item?.id,
              })
            }
          />
        )}
      />
    </ScreenWrapper>
  );
};

export default Events;

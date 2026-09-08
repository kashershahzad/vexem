import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import Header from '../../../components/Header';
import NotificationBox from '../../../components/NotificationBox';
import ScreenWrapper from '../../../components/ScreenWrapper';
import { useSelector } from 'react-redux';
import ApiRequest from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import EmptyComponent from '../../../components/EmptyComponent';

const Notifications = () => {
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
        table_name: 'notifications',
        specific_user: token,
      };

      const response = await ApiRequest(dataToGet);

      if (response.data?.data) {
        const array = response.data.data;
        setData(array);
      }
      setRefreshing(false);
    } catch (error) {
      console.log(error, 'err in getting notification');
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
      headerUnScrollable={() => <Header title={'Notifications'} />}>
      <FlatList
        data={data}
        contentContainerStyle={{ flex: 1 }}
        ListEmptyComponent={!refreshing && EmptyComponent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <NotificationBox item={item} />}
      />
    </ScreenWrapper>
  );
};

export default Notifications;

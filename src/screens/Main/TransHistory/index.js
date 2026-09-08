import React from 'react';
import { FlatList } from 'react-native';
import Header from '../../../components/Header';
import ScreenWrapper from '../../../components/ScreenWrapper';
import HistoryBox from '../../../components/HistoryBox';

const TransHistory = () => {
  return (
    <ScreenWrapper
      headerUnScrollable={() => <Header title={'Transaction History'} />}>
      <FlatList
        data={[1, 2, 3, 4, 5, 6]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
        renderItem={() => <HistoryBox />}
      />
    </ScreenWrapper>
  );
};

export default TransHistory;

import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import GridJobCard from '../../../components/GridJobCard';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import JobCardList from '../../../components/JobCardList';
import ScreenWrapper from '../../../components/ScreenWrapper';
import SearchBar from '../../../components/SearchBar';
import { colors } from '../../../utils/colors';

const Recruiter = ({ navigation }) => {
  const [viewType, setViewType] = useState('list');

  const data = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
  ];

  return (
    <ScreenWrapper
      scrollEnabled
      paddingBottom={12}
      statusBarColor="white"
      headerUnScrollable={() => <Header title={'Jobs'} />}>
      <View style={styles.searchContainer}>
        <SearchBar width={'75%'} placeHolder={'Search Any item...'} />
        <TouchableOpacity
          style={styles.viewContainer}
          onPress={() => setViewType('list')}>
          <Icons
            family={'Feather'}
            name={'list'}
            color={viewType == 'grid' ? colors.grey : colors.black}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewContainer}
          onPress={() => setViewType('grid')}>
          <Icons
            family={'Feather'}
            name={'credit-card'}
            color={viewType == 'list' ? colors.grey : colors.black}
          />
        </TouchableOpacity>
      </View>
      {data.map((item, index) =>
        viewType === 'list' ? (
          <JobCardList
            key={item.id}
            onPress={() => navigation.navigate('JobDetail', { myAd: false })}
          />
        ) : (
          <GridJobCard
            key={item.id}
            onPress={() => navigation.navigate('JobDetail', { myAd: false })}
          />
        ),
      )}
    </ScreenWrapper>
  );
};

export default Recruiter;

const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  viewContainer: {
    padding: 8,
    borderRadius: 8,
    borderColor: colors.black,
    borderWidth: 1,
    // backgroundColor:'#E5F7FA'
  },
});

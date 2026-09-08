import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ScreenWrapper from '../../../../components/ScreenWrapper';
import { dummyArray } from '../../../../utils/Commonfun';
import ListViewCard from '../../Result/molecules/ListViewCard';
import Header from '../../../../components/Header';

const Bookmark = () => {
  return (
    <ScreenWrapper
      scrollEnabled
      headerUnScrollable={() => <Header title={'Bookmark Ads'} />}>
      {dummyArray.map((item, index) => (
        <ListViewCard  key={index} />
      ))}
    </ScreenWrapper>
  );
};

export default Bookmark;

const styles = StyleSheet.create({});

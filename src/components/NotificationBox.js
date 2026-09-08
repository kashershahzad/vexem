/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../utils/colors';
import CustomText from './CustomText';
import Icons from './Icons';
import fonts from '../assets/fonts';

const NotificationBox = ({ item }) => {
  return (
    <View style={styles.box}>
      <View style={styles.imgBox}>
        <Icons
          name={'image'}
          family={'Feather'}
          size={23}
          color={colors.white}
        />
      </View>
      <View style={{ flex: 1 }}>
        <CustomText
          label={item?.title}
          fontFamily={fonts.semiBold}
          numberOfLines={1}
        />
        <CustomText
          label={item?.message}
          fontFamily={fonts.semiBold}
          fontSize={11}
          numberOfLines={3}
          color={colors.grey}
        />
        <CustomText
          label={item?.date}
          fontFamily={fonts.semiBold}
          fontSize={10}
          marginTop={4}
          numberOfLines={1}
          color={colors.grey}
        />
      </View>
    </View>
  );
};

export default NotificationBox;

const styles = StyleSheet.create({
  imgBox: {
    backgroundColor: colors.grey,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    marginRight: 12,
  },
  box: {
    flexDirection: 'row',
    borderWidth: 1,
    marginBottom: 13,
    borderColor: colors.grey1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
});

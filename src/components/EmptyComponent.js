import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import fonts from '../assets/fonts';
import { Images } from '../assets/images';
import CustomText from './CustomText';
import { colors } from '../utils/colors';

const EmptyComponent = ({ title, style, imgStyle ,isStore}) => (
  <View style={[styles.emptyComponent, style]}>
    <Image source={Images.noData} style={[styles.img, imgStyle]} />
    <CustomText
      label={title || 'No data found'}
      fontFamily={fonts.semiBold}
      fontSize={18}
      color={isStore? colors.white : colors.black}
    />
  </View>
);

export default EmptyComponent;

const styles = StyleSheet.create({
  emptyComponent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: { width: 200, height: 150, marginBottom: 10 },
});

import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import CustomText from './CustomText';
import { colors } from '../utils/colors';
import fonts from '../assets/fonts';
import Icons from './Icons';

const TextSpaceBetween = ({
  rightText,
  leftText,
  onLeftPress,
  onRightPress,
  marginTop,
  leftImage,
  forwardArrow = true,
  marginHorizontal,
  marginLeft = 7,
}) => {
  return (
    <View
      style={[
        styles.container,
        { marginTop: marginTop, marginHorizontal: marginHorizontal },
      ]}>
      <View style={[styles.img, { width: rightText ? '70%' : '90%' }]}>
        {leftImage && (
          <Image
            source={leftImage}
            style={{ height: 14, width: 14, marginRight: 3 }}
          />
        )}
        <CustomText
          color={colors.black}
          label={leftText}
          fontFamily={fonts.semiBold}
          fontSize={16}
          onPress={onLeftPress}
          marginLeft={marginLeft}
          marginTop={-2}
        />
      </View>
      <View style={styles.box}>
        <CustomText
          color={colors.black}
          label={rightText}
          fontFamily={fonts.semiBold}
          fontSize={13}
          onPress={onRightPress}
          marginRight={4}
        />
        {forwardArrow && (
          <Icons name={'arrowright'} family={'AntDesign'} size={16} />
        )}
      </View>
    </View>
  );
};

export default TextSpaceBetween;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
    paddingRight: 7,
  },
  img: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    marginLeft: 8,
    justifyContent: 'flex-end',
  },
});

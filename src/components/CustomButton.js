import React from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';

import CustomText from './CustomText';

import fonts from '../assets/fonts';
import { colors } from '../utils/colors';
import Icons from './Icons';

const CustomButton = ({
  onPress,
  title,
  disabled,
  loading,
  customStyle,
  customText,
  marginBottom,
  marginTop,
  backgroundColor,
  color,
  width = '100%',
  height = 48,
  borderRadius = 8,
  justifyContent = 'center',
  alignItems = 'center',
  flexDirection = 'row',
  alignSelf = 'center',
  fontSize,
  indicatorcolor,
  image,
  imageStyle,
  iconName,
  iconFamily,
  iconSize,
  iconColor,
  borderTopLeftRadius,
  borderTopRightRadius,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.6}
      style={[
        {
          backgroundColor: disabled
            ? colors.grey
            : backgroundColor
            ? backgroundColor
            : colors.primaryColor,
          marginTop,
          marginBottom,
          width,
          height,
          borderRadius,
          flexDirection,
          alignItems,
          justifyContent,
          alignSelf,
          borderTopLeftRadius,
          borderTopRightRadius,
        },
        customStyle,
      ]}
      onPress={onPress}>
      {loading && (
        <ActivityIndicator
          size={25}
          color={indicatorcolor ? indicatorcolor : colors.white}
        />
      )}
      {!loading && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {image && (
            <Image
              source={image}
              style={[{ marginRight: 10, height: 20, width: 20 }, imageStyle]}
            />
          )}
          {iconName && (
            <Icons
              name={iconName}
              family={iconFamily}
              size={iconSize}
              color={iconColor}
            />
          )}
          <CustomText
            textStyle={customText}
            label={title}
            color={color ? color : colors.white}
            fontFamily={fonts.semiBold}
            fontSize={fontSize || 15}
            marginLeft={iconName ? 4 : 0}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

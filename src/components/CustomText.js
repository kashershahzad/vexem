/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import fonts from '../assets/fonts';
import { colors } from '../utils/colors';
import { useSelector } from 'react-redux';

const CustomText = ({
  textStyle,
  fontSize,
  marginTop,
  marginBottom,
  marginRight,
  marginLeft,
  paddingHorizontal,
  alignSelf,
  fontFamily,
  fontStyle,
  textTransform,
  textAlign,
  label,
  color,
  fontWeight,
  bottom,
  width,
  borderColor,
  borderBottomWidth,
  onPress,
  marginVertical,
  paddingBottom,
  activeOpacity,
  textDecorationLine,
  lineHeight,
  containerStyle,
  right,
  left,
  numberOfLines,
  children,
  translation,
  top = -3,
}) => {
  const { t } = useTranslation();
  const { loginUser, token } = useSelector(state => state.user);

  let text = '';

  if (translation) {
    try {
      text = JSON.parse(label);
    } catch (e) {
      console.error('Invalid JSON format', e);
    }
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={activeOpacity || 0.6}>
      <Text
        numberOfLines={numberOfLines}
        style={[
          {
            fontSize: fontSize || 14,
            color: color || colors.black,
            marginTop: marginTop || 0,
            marginBottom: marginBottom || 0,
            marginLeft: marginLeft || 0,
            marginRight: marginRight || 0,
            paddingHorizontal: paddingHorizontal || 0,
            alignSelf: alignSelf || 'flex-start',
            fontFamily: fontFamily || fonts.regular,
            fontStyle: fontStyle,
            lineHeight: lineHeight,
            textAlign: textAlign,
            textTransform: textTransform,
            fontWeight: fontWeight,
            bottom: bottom,
            borderBottomWidth: borderBottomWidth,
            borderColor: borderColor,
            width: width,
            marginVertical: marginVertical,
            paddingBottom: paddingBottom,
            right: right,
            left: left,
            textDecorationLine: textDecorationLine || 'none',
            top: Platform.OS === 'ios' ? 0 : top,
          },
          textStyle,
        ]}>
        {t(
          token && translation && loginUser?.user_lang == 'en'
            ? text?.en
            : token && translation && loginUser?.user_lang == 'ar'
            ? text?.ar
            : translation
            ? text?.en
            : label,
        )}
        {children}
      </Text>
    </TouchableOpacity>
  );
};
export default CustomText;

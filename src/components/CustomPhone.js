/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import fonts from '../assets/fonts';
import { colors } from '../utils/colors';
import CustomText from './CustomText';

const CustomPhone = ({
  value,
  onChangeText,
  error,
  isBlur,
  isFocus,
  onEndEditing,
  placeholder,
}) => {
  const isError = ![undefined, null, true, ''].includes(error);

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    isFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    isBlur?.();
  };

  return (
    <View>
      <View
        style={[
          styles.container,
          {
            marginBottom: isError ? 2 : 15,
            borderColor: isError
              ? colors.red
              : isFocused
              ? colors.primaryColor
              : colors.lightGrey,
          },
        ]}>
        <CustomText
          label={'+92'}
          fontFamily={fonts.semiBold}
          fontSize={16}
          containerStyle={[
            styles.codePicker,
            {
              borderRightColor: isError
                ? colors.red
                : isFocused
                ? colors.primaryColor
                : colors.lightGrey,
            },
          ]}
          alignSelf={'center'}
        />
        <TextInput
          style={styles.input}
          cursorColor={colors.primaryColor}
          keyboardType="phone-pad"
          value={value}
          onChangeText={text => {
            let digits = text.replace(/\D/g, '');
            if (digits.startsWith('92') && digits.length > 10) {
              digits = digits.slice(2);
            }
            if (digits.startsWith('0')) {
              digits = digits.slice(1);
            }
            onChangeText?.(digits.slice(0, 10));
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={10}
          onEndEditing={onEndEditing}
          placeholder={placeholder}
        />
      </View>
      {error && (
        <CustomText label={error} color={colors.red} marginBottom={12} />
      )}
    </View>
  );
};

export default CustomPhone;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: 52,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  input: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    width: '100%',
    paddingHorizontal: 15,
    color: colors.black,
    paddingVertical: 0,
  },
  codePicker: {
    width: 90,
    height: 52,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.lightGrey,
  },
});

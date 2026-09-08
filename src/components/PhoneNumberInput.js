import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

import fonts from '../assets/fonts';
import { colors } from '../utils/colors';

const PhoneNumberInput = ({ value, setValue, valid, setValid, formData }) => {
  const phoneInput = useRef(null);

  const checkPhoneNumber = text => {
    const sanitizedText = text.replace(/[^0-9+]/g, '');
    const checkValid = phoneInput.current?.isValidNumber(sanitizedText);
    setValid(checkValid);
    phoneInput.current?.setState({
      number: sanitizedText,
    });
    setValue({ ...formData, phoneNumber: sanitizedText });
  };

  return (
    <View style={styles.wrapper}>
      <PhoneInput
        ref={phoneInput}
        defaultValue={value}
        value={value}
        defaultCode="QA"
        layout="second"
        placeholder={'Phone number'}
        withDarkTheme
        containerStyle={styles.containerStyle}
        textContainerStyle={styles.textContainerStyle}
        textInputStyle={styles.textInputStyle}
        codeTextStyle={styles.codeTextStyle}
        onChangeText={text => {
          checkPhoneNumber(text);
        }}
        countryPickerButtonStyle={styles.countryPickerButtonStyle}
        disableArrowIcon
        onChangeFormattedText={text => {
          const sanitizedText = text.replace(/[^0-9+]/g, '');
          setValue({ ...formData, phoneNumber: sanitizedText });
        }}
        countryPickerProps={{ withAlphaFilter: false }}
      />
      {value && !valid && (
        <Text style={styles.error}>Enter a valid phone number</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    marginBottom: 15,
  },

  error: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.red,
    marginTop: 3,
  },
  containerStyle: {
    backgroundColor: colors.white,
    width: '100%',
    height: 52,
    borderRadius: 20,
  },
  textContainerStyle: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  textInputStyle: {
    fontFamily: fonts.semiBold,
    height: 52,
    color: colors.black,
    fontSize: 15,
    paddingVertical: 0,
  },
  codeTextStyle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  countryPickerButtonStyle: {
    borderRightColor: colors.lightGrey,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderRightWidth: 0,
  },
});

export default PhoneNumberInput;

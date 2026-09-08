import React from 'react';
import { StyleSheet, Pressable, TouchableOpacity, Image } from 'react-native';
import { className } from '../global-styles';
import fonts from '../assets/fonts';
import { colors } from '../utils/colors';
import CustomText from './CustomText';

import { Images } from '../assets/images';

const UploadImageComponent = ({ title, subTitle }) => {
  return (
    <Pressable style={styles.uploadContainer}>
      <TouchableOpacity style={className('align-center')}>
        <Image source={Images.uploadIcon} style={styles.icon} />
        <CustomText label={title || 'Browse Image'} />
        <CustomText
          label={subTitle || 'Supports: PNG or JPG'}
          color={colors.grey}
          fontFamily={fonts.semiBold}
          fontSize={10}
        />
      </TouchableOpacity>
    </Pressable>
  );
};

export default UploadImageComponent;

const styles = StyleSheet.create({
  icon: {
    width: 70,
    height: 70,
    resizeMode: 'center',
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: colors.grey1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    borderRadius: 10,
    borderStyle: 'dashed',
    marginVertical: 10,
  },
});

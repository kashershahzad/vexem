import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import { Images } from '../../../../assets/images';
import { colors } from '../../../../utils/colors';
import CustomText from '../../../../components/CustomText';

const MakeAnOffer = ({ onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
      onPress={onPress}>
      <Image
        source={Images.offer}
        style={{ height: 18, width: 14 }}
        tintColor={colors.primaryColor}
      />
      <CustomText
        label={'Make an offer'}
        color={colors.primaryColor}
        marginLeft={4}
      />
    </TouchableOpacity>
  );
};

export default MakeAnOffer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: colors.primaryColor,
    borderRadius: 99,
  },
});

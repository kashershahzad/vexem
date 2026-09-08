import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import CustomText from '../../../../components/CustomText';
import fonts from '../../../../assets/fonts';
import ImageFastWrapper from '../../../../components/ImageFast';
import { colors } from '../../../../utils/colors';

const Feature = ({ image, name, value, type, onPress }) => {
  return (
    <View style={styles.box}>
      <ImageFastWrapper source={image} style={styles.img} svgH={25} svgW={25} />
      <View style={styles.smBox}>
        <CustomText translation label={name} fontSize={12} />
        <View onPress={onPress} activeOpacity={0.5}>
          {type === 'file' ? (
            <TouchableOpacity style={styles.btn} onPress={onPress}>
              <CustomText
                label={'Download file'}
                fontSize={10}
                color={'#fff'}
              />
            </TouchableOpacity>
          ) : (
            <CustomText label={value || 'None'} fontFamily={fonts.semiBold} />
          )}
        </View>
      </View>
    </View>
  );
};

export default Feature;

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '47%',
    marginBottom: 8,
  },
  img: {
    height: 25,
    width: 25,
    marginRight: 8,
  },
  smBox: {
    marginLeft: 4,
    width: '70%',
  },
  btn: {
    backgroundColor: colors.primaryColor,
    borderRadius: 7,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    marginTop: 5,
  },
});

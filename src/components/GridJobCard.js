import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Images } from '../assets/images';
import { colors } from '../utils/colors';
import ImageFast from './ImageFast';
import fonts from '../assets/fonts';
import Icons from './Icons';
import CustomText from './CustomText';

const GridJobCard = ({ onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={{ marginTop: 14, backgroundColor: 'white', borderRadius: 14 }}>
      <ImageFast
        source={Images.house}
        style={{
          height: 200,
          width: '100%',
          borderRadius: 14,
        }}
      />
      <View style={styles.feature}>
        <Image source={Images.feature} style={styles.featureIcon} />
        <TouchableOpacity style={styles.like}>
          <Icons
            family={'AntDesign'}
            name={'hearto'}
            color={colors.primaryColor}
          />
        </TouchableOpacity>
      </View>
      <View style={{ padding: 12 }}>
        <CustomText
          label={'$$4000 - $5999'}
          fontSize={17}
          fontFamily={fonts.bold}
          color={colors.primaryColor}
          numberOfLines={1}
        />
        <CustomText
          label={'Beauty and Hairdressing'}
          fontFamily={fonts?.medium}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
            marginTop: 5,
            marginLeft: -5,
          }}>
          <Icons family={'EvilIcons'} name={'location'} color={'#dddddd'} />
          <CustomText
            label={'$Markham,ON L3R'}
            fontSize={10}
            fontFamily={fonts.semiBold}
            color={'#dddddd'}
            numberOfLines={1}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GridJobCard;

const styles = StyleSheet.create({
  featureIcon: {
    width: 79,
    height: 30,
  },

  feature: {
    position: 'absolute',
    top: 5,
    left: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
  },

  like: {
    backgroundColor: colors?.white,
    padding: 5,
    borderRadius: 60,
    elevation: 2,
  },
});

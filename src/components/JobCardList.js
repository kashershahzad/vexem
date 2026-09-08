import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import ImageFast from './ImageFast';
import CustomText from './CustomText';
import fonts from '../assets/fonts';
import { colors } from '../utils/colors';
import { Images } from '../assets/images';
import Icons from './Icons';

const JobCardList = ({ onPress, button }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        borderRadius: 12,
        backgroundColor: colors.white,
        marginTop: 12,
        width: '100%',
      }}>
      <ImageFast source={Images.house} style={styles.Image} />
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

      <View
        style={{ width: '50%', marginLeft: 6, justifyContent: 'space-evenly' }}>
        <CustomText
          label={'$4000 - $5999'}
          fontSize={17}
          fontFamily={fonts.bold}
          color={colors.primaryColor}
          numberOfLines={1}
        />
        <CustomText
          label={'Beauty and Hairdressing'}
          fontSize={14}
          color={colors.black}
          numberOfLines={2}
        />
        {/* <CustomText
          label={'Markham, ON L3R'}
          fontSize={10}
          color={colors.grey}
          numberOfLines={1}
        /> */}
        {button ? (
          <TouchableOpacity
            activeOpacity={0.6}
            style={[
              styles.button,
              {
                backgroundColor:
                  button == 'Active'
                    ? '#e5f7e7'
                    : button == 'Pending'
                    ? '#e6eef5'
                    : button == 'Sold Out'
                    ? '#fff8EA'
                    : '#ffe5e5',
              },
            ]}>
            <CustomText
              label={button}
              fontSize={10}
              color={
                button == 'Active'
                  ? '#02ad11'
                  : button == 'Pending'
                  ? '#0d5d9c'
                  : button == 'Sold Out'
                  ? '#ffbb33'
                  : '#fe2500'
              }
            />
          </TouchableOpacity>
        ) : (
          <></>
          // <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          //   <CustomText
          //     label={'5 Bedroom'}
          //     fontSize={10}
          //     color={colors.grey}
          //     marginRight={4}
          //   />
          //   <CustomText label={'4 Bathroo'} fontSize={10} color={colors.grey} />
          // </View>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
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

export default JobCardList;

const styles = StyleSheet.create({
  Image: {
    height: 130,
    width: 150,
    borderRadius: 12,
  },
  button: {
    padding: 6,
    width: '36%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99,
  },
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

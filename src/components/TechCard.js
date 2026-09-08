import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import fonts from '../assets/fonts';
import {className} from '../global-styles';
import {colors} from '../utils/colors';
import CustomText from './CustomText';
import Icons from './Icons';

import {Images} from '../assets/images';

const TechCard = ({item, onPress, selection, selected}) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={className('flex align-center flex-1')}>
        <Image source={Images.user} style={styles.avatar} />
        <View style={className('ml-3 flex-1')}>
          <CustomText label={'Rabeeca Adam'} fontFamily={fonts.semiBold} />
          <CustomText label={'AC Technician'} />
        </View>
      </View>
      <TouchableOpacity style={className('p-2')} onPress={onPress}>
        {selection ? (
          <View style={styles.circle}>
            {selected && <View style={styles.innerCircle} />}
          </View>
        ) : (
          <Icons name={'chevron-right'} family={'Feather'} size={25} />
        )}
      </TouchableOpacity>
    </Pressable>
  );
};

export default TechCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 5,
    marginBottom: 20,
    elevation: 3,
    padding: 10,
    width: '98%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#e3e2d4',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  circle: {
    borderWidth: 1,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.grey1,
  },
  innerCircle: {
    backgroundColor: colors.primaryColor,
    width: 12,
    height: 12,
    borderRadius: 10,
  },
});

import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import fonts from '../assets/fonts';
import { className } from '../global-styles';
import { colors } from '../utils/colors';
import CustomText from './CustomText';
import Icons from './Icons';
import { imgUrl } from '../utils/constants';

const LangBox = ({ item, onPress, selected }) => {
  return (
    <TouchableOpacity
      style={className(
        'bor-1 mt-3 rounded-2 px-4 py-2 bg-white justify-between align-center flex border-lightGrey',
      )}
      activeOpacity={0.5}
      onPress={onPress}>
      <View style={className('flex align-center')}>
        <Image
          source={{ uri: imgUrl + item?.image }}
          style={className('w-11 h-11 rounded-10 mr-4')}
        />
        <CustomText
          label={item?.language}
          fontFamily={fonts.semiBold}
          fontSize={16}
        />
      </View>
      {selected && (
        <Icons
          name={'checkcircle'}
          family={'AntDesign'}
          color={colors.primaryColor}
        />
      )}
    </TouchableOpacity>
  );
};

export default LangBox;

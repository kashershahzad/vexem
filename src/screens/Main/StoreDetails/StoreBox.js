import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import fonts from '../../../assets/fonts';
import CustomText from '../../../components/CustomText';
import ImageFastWrapper from '../../../components/ImageFast';
import { colors } from '../../../utils/colors';
import moment from 'moment';

const calculateRemainingDays = targetDate => {
  const currentDate = moment();
  const futureDate = moment(targetDate, 'MMM DD, YYYY');

  if (currentDate.isAfter(futureDate)) {
    return 'Expired';
  }

  const remainingDays = futureDate.diff(currentDate, 'days');
  return remainingDays + ' days left';
};

const StoreBox = ({ item, onPress, isSelected }) => {
  return (
    <TouchableOpacity
      style={[isSelected ? styles.selectedBox : styles.adBox]}
      activeOpacity={0.5}
      onPress={onPress}>
      <View style={{ height: 150 }}>
        <ImageFastWrapper
          source={{ uri: item.image }}
          style={styles.adImg}
          svgH={'100%'}
          svgW={'100%'}
        />
      </View>
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <CustomText
          label={item.name}
          fontFamily={fonts.semiBold}
          fontSize={16}
          numberOfLines={1}
        />
        <CustomText
          label={calculateRemainingDays(item?.end_date)}
          color={colors.red}
          fontFamily={fonts.semiBold}
          numberOfLines={1}
        />
      </View>
    </TouchableOpacity>
  );
};

export default StoreBox;

const styles = StyleSheet.create({
  adBox: {
    marginRight: 10,
    marginVertical: 8,
    width: 140,
    overflow: 'hidden',
    height: 200,
  },
  adImg: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  selectedBox: {
    marginRight: 20,
    marginVertical: 10,
    width: 140,
    overflow: 'hidden',
    height: 215,
    borderColor: colors.primaryColor,
    borderWidth: 1,
    borderRadius: 10,
  },
});

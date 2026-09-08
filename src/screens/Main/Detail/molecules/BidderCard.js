import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import fonts from '../../../../assets/fonts';
import CustomText from '../../../../components/CustomText';
import { colors } from '../../../../utils/colors';
import Icons from '../../../../components/Icons';

const BidderCard = ({ price, name, time, onPress, isOwner, phone }) => {
  return (
    <View style={styles.box}>
      <View style={styles.row}>
        <View style={styles.row}>
          <CustomText label={'$'} fontFamily={fonts.bold} />
          <CustomText label={price} fontFamily={fonts.bold} />
        </View>

        {isOwner && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPress}
            style={styles.row1}>
            <Icons
              family={'Feather'}
              name={'message-square'}
              size={20}
              color={colors.grey2}
            />
            <CustomText
              label={'Chat'}
              fontFamily={fonts.medium}
              fontSize={16}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.row}>
        <View>
          <CustomText label={name} fontSize={12} color={colors.grey} />
          {isOwner && (
            <CustomText
              label={`+ ${phone}`}
              fontSize={12}
              color={colors.grey}
            />
          )}
        </View>
        <CustomText label={time} fontSize={12} color={colors.grey} />
      </View>
    </View>
  );
};

export default BidderCard;

const styles = StyleSheet.create({
  box: {
    padding: 12,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    justifyContent: 'space-between',
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
});

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import fonts from '../assets/fonts';
import { colors } from '../utils/colors';
import CustomText from './CustomText';
import Icons from './Icons';

const HistoryBox = () => {
  return (
    <View style={styles.card}>
      <View style={styles.leftBox}>
        <View style={styles.line} />
        <View>
          <CustomText label={'pay_LURRmFzqF1c0e5'} />
          <CustomText label={'March 28, 2023'} fontSize={10} marginTop={5} />
        </View>
      </View>
      <View style={styles.leftBox}>
        <TouchableOpacity style={styles.copyBox}>
          <Icons name={'content-copy'} family={'MaterialIcons'} size={17} />
        </TouchableOpacity>
        <View>
          <CustomText
            label={'$29.95'}
            color={colors.primaryColor}
            fontFamily={fonts.bold}
          />
          <CustomText label={'Success'} fontSize={12} marginTop={5} />
        </View>
      </View>
    </View>
  );
};

export default HistoryBox;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grey1,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 0,
    marginBottom: 15,
  },
  copyBox: {
    borderWidth: 1,
    borderColor: colors.grey1,
    borderRadius: 8,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  leftBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    backgroundColor: colors.green,
    width: 5,
    height: 40,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    marginRight: 15,
  },
});

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../utils/colors';
import CustomText from './CustomText';
import fonts from '../assets/fonts';

const Tab = ({ tab, setTab }) => {
  return (
    <View style={styles.mainContainer}>
      {['Email', 'Phone'].map((item, i) => (
        <TouchableOpacity
          activeOpacity={0.6}
          key={i}
          onPress={() => setTab(i)}
          style={[
            styles.item,
            {
              backgroundColor: tab === i ? colors.primaryColor : colors.white,
            },
          ]}>
          <CustomText
            textTransform="capitalize"
            fontFamily={fonts.semiBold}
            label={item}
            fontSize={16}
            color={tab === i ? colors.white : colors.black}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};
export default Tab;
const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 5,
  },
});

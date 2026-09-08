import { StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Images } from '../../../../assets/images';
import CustomText from '../../../../components/CustomText';
import { colors } from '../../../../utils/colors';

const SubCatCard = ({ title, icon = true, marginTop, onPress, image }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[styles.container, { marginTop: marginTop }]}>
      <View style={styles.content}>
        {image && <Image source={image} style={styles.image} />}
        <CustomText label={title} fontSize={14} />
      </View>
      {icon && (
        <Image source={Images.fwdArrow} style={{ height: 32, width: 32 }} />
      )}
    </TouchableOpacity>
  );
};

export default SubCatCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    marginBottom: 3,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
});

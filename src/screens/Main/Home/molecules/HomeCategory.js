import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CustomText from '../../../../components/CustomText';
import ImageFast from '../../../../components/ImageFast';
import { colors } from '../../../../utils/colors';
import fonts from '../../../../assets/fonts';
import { Images } from '../../../../assets/images';

const HomeCategory = ({ source, title, onPress, marginRight, auction }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[styles.mainContainer, { marginRight: marginRight }]}>
      <View style={styles.container}>
        <ImageFast
          resizeMode={'contain'}
          source={source}
          style={styles.image}
          svgH={45}
          svgW={45}
        />
        {auction && <ImageFast source={Images.liveGif} style={styles.live} />}
      </View>
      <CustomText
        translation
        label={title}
        fontSize={12}
        textAlign={'center'}
        fontFamily={fonts.semiBold}
        numberOfLines={2}
      />
    </TouchableOpacity>
  );
};

export default HomeCategory;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    marginBottom: 10,
    width: '25%',
  },
  container: {
    height: 80,
    backgroundColor: colors.white,
    borderWidth: 0.6,
    borderColor: '#6C757D',
    marginBottom: 4,
    borderRadius: 8,
    alignItems: 'center',
    width: '85%',
    justifyContent: 'center',
  },
  image: {
    height: 50,
    width: '100%',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  live: {
    width: 60,
    height: 50,
    position: 'absolute',
    bottom: -23,
  },
});

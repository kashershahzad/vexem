import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import fonts from '../../../../assets/fonts';
import CustomText from '../../../../components/CustomText';
import ImageFast from '../../../../components/ImageFast';
import { colors } from '../../../../utils/colors';

const CatCard = ({ source, title, onPress, style }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onPress}
        style={[styles.mainContainer, style]}>
        <View style={styles.container}>
          <ImageFast
            resizeMode={'contain'}
            source={{ uri: source }}
            style={styles.image}
            svgH={50}
            svgW={50}
          />
        </View>
        <CustomText
          translation
          label={title}
          fontSize={13}
          textAlign={'center'}
          alignSelf={'center'}
          fontFamily={fonts.semiBold}
          marginBottom={6}
          numberOfLines={2}
          paddingHorizontal={5}
          paddingBottom={5}
          marginTop={5}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CatCard;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    height: 130,
    width: '100%',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    height: 70,
    width: '100%',
    paddingVertical: 10,
  },
  card: {
    width: '33.3%',
    paddingHorizontal: 6,
  },
});

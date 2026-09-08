import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from '../../../../components/CustomText';
import ImageFast from '../../../../components/ImageFast';
import { imgUrl } from '../../../../utils/constants';

const CommunityCard = ({ onPress, name, style, image }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.mainContainer, style]}>
      <ImageFast
        source={{ uri: imgUrl + image }}
        style={{ height: 95, width: 95, borderRadius: 99 }}
        svgH={95}
        svgW={95}
      />
      <CustomText label={name} fontSize={14} marginTop={4} translation />
    </TouchableOpacity>
  );
};

export default CommunityCard;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '33.3%',
  },
});

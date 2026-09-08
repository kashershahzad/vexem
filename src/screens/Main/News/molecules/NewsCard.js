import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomText from '../../../../components/CustomText';
import { colors } from '../../../../utils/colors';
import { imgUrl } from '../../../../utils/constants';

const NewsCard = ({ onPress, source, title, item }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ImageBackground
        style={styles.imageBackground}
        source={{ uri: imgUrl + source }}>
        <View style={styles.overlay} />
        <View style={styles.textView}>
          <CustomText
            label={item?.title}
            color={colors.white}
            paddingHorizontal={12}
            fontSize={13}
            style={styles.text}
            numberOfLines={2}
          />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default NewsCard;

const styles = StyleSheet.create({
  imageBackground: {
    height: 170,
    width: '100%',
    justifyContent: 'flex-end',
    borderRadius: 14,
    overflow: 'hidden',
    marginVertical: 6,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  textView: {
    backgroundColor: '#0000009E',
    borderRadius: 10,
    borderTopLeftRadius: 0,
    justifyContent: 'center',
    borderBottomRightRadius: 0,
    paddingVertical: 5,
  },
  text: {
    zIndex: 999,
  },
});

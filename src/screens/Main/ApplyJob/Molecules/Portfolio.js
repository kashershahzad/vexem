import { Dimensions, StyleSheet, Text, View } from 'react-native';
import CustomText from '../../../../components/CustomText';
import fonts from '../../../../assets/fonts';
import { colors } from '../../../../utils/colors';

import ImageFastWrapper from '../../../../components/ImageFast';
import { Images } from '../../../../assets/images';
import { imgUrl } from '../../../../utils/constants';

const images = [
  Images.Portfolio1,
  Images.Portfolio2,
  Images.Portfolio3,
  Images.Portfolio4,
  Images.Portfolio5,
];

const Portfolio = ({ portfolio }) => {
  return (
    <View>
      <CustomText
        label={'Portfolio'}
        fontFamily={fonts.semiBold}
        color={colors.black}
        fontSize={16}
        marginTop={20}
        marginBottom={10}
      />

      <View style={styles.imageContainer}>
        {Array.isArray(portfolio?.portfolio) &&
          portfolio.portfolio.map((img, index) => {
            if (!img) return null; // skip undefined/null items

            return (
              <ImageFastWrapper
                isView
                key={`portfolio-img-${index}`} // safer key
                source={{ uri: `${imgUrl}${img}` }}
                resizeMode="cover"
                style={styles.img}
              />
            );
          })}
      </View>
    </View>
  );
};

export default Portfolio;

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  img: {
    width: '48%',
    height: Dimensions.get('window').width / 2 - 20,
    marginBottom: 10,
  },
});

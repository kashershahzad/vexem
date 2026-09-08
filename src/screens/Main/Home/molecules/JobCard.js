import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import fonts from '../../../../assets/fonts';
import CustomText from '../../../../components/CustomText';
import Icons from '../../../../components/Icons';
import SkeletonCard from '../../../../components/SkeletonCard';
import { colors } from '../../../../utils/colors';

const JobCard = ({ loading, item, featured }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Detail', { itemId: item?.id });
  };

  return loading ? (
    <SkeletonCard />
  ) : (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={styles.cardContainer}>
      {featured && (
        <View style={styles.feature}>
          <CustomText label={'Featured'} color={'#fff'} fontSize={10} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <CustomText
          fontSize={15}
          numberOfLines={3}
          label={item?.name}
          color={colors.primaryColor}
          fontFamily={fonts.bold}
          marginTop={featured ? 24 : 5}
          lineHeight={20}
        />
        <CustomText
          numberOfLines={2}
          label={item?.description}
          marginTop={5}
          lineHeight={20}
          fontSize={13}
        />
      </View>
      <View style={styles.row}>
        <Icons name={'location-outline'} family={'IonIcons'} size={17} />
        <CustomText numberOfLines={2} label={item?.area} fontSize={12} />
      </View>
    </TouchableOpacity>
  );
};

export default JobCard;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    margin: 8,
    paddingHorizontal: 10,
    width: 210,
    paddingTop: 10,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  feature: {
    height: 20,
    width: 55,
    position: 'absolute',
    zIndex: 999,
    top: 7,
    left: 10,
    backgroundColor: colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  likeIcon: {
    width: 34,
    height: 34,
    position: 'absolute',
    zIndex: 999,
    bottom: 80,
    right: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 2,
    marginTop: 5,
    paddingRight: 15,
  },
});

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import fonts from '../../../../assets/fonts';
import CustomText from '../../../../components/CustomText';
import Icons from '../../../../components/Icons';
import ImageFast from '../../../../components/ImageFast';
import { colors } from '../../../../utils/colors';

const CustomViewCard = ({ item, onPress, source, onLike, isLike }) => {
  const { token } = useSelector(store => store.user);

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress} style={styles.card}>
      <View style={[styles.labelCard, { backgroundColor: '#872a38' }]}>
        <CustomText
          label={'Promoted'}
          color={colors.white}
          fontSize={10}
          fontFamily={fonts.semiBold}
        />
      </View>
      <View style={[styles.labelCard, { top: 35 }]}>
        <CustomText
          label={'Installments'}
          color={colors.white}
          fontSize={10}
          fontFamily={fonts.semiBold}
        />
      </View>

      <ImageFast source={source} style={styles.Image}>
        {token && (
          <TouchableOpacity style={styles.likeBtn} onPress={onLike}>
            <Icons
              name={'heart'}
              family={'AntDesign'}
              size={10}
              color={
                item?.like === 'like' || isLike ? colors.red : colors.white
              }
            />
          </TouchableOpacity>
        )}
      </ImageFast>
      <View style={styles.box}>
        <CustomText
          label={item?.name}
          fontFamily={fonts.semiBold}
          numberOfLines={2}
        />
        <CustomText
          label={item?.description}
          fontSize={13}
          color={colors.grey}
          numberOfLines={1}
        />
      </View>
    </TouchableOpacity>
  );
};

export default CustomViewCard;

const styles = StyleSheet.create({
  Image: {
    height: 130,
    width: 150,
    borderRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: colors.white,
    marginTop: 6,
    width: '100%',
    marginBottom: 12,
  },
  labelCard: {
    position: 'absolute',
    backgroundColor: colors.primaryColor,
    zIndex: 99,
    padding: 4,
    borderRadius: 4,
    top: 6,
    left: 6,
    paddingHorizontal: 9,
  },
  box: {
    width: '50%',
    marginLeft: 10,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  likeBtn: {
    height: 20,
    width: 20,
    position: 'absolute',
    top: 6,
    right: 5,
    backgroundColor: colors.grey1,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

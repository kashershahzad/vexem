import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import fonts from '../../../../assets/fonts';
import CustomText from '../../../../components/CustomText';
import Icons from '../../../../components/Icons';
import {
  default as ImageFast,
  default as ImageFastWrapper,
} from '../../../../components/ImageFast';
import { colors } from '../../../../utils/colors';
import { imgUrl } from '../../../../utils/constants';
import { Companybadge, Officalbadge } from '../../../../assets/images';
const dwidth = Dimensions.get('screen').width;

const ListViewCard = ({
  item,
  onPress,
  button,
  featured,
  source,
  title = 'Semi furnished banglow for sale or rent',
  price = '434',
  description = 'nothings for sale or rent',
  onLike,
  isLike,
  iconArray,
  tags,
  marginTop
}) => {
  const bg =
    button === 'Active'
      ? '#e5f7e7'
      : button === 'Pending'
      ? '#e6eef5'
      : button === 'Sold Out'
      ? '#fff8EA'
      : '#ffe5e5';

  const color1 =
    button === 'Active'
      ? '#02ad11'
      : button === 'Pending'
      ? '#0d5d9c'
      : button === 'Sold Out'
      ? '#ffbb33'
      : '#fe2500';

  const { token } = useSelector(store => store.user);
  const auction = item?.item_type === 'auction';

  const auctionPrice =
    auction && item?.current_price != null
      ? Number(item?.current_price).toLocaleString()
      : Number(item?.price).toLocaleString();

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress} style={[styles.card, {marginTop: marginTop || 0}]}>
      <ImageFast source={source} style={styles.Image}>
        {token && (
          <TouchableOpacity style={styles.likeBtn} onPress={onLike}>
            <Icons
              name={item?.like === 'like' ? 'heart' : 'hearto'}
              family={'AntDesign'}
              size={12}
              color={
                item?.like === 'like' || isLike ? colors.red : colors.white
              }
            />
          </TouchableOpacity>
        )}
        {featured && (
          <>
            <View style={styles.featuredCard}>
              <CustomText
                label={'Featured'}
                color={colors.white}
                fontSize={9}
              />
            </View>
          </>
        )}
        {tags?.length > 0 && (
          <View style={[styles.tagContainer]}>
            <FlatList
              data={tags}
              renderItem={({ item: tag, index }) =>
                index < 3 && (
                  <View
                    style={[
                      styles.labelCard,
                      { backgroundColor: tag?.color || colors.primaryColor },
                    ]}>
                    <CustomText
                      label={tag?.value}
                      numberOfLines={1}
                      fontSize={9}
                      color={'#fff'}
                      fontFamily={fonts.semiBold}
                    />
                  </View>
                )
              }
            />
          </View>
        )}
      </ImageFast>
      <View style={styles.box}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>

            <CustomText
              label={title}
              fontFamily={fonts.semiBold}
              numberOfLines={2}
              width={dwidth - 260}
              lineHeight={20}
              marginTop={15}
              fontSize={15}
            />
          </View>
          <CustomText
            label={description}
            fontSize={12}
            color={colors.grey}
            numberOfLines={1}
            marginTop={-5}
          />
          <View style={styles.flexRow}>
            {iconArray?.map((obj, index) => (
              <View style={styles.row} key={index}>
                <ImageFastWrapper
                  svgH={20}
                  svgW={20}
                  source={{ uri: imgUrl + obj?.image }}
                  style={styles.icon}
                />
                <CustomText
                  label={obj?.value}
                  fontSize={10}
                  color={colors.grey}
                  marginLeft={4}
                  numberOfLines={1}
                />
              </View>
            ))}
          </View>
          {button && (
            <TouchableOpacity
              activeOpacity={0.6}
              style={[styles.button, { backgroundColor: bg }]}>
              <CustomText label={button} fontSize={10} color={color1} />
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.row, { marginBottom: 5 }]}>
          <CustomText
            label={'PKR'}
            fontFamily={fonts.semiBold}
            color={colors.primaryColor}
            marginRight={5}
            fontSize={16}
          />
          <CustomText
            label={auctionPrice || `${Number(price).toLocaleString()}`}
            fontFamily={fonts.semiBold}
            color={colors.primaryColor}
            numberOfLines={1}
            fontSize={16}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListViewCard;

const styles = StyleSheet.create({
  Image: {
    height: 140,
    width: 145,
    borderRadius: 10,
  },
  button: {
    padding: 6,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: colors.white,
    marginTop: 6,
    width: '100%',
    marginBottom: 12,
    zIndex: -1,
  },
  featuredCard: {
    height: 19,
    width: 50,
    position: 'absolute',
    zIndex: 999,
    top: 10,
    left: 6,
    backgroundColor: colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  box: {
    width: '50%',
    marginLeft: 10,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
    marginBottom: 3,
  },
  likeBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#0000009E',
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    padding: 7,
  },
  labelCard: {
    zIndex: 1,
    paddingHorizontal: 9,
    marginTop: 5,
    maxWidth: 85,
    marginRight: 6,
    alignItems: 'center',
    borderRadius: 4,
    paddingTop: 2,
    height: 18,
  },
  tagContainer: {
    zIndex: 1,
    position: 'absolute',
    right: 0,
    marginTop: 5,
  },
  flexRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 20,
    width: 20,
  },
});

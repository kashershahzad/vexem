import React from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import fonts from '../../../../assets/fonts';
import CustomButton from '../../../../components/CustomButton';
import CustomText from '../../../../components/CustomText';
import Icons from '../../../../components/Icons';
import ImageFast from '../../../../components/ImageFast';
import { colors } from '../../../../utils/colors';
import ImageFastWrapper from '../../../../components/ImageFast';
import { imgUrl } from '../../../../utils/constants';
import { Companybadge, Officalbadge } from '../../../../assets/images';

const GridViewCard = ({
  onPress,
  source,
  title = 'Semi furnished banglow for sale or rent necnenck ncdekjnk',
  price = '432',
  description = 'dummy for sale or rent',
  date,
  time,
  onLike,
  item,
  tags,
  onCall,
  onWhatsApp,
  featured,
  iconArray,
}) => {

  const auction = item?.item_type === 'auction';

  const auctionPrice =
    auction && item?.current_price != null
      ? Number(item?.current_price).toLocaleString()
      : Number(item?.price).toLocaleString();

  const { token } = useSelector(store => store.user);
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress} style={styles.card}>
      <ImageFast source={source} style={styles.img}>
        {featured && (
          <View style={styles.featuredCard}>
            <CustomText label={'Featured'} color={colors.white} fontSize={10} />
          </View>
        )}
        {token && (
          <TouchableOpacity style={styles.likeBtn} onPress={onLike}>
            <Icons
              name={item?.like === 'like' ? 'heart' : 'hearto'}
              family={'AntDesign'}
              size={12}
              color={item?.like === 'like' ? colors.red : colors.white}
            />
          </TouchableOpacity>
        )}
        {tags?.length > 0 && (
          <View style={styles.tagContainer}>
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
                      label={tag?.name}
                      numberOfLines={1}
                      fontSize={10}
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

      <View style={{ padding: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
           
            <CustomText
              label={title}
              fontFamily={fonts.semiBold}
              numberOfLines={2}
              lineHeight={20}
              marginTop={15}
              fontSize={15}
            />
          </View>
        <CustomText label={description} fontSize={12} numberOfLines={2} color={colors.grey} />
        <View style={{ zIndex: 1, marginTop: 5 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                />
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.row}>
          <View style={styles.row}>
            <CustomText label={time} fontSize={10} color={colors.grey} />
            <CustomText
              label={date}
              fontSize={10}
              color={colors.grey}
              marginLeft={4}
            />
          </View>
          <CustomText
            label={ `PKR ${auctionPrice}` || `PKR ${Number(price).toLocaleString()}`}
            fontSize={17}
            fontFamily={fonts.bold}
            color={colors.primaryColor}
            numberOfLines={1}
          />
        </View>
      </View>
      <View style={styles.row}>
        <CustomButton
          width="49.5%"
          title={'Call'}
          borderRadius={0}
          customStyle={{ borderBottomLeftRadius: 12 }}
          onPress={onCall}
        />
        <CustomButton
          width="49.5%"
          title={'Whatsapp'}
          borderRadius={0}
          customStyle={{ borderBottomEndRadius: 12 }}
          onPress={onWhatsApp}
        />
      </View>
    </TouchableOpacity>
  );
};

export default GridViewCard;

const styles = StyleSheet.create({
  icon: {
    height: 18,
    width: 18,
    marginLeft: 4,
  },
  card: {
    marginBottom: 14,
    backgroundColor: 'white',
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  videoCard: {
    padding: 6,
    backgroundColor: '#171D24',
    position: 'absolute',
    zIndex: 999,
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    height: 200,
    width: '100%',
    borderRadius: 10,
  },
  likeBtn: {
    borderRadius: 99,
    position: 'absolute',
    backgroundColor: '#0000009E',
    bottom: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    padding: 7,
  },
  labelCard: {
    paddingHorizontal: 9,
    marginTop: 5,
    maxWidth: 85,
    marginRight: 10,
    alignItems: 'center',
    borderRadius: 4,
    paddingTop: 2,
    paddingBottom: 1,
    height: 19,
  },
  tagContainer: {
    zIndex: 1,
    right: 0,
    paddingTop: 5,
    position: 'absolute',
  },
  featuredCard: {
    height: 19,
    width: 50,
    position: 'absolute',
    zIndex: 999,
    top: 10,
    left: 10,
    backgroundColor: colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
});

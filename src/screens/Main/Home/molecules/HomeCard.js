import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import fonts from '../../../../assets/fonts';
import { Images } from '../../../../assets/images';
import CustomText from '../../../../components/CustomText';
import Icons from '../../../../components/Icons';
import ImageFastWrapper from '../../../../components/ImageFast';
import SkeletonCard from '../../../../components/SkeletonCard';
import { colors } from '../../../../utils/colors';
import { imgUrl } from '../../../../utils/constants';

const calculateTimeLeft = (startDate, startTime, endDate, endTime) => {
  const startDateTime = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);
  const now = new Date();

  if (now < startDateTime) {
    return 'Auction has not started yet';
  }

  const timeDifference = endDateTime - now;

  if (timeDifference <= 0) {
    return 'Auction has ended';
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  let timeLeft = '';
  if (days > 0) timeLeft += `${days}d `;
  if (hours > 0) timeLeft += `${hours}h `;
  if (minutes > 0) timeLeft += `${minutes}m `;
  if (seconds > 0) timeLeft += `${seconds}s`;

  return timeLeft;
};

const HomeCard = ({
  source,
  price,
  title,
  car,
  news,
  events,
  date,
  location,
  loading,
  item,
  featured,
  isRelated,
}) => {
  const navigation = useNavigation();
  const auction = item?.item_type === 'auction';
  const [timeLeft, setTimeLeft] = useState('');

  const auctionPrice =
    auction && item?.current_price != null
      ? Number(item?.current_price).toLocaleString()
      : Number(item?.price).toLocaleString();

  useEffect(() => {
    if (
      item?.start_date &&
      item?.start_time &&
      item?.end_date &&
      item?.end_time
    ) {
      const initialTimeLeft = calculateTimeLeft(
        item.start_date,
        item.start_time,
        item.end_date,
        item.end_time,
      );
      setTimeLeft(initialTimeLeft);

      const intervalId = setInterval(() => {
        const updatedTimeLeft = calculateTimeLeft(
          item.start_date,
          item.start_time,
          item.end_date,
          item.end_time,
        );
        setTimeLeft(updatedTimeLeft);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [item]);

  const handlePress = () => {
    if (news) {
      navigation.navigate('NewsDetails', { blogId: item?.id });
    } else if (isRelated) {
      navigation.push('Detail', { itemId: item?.id });
    } else {
      navigation.navigate('Detail', { itemId: item?.id });
    }
  };

  let customFields = item?.custom_fileds_data
    ? JSON?.parse(item?.custom_fileds_data)
    : '';

  let featuredFields = Array.isArray(customFields)
    ? customFields.filter(field => field?.featured == 1)
    : [];

  let tags = Array.isArray(customFields)
    ? customFields.filter(field => field?.hightlights == 1)
    : [];

  return loading ? (
    <SkeletonCard />
  ) : (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.cardContainer, { width: news || events ? 240 : 160 }]}>
      {featured && (
        <View style={styles.feature}>
          <CustomText label={'Featured'} color={'#fff'} fontSize={10} />
        </View>
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
      <ImageFastWrapper source={source} style={styles.image} />

      <View style={{ padding: 12 }}>
        {!news && !events && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomText
              label={'PKR'}
              fontFamily={fonts.semiBold}
              color={colors.primaryColor}
              marginRight={5}
            />
            <CustomText
              fontFamily={fonts.bold}
              numberOfLines={1}
              textStyle={styles.price}
              label={auction ? auctionPrice : price}
              color={colors.primaryColor}
            />
          </View>
        )}
        <CustomText
          numberOfLines={car ? 1 : 2}
          fontFamily={fonts.semiBold}
          label={title}
          // translation={news}
          fontSize={13}
        />
        {car && (
          <CustomText
            fontSize={10}
            numberOfLines={2}
            textStyle={styles.title}
            label={car}
          />
        )}
        {auction && (
          <>
            <View style={styles.row1}>
              <Icons
                name={'clockcircleo'}
                family={'AntDesign'}
                size={12}
                color={colors.red}
              />
              <CustomText
                fontSize={10}
                numberOfLines={2}
                textStyle={styles.title}
                label={timeLeft}
                marginLeft={3}
                color={colors.red}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={Images.bid} style={{ height: 12, width: 12 }} />
              <CustomText
                fontSize={10}
                numberOfLines={2}
                textStyle={styles.title}
                label={`${item?.bids} bids`}
                marginLeft={3}
              />
            </View>
          </>
        )}

        {news && (
          <>
            <View style={[styles.row1, { marginTop: 5 }]}>
              <Icons name={'clockcircleo'} family={'AntDesign'} size={12} />
              <CustomText
                fontSize={10}
                numberOfLines={2}
                textStyle={styles.title}
                label={news}
                marginLeft={3}
              />
            </View>
          </>
        )}
        <View style={styles.customField}>
          {featuredFields?.map((obj, index) => (
            <View
              style={[styles.row, { width: '50%', marginRight: 0 }]}
              key={index}>
              <ImageFastWrapper
                svgH={17}
                svgW={17}
                source={{ uri: imgUrl + obj?.image }}
                style={{ height: 17, width: 17 }}
              />
              <CustomText
                label={obj?.value}
                fontSize={10}
                marginLeft={1}
                numberOfLines={1}
                width={40}
              />
            </View>
          ))}
        </View>
        {events && (
          <>
            <View style={styles.row1}>
              <Icons name={'calendar'} family={'AntDesign'} size={12} />
              <CustomText
                fontSize={10}
                numberOfLines={2}
                textStyle={styles.title}
                label={date}
                marginRight={10}
                marginLeft={3}
              />
              <Icons name={'location'} family={'EvilIcons'} size={12} />
              <CustomText
                fontSize={10}
                numberOfLines={2}
                textStyle={styles.title}
                label={location}
              />
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: 160,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    margin: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
  },

  likeIcon: {
    width: 34,
    height: 34,
    position: 'absolute',
    zIndex: 999,
    bottom: 80,
    right: 4,
  },
  customField: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 2,
    marginRight: 10,
  },
  labelCard: {
    zIndex: 1,
    paddingTop: 2,
    paddingHorizontal: 9,
    marginTop: 5,
    maxWidth: 85,
    marginRight: 10,
    alignItems: 'center',
    borderRadius: 4,
    paddingBottom: 1,
  },
  tagContainer: {
    zIndex: 1,
    position: 'absolute',
    right: 0,
    top: 2,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  feature: {
    height: 20,
    width: 55,
    position: 'absolute',
    zIndex: 999,
    top: 7,
    left: 6,
    backgroundColor: colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
});

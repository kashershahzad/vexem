import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import fonts from '../../../assets/fonts';
import CustomText from '../../../components/CustomText';
import ImageFast from '../../../components/ImageFast';
import { colors } from '../../../utils/colors';
import moment from 'moment';
import { Images } from '../../../assets/images';
import ImageFastWrapper from '../../../components/ImageFast';
import { Image } from 'react-native';
import { imgUrl } from '../../../utils/constants';

const calculateRemainingDays = targetDate => {
  const currentDate = moment().startOf('day');
  const futureDate = moment(targetDate, 'MMM DD, YYYY').startOf('day');

  if (currentDate.isAfter(futureDate)) {
    return 'Expired';
  }

  const remainingDays = futureDate.diff(currentDate, 'days');

  if (remainingDays === 0) {
    return 'Today';
  }

  return remainingDays + ' days left';
};

const getTimeLeft = (startTime, endTime) => {
  const start = moment(startTime, 'HH:mm');
  const end = moment(endTime, 'HH:mm');

  if (!start.isValid() || !end.isValid()) return 'Invalid time';

  const duration = moment.duration(end.diff(start));

  if (duration.asMinutes() <= 0) {
    return 'Time is up';
  }

  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.asMinutes()) % 60;

  return `${hours}h ${minutes}m left`;
};

const FeatureCard = ({ item, onPress, storeIcon, onBodyPress, ishori }) => {
  let otherImagesArray = [];
  let otherImagesLength = 0;
  try {
    otherImagesArray = JSON.parse(item.other_images);
    if (Array.isArray(otherImagesArray)) {
      otherImagesLength = otherImagesArray.length;
    } else {
      console.warn('Parsed other_images is not an array.');
    }
  } catch (error) {
    console.error('Failed to parse other_images:', error);
  }

  return (
    <TouchableOpacity
      style={[styles.adBox, { width: ishori ? 200 : '48%' }]}
      activeOpacity={0.5}
      onPress={onBodyPress}>
      <TouchableOpacity onPress={onPress}>
        <ImageFast
          source={{ uri: item?.image }}
          style={[styles.adImg, { width: ishori ? 200 : '' }]}
          resizeMode="cover"
        />

        {storeIcon && (
          <View
            style={{
              position: 'absolute',
              backgroundColor: '#fff',
              left: 10,
              top: 10,
              borderRadius: 8,
              elevation: 5, // Makes it visibly raised on Android
              zIndex: 999, // Ensures it's above other content on iOS
              padding: 5, // Optional padding for spacing
              shadowColor: '#000', // iOS shadow
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}>
            <ImageFastWrapper
              source={{ uri: storeIcon }}
              style={styles.storelogo}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.badge}>
          <CustomText
            label={`+ ${otherImagesLength}`}
            fontFamily={fonts.bold}
            fontSize={16}
            color={colors.white}
            numberOfLines={1}
          />
        </View>
      </TouchableOpacity>
      <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
        <CustomText
          label={item?.name}
          fontFamily={fonts.bold}
          fontSize={16}
          numberOfLines={1}
        />
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={Images.location}
              style={{ width: 15, height: 15 }}
              resizeMode="contain"
            />

            <CustomText
              label={'All Branch'}
              fontFamily={fonts.regular}
              fontSize={12}
              color={colors.grey}
              numberOfLines={1}
            />
          </View>
          <CustomText
            label={calculateRemainingDays(item?.end_date)}
            fontFamily={fonts.regular}
            fontSize={12}
            color={colors.red}
            numberOfLines={1}
          />
        </View>

        {item?.start_time &&
          item?.end_time &&
          item.start_time !== '00:00:00' &&
          item.end_time !== '00:00:00' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <CustomText
                label={moment(item?.start_time, 'HH:mm:ss').format('hh:mm A')}
                fontFamily={fonts.regular}
                fontSize={12}
                color={colors.black}
                numberOfLines={1}
              />
              <CustomText
                label={moment(item?.end_time, 'HH:mm:ss').format('hh:mm A')}
                fontFamily={fonts.regular}
                fontSize={12}
                color={colors.black}
                numberOfLines={1}
              />
            </View>
          )}
      </View>
    </TouchableOpacity>
  );
};

export default FeatureCard;

const styles = StyleSheet.create({
  adBox: {
    marginRight: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '48%',
  },
  adImg: {
    height: 220,
    borderRadius: 10,
    position: 'relative',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  badge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: '#00000075',
    padding: 5,
    borderRadius: 5,
  },

  storelogo: {
    height: 40,
    width: 40,
    borderRadius: 8,
    zIndex: 9999,
  },
});

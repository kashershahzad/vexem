import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, Platform, View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { useSelector } from 'react-redux';

import fonts from '../../../assets/fonts';
import { Images } from '../../../assets/images';
import CustomButton from '../../../components/CustomButton';
import CustomText from '../../../components/CustomText';
import Layout from '../../../components/Layout';
import { className } from '../../../global-styles';
import { ToastMessage } from '../../../utils/ToastMessage';
import ApiRequest from '../../../services/ApiRequest';
import { GOOGLE_API_KEY } from '../../../utils/constants';

const LocationAccess = () => {
  //

  const navigation = useNavigation();
  const { token } = useSelector(store => store.user);

  const [loading, setLoading] = useState(false);

  const requestLocationPermission = async () => {
    try {
      let permission;
      if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      } else if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      }

      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        return true;
      } else {
        ToastMessage('Please enable location to find nearby products.');
        return false;
      }
    } catch (err) {
      console.log('Location Permission Error:', err);
      return false;
    }
  };

  const handleUpdate = async (address, lat, lng) => {
    try {
      const dataToUpdate = {
        type: 'update_data',
        table_name: 'users',
        id: token,
        lat,
        lng,
        address,
      };

      const res = await ApiRequest(dataToUpdate);
      if (res.data?.result) {
        navigation.reset({ index: 0, routes: [{ name: 'ChangeLanguage' }] });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchPlaceName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`,
      );
      const locationData = await response.json();
      handleUpdate(
        locationData?.results[1]?.formatted_address,
        latitude,
        longitude,
      );
    } catch (error) {
      console.error('Error fetching place name:', error);
    }
  };

  const handlePress = async () => {
    const result = await requestLocationPermission();
    if (result) {
      setLoading(true);
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          fetchPlaceName(latitude, longitude);
        },
        error => {
          console.log('Geolocation Error:', error);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  };

  return (
    <Layout showNavBar={false}>
      <View style={className('justify-center align-center flex-1')}>
        <Image source={Images.locationMan} style={className('w-90 h-60')} />
        <CustomText
          label={"What's your location?"}
          fontFamily={fonts.bold}
          fontSize={18}
          marginTop={20}
        />
        <CustomText label={'locationDes'} textAlign={'center'} marginTop={5} />
        <CustomButton
          title={'Grant Permission'}
          customStyle={className('my-8')}
          onPress={handlePress}
          loading={loading}
          disabled={loading}
        />
      </View>
    </Layout>
  );
};

export default LocationAccess;

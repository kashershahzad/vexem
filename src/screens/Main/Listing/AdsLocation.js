import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { useSelector } from 'react-redux';

import { Images } from '../../../assets/images';
import CustomButton from '../../../components/CustomButton';
import GooglePlaces from '../../../components/GooglePlaces';
import Header from '../../../components/Header';
import ScreenWrapper from '../../../components/ScreenWrapper';
import ApiRequest from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import { GOOGLE_API_KEY } from '../../../utils/constants';
import { ToastMessage } from '../../../utils/ToastMessage';

const DEFAULT_LAT = 25.2854;
const DEFAULT_LNG = 51.531;

const AdsLocation = ({ route, navigation }) => {
  const mapViewRef = useRef(null);
  const isMounted = useRef(true);
  const { data, customField, ad } = route.params;
  const { loginUser, token } = useSelector(store => store.user);

  const fallbackLat = Number(loginUser?.lat) || DEFAULT_LAT;
  const fallbackLng = Number(loginUser?.lng) || DEFAULT_LNG;

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(!ad);
  const [addressData, setAddressData] = useState({
    address: ad?.area || '',
    city: '',
    state: '',
    country: '',
    lat: ad ? Number(ad?.lat) || fallbackLat : fallbackLat,
    lng: ad ? Number(ad?.lng) || fallbackLng : fallbackLng,
  });

  const fetchPlaceName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`,
      );
      const locationData = await response.json();

      if (locationData?.status === 'OK' && locationData?.results?.length > 0) {
        return locationData.results[0].formatted_address;
      }

      console.log('[AdsLocation] geocode failed', locationData?.status);
      return '';
    } catch (error) {
      console.error('[AdsLocation] Error fetching place name:', error);
      return '';
    }
  };

  const animateTo = useCallback((latitude, longitude) => {
    if (mapViewRef.current && latitude && longitude) {
      mapViewRef.current.animateToRegion(
        {
          latitude: Number(latitude),
          longitude: Number(longitude),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        500,
      );
    }
  }, []);

  const applyLocation = useCallback(
    async (latitude, longitude) => {
      const lat = Number(latitude);
      const lng = Number(longitude);
      if (!lat || !lng) return;

      const placeName = await fetchPlaceName(lat, lng);
      if (!isMounted.current) return;

      setAddressData(prev => ({
        ...prev,
        address: placeName || prev.address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        lat,
        lng,
      }));
      animateTo(lat, lng);
    },
    [animateTo],
  );

  const requestLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        return true;
      }

      ToastMessage('Please enable location to set your ad location.');
      return false;
    } catch (err) {
      console.log('[AdsLocation] Location Permission Error:', err);
      return false;
    }
  };

  const getCurrentLocation = useCallback(async () => {
    setLocating(true);
    const granted = await requestLocationPermission();

    if (!granted) {
      await applyLocation(fallbackLat, fallbackLng);
      setLocating(false);
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        try {
          const { latitude, longitude } = position.coords;
          console.log('[AdsLocation] current GPS', { latitude, longitude });
          await applyLocation(latitude, longitude);
        } finally {
          if (isMounted.current) setLocating(false);
        }
      },
      async error => {
        console.log('[AdsLocation] Geolocation Error:', error);
        await applyLocation(fallbackLat, fallbackLng);
        if (isMounted.current) setLocating(false);
        ToastMessage('Could not get current location. Using default.');
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 10000,
      },
    );
  }, [applyLocation, fallbackLat, fallbackLng]);

  useEffect(() => {
    isMounted.current = true;

    if (ad) {
      const lat = Number(ad?.lat) || fallbackLat;
      const lng = Number(ad?.lng) || fallbackLng;
      setAddressData({
        address: ad?.area || '',
        city: '',
        state: '',
        country: '',
        lat,
        lng,
      });
      setTimeout(() => animateTo(lat, lng), 300);
      setLocating(false);
    } else {
      getCurrentLocation();
    }

    return () => {
      isMounted.current = false;
    };
  }, [ad]);

  const handlePress = async () => {
    try {
      if (!addressData?.lat || !addressData?.lng) {
        return ToastMessage('Please select a location on the map');
      }

      setLoading(true);
      const dataToPost = {
        type: ad ? 'update_data' : 'add_data',
        table_name: 'items',
        area: addressData.address,
        city: addressData.city || '',
        state: addressData.state || '',
        country: addressData.country || '',
        lat: addressData.lat,
        lng: addressData.lng,
        custom_fileds_data: customField,
        user_id: token,
        ...data,
      };

      if (ad) {
        dataToPost.id = ad?.id;
      }

      const response = await ApiRequest(dataToPost);
      console.log(response?.data, 'response');
      setLoading(false);

      if (response.data?.result) {
        navigation.navigate('SuccessScreen', {
          msg: ad ? 'Your ad updated successfully' : '',
        });
      } else {
        ToastMessage(response?.data?.message || 'Failed to create ad');
      }
    } catch (error) {
      console.log(error, 'errr in create ad');
      setLoading(false);
      ToastMessage('Something went wrong');
    }
  };

  const handleRegionChangeComplete = async region => {
    if (locating) return;

    const name = await fetchPlaceName(region.latitude, region.longitude);
    if (!isMounted.current) return;

    setAddressData(prev => ({
      ...prev,
      address:
        name ||
        prev.address ||
        `${region.latitude.toFixed(5)}, ${region.longitude.toFixed(5)}`,
      lat: region.latitude,
      lng: region.longitude,
    }));
  };

  return (
    <ScreenWrapper
      paddingHorizontal={0.1}
      statusBarColor="white"
      headerUnScrollable={() => <Header title={'Ads Location'} />}
      footerUnScrollable={() => (
        <View style={styles.btnBox}>
          <CustomButton
            onPress={handlePress}
            title={ad ? 'Update Ad' : 'Create Ad'}
            disabled={!addressData.address || loading || locating}
            loading={loading || locating}
          />
        </View>
      )}>
      <View style={styles.topBox}>
        <GooglePlaces
          placeholder="Choose Location"
          value={addressData.address}
          setValue={address => {
            setAddressData(prev => ({
              ...prev,
              address: address,
            }));
          }}
          setState={state => {
            setAddressData(prev => ({
              ...prev,
              state: state,
            }));
          }}
          setLatLong={latLong => {
            setAddressData(prev => ({
              ...prev,
              lat: latLong?.latitude,
              lng: latLong?.longitude,
            }));

            if (mapViewRef.current && latLong?.latitude && latLong?.longitude) {
              mapViewRef.current.animateToRegion({
                latitude: latLong.latitude,
                longitude: latLong.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              });
            }
          }}
        />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.mapStyle}
          ref={mapViewRef}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: addressData.lat,
            longitude: addressData.lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          loadingEnabled={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onRegionChangeComplete={handleRegionChangeComplete}
        />
        <View style={styles.markerFixed}>
          <Image source={Images.mapPin} style={styles.marker} />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AdsLocation;

const styles = StyleSheet.create({
  btnBox: {
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  mapContainer: {
    flex: 1,
  },
  mapStyle: {
    flex: 1,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    height: 45,
    width: 45,
    resizeMode: 'contain',
  },
  topBox: {
    height: 80,
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

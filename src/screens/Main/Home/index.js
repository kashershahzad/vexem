/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import Geolocation from '@react-native-community/geolocation';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { useDispatch, useSelector } from 'react-redux';
import fonts from '../../../assets/fonts';
import CardSkeleton from '../../../components/CardSekeleton';
import CustomText from '../../../components/CustomText';
import Icons from '../../../components/Icons';
import ImageFast from '../../../components/ImageFast';
import ScreenWrapper from '../../../components/ScreenWrapper';
import SearchBar from '../../../components/SearchBar';
import SwiperSkeleton from '../../../components/SwiperSkeleton';
import TextSpaceBetween from '../../../components/TextSpaceBetween';
import ApiRequest from '../../../services/ApiRequest';
import { setCategories } from '../../../store/reducer/categorySlice';
import { getUserProfile } from '../../../store/reducer/usersSlice';
import { ToastMessage } from '../../../utils/ToastMessage';
import { colors } from '../../../utils/colors';
import { GOOGLE_API_KEY, imgUrl } from '../../../utils/constants';
import HomeCard from './molecules/HomeCard';
import HomeCategory from './molecules/HomeCategory';
import HomeSlider from './molecules/HomeSilder';
import JobCard from './molecules/JobCard';
const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_COUNT = 7;
const ITEM_MARGIN = 10; // optional margin between items

// Calculate item width to fit 6 items (including margin spacing)
const ITEM_WIDTH = (SCREEN_WIDTH - ITEM_MARGIN * (ITEM_COUNT + 1)) / ITEM_COUNT;

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const [homeData, setHomeData] = useState([]);
  const [homeData2, setHomeData2] = useState([]);
  const [category, setCategory] = useState([]);
  const [loadingPrimary, setLoadingPrimary] = useState(true);
  const [loadingSecondary, setLoadingSecondary] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { token } = useSelector(store => store?.user);

  const categoryWithSeeMore = [...category];

  if (category?.length > 0) {
    const tr = JSON.stringify({ ar: 'أخبار', en: 'News' });
    const newsObj = {
      image: 'https://vexem.co/api/news.gif',
      translations: tr,
      id: -1,
    };

    categoryWithSeeMore.push({ id: 8, name: 'See More' });

    categoryWithSeeMore.sort((a, b) => {
      if (a.featured && b.featured) return 0;
      if (a.featured) return -1;
      if (b.featured) return 1;
      return 0;
    });

    categoryWithSeeMore[5] = newsObj;
  }

  const onRefresh = () => {
    setRefreshing(true);
    getUserProfile(dispatch, token);
    fetchPrimaryData();
    handleLocation();
  };

  // Fetch the primary data first (get_home)
  const fetchPrimaryData = async () => {
    setLoadingPrimary(true);

    try {
      let body = {
        type: 'get_home',
        user_id: token,
      };

      const res = await ApiRequest(body);
      console.log('get_home response:', JSON.stringify(res?.data, null, 2));
      console.log('stores:', res?.data?.data?.store);
      setHomeData(res?.data?.data);

      if (res?.data?.data?.category) {
        setCategory(res?.data?.data?.category);
        dispatch(setCategories(res?.data?.data?.category));
      }

      setLoadingPrimary(false);
      fetchSecondaryData();
    } catch (error) {
      setLoadingPrimary(false);
      console.log(error, 'err in get home');
    }
  };
  const fetchSecondaryData = async () => {
    setLoadingSecondary(true);

    try {
      let body = {
        type: 'get_home_2',
        user_id: token,
      };

      const res = await ApiRequest(body);
      setHomeData2(res?.data?.data);
      setLoadingSecondary(false);
      setRefreshing(false);
    } catch (error) {
      setLoadingSecondary(false);
      setRefreshing(false);
      console.log(error, 'err in get home 2');
    }
  };

  const handleSliderPress = slider => {
    try {
      if (slider?.item_id && slider?.item_id !== '0') {
        return navigation.navigate('Detail', { itemId: slider?.item_id });
      }

      if (slider?.cat_id && slider?.cat_id !== '0') {
        return navigation.navigate('Result', {
          subCat: { id: slider?.cat_id || '', name: '' },
        });
      }

      if (slider?.third_party_link) {
        return Linking.openURL(slider?.third_party_link);
      }
    } catch (error) {
      console.log(error, 'err in slider press');
    }
  };

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
        ToastMessage('Please enable location to find nearby ads.');
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

      await ApiRequest(dataToUpdate);
    } catch (error) {
      console.log(error);
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

  const handleLocation = async () => {
    const result = await requestLocationPermission();
    if (result) {
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          fetchPlaceName(latitude, longitude);
        },
        error => {
          console.log('Geolocation Error:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  };

  const sliderImages = homeData?.slider || [];

  useEffect(() => {
    getUserProfile(dispatch, token);
    fetchPrimaryData();
    handleLocation();
  }, [dispatch, token]);

  const handleAddressChange = address => {
    setAddressData({
      address: address.address,
      lat: address.lat,
      lng: address.lng,
    });

    // if (mapViewRef.current) {
    //   mapViewRef.current.animateToRegion({
    //     latitude: address.lat,
    //     longitude: address.lng,
    //     latitudeDelta: 0.05,
    //     longitudeDelta: 0.05,
    //   });
    // }
  };
  return (
    <ScreenWrapper
      scrollEnabled
      paddingBottom={70}
      paddingHorizontal={0.1}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          colors={[colors.primaryColor]}
          onRefresh={onRefresh}
        />
      }
      statusBarColor={colors.mainBg}>
      <View style={{ paddingHorizontal: 0, marginTop: 10 }}>
        <View style={{ paddingHorizontal: 16 }}>
          <SearchBar
            onSearchPress={() =>
              navigation.navigate('Result', { search: true })
            }
            placeHolder="Search here..."
            marginTop={12}
            marginBottom={16}
            editable={false}
            home
          />
        </View>
        {/* <View style={{ paddingHorizontal: 16 }}>
          {loadingPrimary ? (
            <View style={styles.mapContainer}>
              {[1, 2, 3, 4].map((item, index) => (
                <CardSkeleton key={index} isStore />
              ))}
            </View>
          ) : homeData?.store ? (
            <ScrollView
              horizontal
              contentContainerStyle={styles.tabContainer}
              showsHorizontalScrollIndicator={false}>
              <View style={styles.tabContainer}>
                {homeData?.store.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.5}
                    style={styles.storeBox}
                    onPress={() =>
                      navigation.navigate('StorePage', {
                        store: item,
                        ishome: true,
                      })
                    }>
                    <ImageFast
                      resizeMode={'contain'}
                      source={{ uri: item?.image }}
                      style={styles.image}
                      svgH={55}
                      svgW={42}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          ) 
          // : (
          //   !loadingPrimary && (
          //     <CustomText
          //       label={'No stores found...'}
          //       alignSelf={'center'}
          //       fontFamily={fonts.semiBold}
          //       fontSize={17}
          //       marginBottom={10}
          //       marginTop={10}
          //     />
          //   )
          // )
          : null}
        </View> */}


{loadingPrimary ? (
  <View style={{ paddingHorizontal: 16 }}>
    <View style={styles.mapContainer}>
      {[1, 2, 3, 4].map((item, index) => (
        <CardSkeleton key={index} isStore />
      ))}
    </View>
  </View>
) : homeData?.store?.length > 0 ? (
  <View style={{ paddingHorizontal: 16 }}>
    <ScrollView
      horizontal
      contentContainerStyle={styles.tabContainer}
      showsHorizontalScrollIndicator={false}>
      <View style={styles.tabContainer}>
        {homeData.store.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.5}
            style={styles.storeBox}
            onPress={() =>
              navigation.navigate('StorePage', {
                store: item,
                ishome: true,
              })
            }>
            <ImageFast
              resizeMode={'contain'}
              source={{ uri: item?.image }}
              style={styles.image}
              svgH={55}
              svgW={42}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  </View>
) : null}


        {/* {loadingPrimary ? (
          <View style={{ paddingHorizontal: 16 }}>
            <SwiperSkeleton />
          </View>
        ) : (
          <HomeSlider images={sliderImages} onPress={handleSliderPress} />
        )} */}

{loadingPrimary ? (
  <View style={{ paddingHorizontal: 16 }}>
    <SwiperSkeleton />
  </View>
) : sliderImages?.length > 0 ? (
  <HomeSlider images={sliderImages} onPress={handleSliderPress} />
) : null}

        <View style={{ paddingHorizontal: 16 }}>
          {loadingPrimary ? (
            <View style={[styles.mapContainer, { marginTop: -10 }]}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                <CardSkeleton key={index} />
              ))}
            </View>
          ) : (
            <View style={styles.mapContainer}>
              {categoryWithSeeMore.map((item, index) =>
                item?.id === 8 ? (
                  <View key={index} style={styles.catContainer}>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() =>
                        navigation.navigate('Categories', { type: 'view' })
                      }
                      style={styles.catBox}>
                      <Icons
                        size={25}
                        name={'chevron-thin-right'}
                        family={'Entypo'}
                        color={'#fff'}
                      />
                    </TouchableOpacity>
                    <CustomText
                      fontSize={12}
                      marginTop={4}
                      label={'See More'}
                      textAlign={'center'}
                      fontFamily={fonts.semiBold}
                    />
                  </View>
                ) : (
                  index < 7 && (
                    <HomeCategory
                      key={index}
                      source={{ uri: item?.image }}
                      title={item?.translations}
                      auction={item?.name === 'Auction Live Bidding'}
                      onPress={() =>
                        item?.id === -1
                          ? navigation.navigate('News', { myAd: false })
                          : navigation.navigate('SubCategories', {
                            catData: item,
                            type: { type: 'view' },
                          })
                      }
                    />
                  )
                ),
              )}
            </View>
          )}
        </View>
      </View>

      {/* This is the secondary data section */}
      <TextSpaceBetween
        leftText={'Popular Properties'}
        rightText={'See More'}
        onRightPress={() =>
          navigation.navigate('Result', {
            home: true,
            subCat: {
              name: 'Popular Properties',
              id: homeData2?.category?.properties?.[0]?.main_cat_id,
            },
          })
        }
        marginHorizontal={10}
      />
      {homeData2?.category?.properties?.length === 0 && !loadingSecondary && (
        <CustomText label={'No Ad(s) Found'} alignSelf={'center'} />
      )}
      <FlatList
        data={loadingSecondary ? [1, 2, 3] : homeData2?.category?.properties}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 10 }}
        renderItem={({ item }) => (
          <HomeCard
            item={item}
            loading={loadingSecondary}
            source={{ uri: item?.images }}
            price={Number(item?.price).toLocaleString()}
            title={item?.description}
            featured={item?.featured == 1}
          />
        )}
      />
      <TextSpaceBetween
        leftText={'Popular Cars'}
        rightText={'See More'}
        onRightPress={() =>
          navigation.navigate('Result', {
            home: true,
            subCat: {
              name: 'Popular Cars',
              id: homeData2?.category?.vehicles?.[0]?.main_cat_id,
            },
          })
        }
        marginHorizontal={10}
      />
      {homeData2?.category?.vehicles?.length === 0 && !loadingSecondary && (
        <CustomText label={'No Ad(s) Found'} alignSelf={'center'} />
      )}
      <FlatList
        data={loadingSecondary ? [1, 2, 3] : homeData2?.category?.vehicles}
        horizontal
        contentContainerStyle={{ paddingLeft: 10 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <HomeCard
            item={item}
            loading={loadingSecondary}
            source={{ uri: item?.images }}
            price={Number(item?.price).toLocaleString()}
            title={item?.name}
            featured={item?.featured == 1}
          />
        )}
      />
      <TextSpaceBetween
        leftText={'Live Auction'}
        rightText={'See More'}
        onRightPress={() =>
          navigation.navigate('Result', {
            home: true,
            subCat: {
              name: 'Live Auction',
              id: homeData2?.category?.auctionlivebidding?.[0]?.main_cat_id,
            },
          })
        }
        marginHorizontal={10}
      />
      {homeData2?.category?.auctionlivebidding?.length === 0 && !loadingSecondary && (
        <CustomText label={'No Ad(s) Found'} alignSelf={'center'} />
      )}
      <FlatList
        data={loadingSecondary ? [1, 2, 3] : homeData2?.category?.auctionlivebidding}
        horizontal
        contentContainerStyle={{ paddingLeft: 10 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <HomeCard
            item={item}
            loading={loadingSecondary}
            source={{ uri: item?.images }}
            price={Number(item?.price).toLocaleString()}
            title={item?.name}
            auctionTIme={item?.end_time}
            auction={'10 Bids'}
            featured={item?.featured == 1}
          />
        )}
      />
      <TextSpaceBetween
        leftText={'Electronics'}
        rightText={'See More'}
        onRightPress={() =>
          navigation.navigate('Result', {
            home: true,
            subCat: {
              name: 'Electronics',
              id: homeData2?.category?.mobilephonescomputer?.[0]?.main_cat_id,
            },
          })
        }
        marginHorizontal={10}
      />
      {homeData2?.category?.mobilephonescomputer?.length === 0 && !loadingSecondary && (
        <CustomText label={'No Ad(s) Found'} alignSelf={'center'} />
      )}
      <FlatList
        data={
          loadingSecondary ? [1, 2, 3] : homeData2?.category?.mobilephonescomputer
        }
        horizontal
        contentContainerStyle={{ paddingLeft: 10 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <HomeCard
            item={item}
            loading={loadingSecondary}
            source={{ uri: item?.images }}
            price={Number(item?.price).toLocaleString()}
            title={item?.name}
            auctionTIme={item?.end_time}
            auction={'10 Bids'}
            featured={item?.featured == 1}
          />
        )}
      />
      <TextSpaceBetween
        leftText={'Jobs'}
        rightText={'See More'}
        onRightPress={() =>
          navigation.navigate('Result', {
            home: true,
            subCat: {
              name: 'Jobs',
              id: homeData2?.jobs?.[0]?.main_cat_id,
            },
          })
        }
        marginHorizontal={10}
      />
      {homeData2?.jobs?.length === 0 && !loadingSecondary && (
        <CustomText label={'No job Found'} alignSelf={'center'} />
      )}
      <FlatList
        data={loadingSecondary ? [1, 2, 3] : homeData2?.jobs}
        horizontal
        contentContainerStyle={{ paddingLeft: 10 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <JobCard
            item={item}
            loading={loadingSecondary}
            source={{ uri: imgUrl + item?.images }}
            price={Number(item?.price).toLocaleString()}
            title={item?.name}
            auctionTIme={item?.end_time}
            auction={'10 Bids'}
            featured={item?.featured == 1}
          />
        )}
      />
      <TextSpaceBetween
        leftText={'Popular News'}
        rightText={'See More'}
        marginHorizontal={10}
        onRightPress={() => navigation.navigate('News', { myAd: false })}
      />
      {homeData2?.news?.length === 0 && !loadingSecondary && (
        <CustomText label={'No News Found'} alignSelf={'center'} />
      )}
      <FlatList
        data={loadingSecondary ? [1, 2, 3] : homeData2?.news}
        horizontal
        contentContainerStyle={{ paddingLeft: 10 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <HomeCard
            item={item}
            loading={loadingSecondary}
            news={item?.timestamp}
            source={{ uri: item?.image }}
            title={item?.title}
            featured={item?.featured == 1}
          />
        )}
      />
      <TextSpaceBetween
        leftText={'Popular Events'}
        rightText={'See More'}
        marginHorizontal={10}
        onRightPress={() => navigation.navigate('Events')}
      />
      {homeData2?.events?.length === 0 && !loadingSecondary && (
        <CustomText label={'No Events Found'} alignSelf={'center'} />
      )}
      <FlatList
        data={loadingSecondary ? [1, 2, 3] : homeData2?.events}
        horizontal
        contentContainerStyle={{ paddingLeft: 10 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <HomeCard
            item={item}
            loading={loadingSecondary}
            news={item?.timestamp}
            source={{ uri: item?.image }}
            title={item?.title}
            featured={item?.featured == 1}
          />
        )}
      />
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
  tabContainer: {
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  mapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  catBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: colors.primaryColor,
    height: 80,
    borderRadius: 8,
  },
  banner: {
    height: 200,
    width: '100%',
  },
  imageSlider: {
    width: 350,
    height: 200,
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  storeBox: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH, // make it square
    marginHorizontal: ITEM_MARGIN / 4,
    backgroundColor: colors.white,
    paddingHorizontal: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  catContainer: {
    width: '22%',
    marginLeft: 7,
    alignItems: 'center',
  },
});
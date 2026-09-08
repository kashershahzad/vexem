/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import fonts from '../../../assets/fonts';
import CustomText from '../../../components/CustomText';
import EmptyComponent from '../../../components/EmptyComponent';
import ScreenWrapper from '../../../components/ScreenWrapper';
import ApiRequest from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import { imgUrl } from '../../../utils/constants';
import { AppLoader } from '../../../components/AppLoader';
import SliderModal from '../../../components/ModaISlider';
import SearchBar from '../../../components/SearchBar';
import { useSelector } from 'react-redux';
import FeatureCard from './FeatureCard';
import { Images } from '../../../assets/images';
import ImageFastWrapper from '../../../components/ImageFast';
import CustomPositionDropdown from '../../../components/CustomPostionDropDown';

const StorePage = ({ route, navigation }) => {
  const store = route?.params?.store;

  const ishome = route?.params?.ishome;
  const { token } = useSelector(store => store?.user);

  // State management
  const [locationValue, setLocationValue] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedAd, setSelectedAd] = useState({});
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [offerCategories, setOfferCategories] = useState([]);
  const [storeLocations, setStoreLocations] = useState([]);

  const images = selectedAd?.other_images
    ? JSON.parse(selectedAd?.other_images)
    : [];

  // Fetch store locations
  const fetchStoreLocations = async () => {
    try {
      const body = {
        type: 'get_data',
        table_name: 'store_locations',
        store_id: store?.id,
        limit: 100,
      };

      const response = await ApiRequest(body);

      if (response?.data?.data) {
        const locations = response.data.data.map(item => ({
          title: item?.address,
          _id: item?.id,
        }));

        const allCategory = {
          id: 'all',
          title: 'All Branch',
        };
        const final = [allCategory, ...locations];
        setStoreLocations(final);
      }
    } catch (error) {
      console.log('Error fetching store locations:', error);
    }
  };

  // Fetch offer categories
  const fetchOfferCategories = async () => {
    try {
      setIsRefreshing(true);

      const body = {
        type: 'get_data',
        table_name: 'offer_categories',
      };

      const response = await ApiRequest(body);

      if (response?.data?.data) {
        const allCategory = {
          id: 'all',
          name: 'All Offers',
          translations: '{"en":"All Offers","ar":"الكل"}',
        };

        const categories = [allCategory, ...response.data.data];
        setOfferCategories(categories);

        if (!selectedCategory?.id) {
          setSelectedCategory(allCategory);
        }
      }
    } catch (error) {
      console.log('Error fetching offer categories:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch store offers based on filters
  const fetchStoreOffers = async () => {
    try {
      setIsLoading(true);

      const body = {
        type: 'get_data',
        table_name: 'items',
        item_type: 'offer',
        store_id: store?.id,
        user_id: token,
        ...(selectedCategory?.id !== 'all' && {
          store_cat_id: selectedCategory?.id,
        }),
        ...(locationValue && {
          store_locations:
            locationValue?.id === 'all' ? locationValue?.id : locationValue,
        }),
        search: searchValue?.trim(),
      };


      const response = await ApiRequest(body);

      if (response?.data?.data) {
        setCategoryData(response.data.data);

        // Filter featured offers
        const featured = response.data.data.filter(
          item => item.featured === '1',
        );

        setFeaturedOffers(featured);
      }
    } catch (error) {
      console.log('Error fetching store offers:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    Promise.all([
      fetchOfferCategories(),
      fetchStoreLocations(),
      fetchStoreOffers(),
    ]).finally(() => {
      setIsRefreshing(false);
    });
  }, []);

  // Initial data loading
  useEffect(() => {
    fetchOfferCategories();
    fetchStoreLocations();
  }, []);

  // Fetch offers when filters change
  useEffect(() => {
    fetchStoreOffers();
  }, [selectedCategory?.id, locationValue, searchValue]);

  // Handle ad selection for modal
  const handleAdSelect = ad => {
    setSelectedAd(ad);
    setShowImageModal(true);
  };

  return (
    <>
      <ScreenWrapper
        scrollEnabled
        paddingHorizontal={0.1}
        translucent
        statusBarColor="transparent"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primaryColor]}
          />
        }>
        <View style={styles.upContainer}>
          <View style={{ marginTop: 60 }}>
            <SearchBar
              placeHolder="Search here..."
              marginTop={12}
              marginBottom={16}
              editable={true}
              isStore={true}
              value={searchValue}
              onChangeText={setSearchValue}
            />
          </View>

          <View>
            <ImageFastWrapper
              source={{ uri: imgUrl + store?.banner }}
              style={styles.storeimage}
              resizeMode="cover">
              <ImageFastWrapper
                source={Images.gradient}
                style={styles.gradient}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    position: 'absolute',
                    width: '100%',
                    bottom: 20,
                    left: 10,
                    gap: 10,
                  }}>
                  <ImageFastWrapper
                    source={
                      ishome ? { uri: store?.image } : { uri: store?.logo }
                    }
                    style={styles.storelogo}
                    resizeMode="contain"
                  />
                  <CustomText
                    label={store?.name}
                    fontSize={17}
                    width={150}
                    numberOfLines={1}
                    fontFamily={fonts.bold}
                    color={colors.white}
                  />
                </View>
              </ImageFastWrapper>
            </ImageFastWrapper>

            <View
              style={{
                position: 'absolute',
                zIndex: 100,
                bottom: 25,
                right: 0,
              }}>
              <CustomPositionDropdown
                data={storeLocations}
                value={locationValue}
                setValue={setLocationValue}
                placeholder="All branch"
                width={150}
                transparent
                useModal={true} // Use modal approach
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginTop: 10,
            }}>
            <Image source={Images.crown} style={styles.crown} />
            <CustomText
              label={'Featured Offers'}
              fontSize={17}
              fontFamily={fonts.semiBold}
              color={colors.white}
            />
          </View>

          <View style={{ flex: 1 }}>
            {featuredOffers?.length > 0 ? (
              <FlatList
                data={featuredOffers}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <FeatureCard
                    ishori
                    storeIcon={ishome ? store?.image : store?.logo}
                    item={item}
                    onBodyPress={() =>
                      navigation.navigate('OfferAdDetails', { ad: item })
                    }
                    onPress={() =>
                      navigation.navigate('OfferAdDetails', { ad: item })
                    }
                  />
                )}
                keyExtractor={(item, index) => `featured-${item.id || index}`}
              />
            ) : (
              <EmptyComponent isStore={true} />
            )}
          </View>
        </View>
        <View>
          <FlatList
            data={store?.category ? store?.category : offerCategories}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  padding: 10,
                  height: 40,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  borderRadius: 5,
                  marginRight: 5,
                  marginTop: 10,
                  marginLeft: 10,
                  backgroundColor:
                    selectedCategory?.id === item?.id
                      ? colors.primaryColor
                      : colors.white,
                }}
                onPress={() => setSelectedCategory(item)}>
                <Image
                  source={
                    item?.image ? { uri: imgUrl + item?.image } : Images.cat1
                  }
                  style={{
                    width: 20,
                    height: 20,
                    tintColor:
                      selectedCategory?.id === item?.id
                        ? colors.white
                        : colors.primaryColor,
                  }}
                  resizeMode={'contain'}
                />
                <CustomText
                  translation
                  label={item?.translations}
                  color={
                    selectedCategory?.id === item?.id
                      ? colors.white
                      : colors.primaryColor
                  }
                  fontSize={10}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => `category-${item.id || index}`}
          />
        </View>

        <View
          style={{
            flex: 1,
            marginTop: 10,
            paddingHorizontal: 10,
            marginLeft: 5,
            width: '100%',
          }}>
          {categoryData?.length > 0 ? (
            <FlatList
              data={categoryData}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <FeatureCard
                  storeIcon={ishome ? store?.image : store?.logo}
                  item={item}
                  onBodyPress={() =>
                    navigation.navigate('OfferAdDetails', { ad: item })
                  }
                  onPress={() =>
                    navigation.navigate('OfferAdDetails', { ad: item })
                  }
                />
              )}
              keyExtractor={(item, index) => `offer-${item.id || index}`}
            />
          ) : (
            !isLoading && <EmptyComponent />
          )}
        </View>
      </ScreenWrapper>
      <AppLoader show={isLoading} />
      <SliderModal
        url
        images={images}
        isVisible={showImageModal}
        onDisable={() => setShowImageModal(false)}
      />
    </>
  );
};

export default StorePage;

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: 150,
    marginTop: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  btnBox: {
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    padding: 8,
  },
  imgBox: {
    height: 150,
    width: '100%',
  },
  adImg: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  upContainer: {
    backgroundColor: colors.primaryColor,
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  mapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  storeBox: {
    backgroundColor: colors.white,
    paddingHorizontal: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  image: {
    width: 40,
    height: 42,
  },
  tabContainer: {
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
  },

  crown: {
    height: 20,
    width: 20,
  },

  storeimage: {
    width: '100%',
    height: 160,
    marginTop: 20,
    borderRadius: 10,
  },

  gradient: {
    position: 'absolute',
    width: '100%',
    height: 160,
  },
  storelogo: {
    height: 60,
    width: 60,
    borderRadius: 8,
  },

  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
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
import CardSkeleton from '../../../components/CardSekeleton';
import ImageFast from '../../../components/ImageFast';
import { useSelector } from 'react-redux';
import FeatureCard from './FeatureCard';
import { Images } from '../../../assets/images';
import Icons from '../../../components/Icons';
import { useIsFocused } from '@react-navigation/native';
const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_COUNT = 7;
const ITEM_MARGIN = 10; // optional margin between items

// Calculate item width to fit 6 items (including margin spacing)
const ITEM_WIDTH = (SCREEN_WIDTH - ITEM_MARGIN * (ITEM_COUNT + 1)) / ITEM_COUNT;

const StoreDetails = ({ route, navigation }) => {
  const store = route?.params?.store;
  const isFocused = useIsFocused();
  const { token } = useSelector(store => store?.user);

  const [stores, setStores] = useState([]);
  const [offerCategories, setOfferCategories] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedStore, setSelectedStore] = useState({});

  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedAd, setSelectedAd] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const fetchStores = async () => {
    try {
      const body = {
        type: 'get_data',
        table_name: 'stores',
        limt: 100,
      };

      const response = await ApiRequest(body);

      if (response?.data?.data) {
        const allStores = {
          id: 'all',
          name: 'All',
        };

        const storesList = [allStores, ...response.data.data];
        setStores(storesList);
        if (!selectedStore?.id) {
          setSelectedStore(allStores);
        }
      }
    } catch (error) {
      console.log('Error fetching stores:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchOfferCategories = async () => {
    try {
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

        const categoriesList = [allCategory, ...response.data.data];
        setOfferCategories(categoriesList);

        if (!selectedCategory?.id) {
          setSelectedCategory(allCategory);
        }
      }
    } catch (error) {
      console.log('Error fetching offer categories:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      setIsLoading(true);

      const body = {
        type: 'get_data',
        table_name: 'items',
        item_type: 'offer',
        user_id: token,
        store_id: selectedStore?.id === 'all' ? 0 : Number(selectedStore?.id),
        store_cat_id:
          selectedCategory?.id === 'all' ? 0 : Number(selectedCategory?.id),
        search: searchValue?.trim(),
      };
      console.log("=====data",body);
      

      const response = await ApiRequest(body);

      if (response?.data?.data) {
        setCategoryData(response.data.data);

        // Filter featured offers
        const featured = response.data.data.filter(
          item => item.featured === '1',
        );

        setFeaturedOffers(featured);
      } else {
        setCategoryData([]);
        setFeaturedOffers([]);
      }
    } catch (error) {
      console.log('Error fetching offers:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Refresh all data
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchStores();
    fetchOfferCategories();
  }, []);

  // Initial data load
  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      fetchStores();
      fetchOfferCategories();
    }
  }, [isFocused]);

  useEffect(() => {
    if (selectedStore?.id && selectedCategory?.id && isFocused) {
      fetchOffers();
    }
  }, [selectedStore?.id, selectedCategory?.id, searchValue, isFocused]);

  const handleAdSelect = ad => {
    setSelectedAd(ad);
    setShowImageModal(true);
  };

  const images = selectedAd?.other_images
    ? JSON.parse(selectedAd?.other_images)
    : [];

  return (
    <>
      <ScreenWrapper
        scrollEnabled
        paddingBottom={100}
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
              value={searchValue}
              onChangeText={setSearchValue}
              placeHolder="Search here..."
              marginTop={12}
              marginBottom={16}
              editable={true}
              isStore={true}
            />
          </View>

          <View style={{ paddingHorizontal: 0.1 }}>
            {isLoading && !selectedStore ? (
              <View style={styles.mapContainer}>
                {[1, 2, 3, 4].map((item, index) => (
                  <CardSkeleton key={index} isStore />
                ))}
              </View>
            ) : stores.length > 0 ? (
              <FlatList
                data={stores}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabContainer}
                renderItem={({ item }) => {
                  const isSelected = selectedStore?.id === item?.id;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      style={[
                        styles.storeBox,
                        {
                          // width: 60,
                          // height: 60,
                          width: ITEM_WIDTH,
                          height: ITEM_WIDTH, // make it square
                          marginHorizontal: ITEM_MARGIN / 4,
                          borderWidth: 2,
                          borderRadius: 5,
                          borderColor: isSelected ? '#A38CB6' : 'transparent',
                        },
                      ]}
                      onPress={() => setSelectedStore(item)}>
                      {item?.name === 'All' ? (
                        <CustomText label={'ALL'} fontFamily={fonts.semiBold} />
                      ) : (
                        <ImageFast
                          resizeMode="contain"
                          source={{ uri: item?.logo }}
                          style={styles.image}
                          svgH={55}
                          svgW={42}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => `store-${item.id || index}`}
              />
            ) : (
              !isLoading && (
                <CustomText
                  label={'No stores found...'}
                  alignSelf={'center'}
                  fontFamily={fonts.semiBold}
                  fontSize={17}
                  color={colors.white}
                  marginBottom={10}
                  marginTop={10}
                />
              )
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}>
              <Image source={Images.crown} style={styles.crown} />
              <CustomText
                label={'Featured Offers'}
                fontSize={17}
                fontFamily={fonts.semiBold}
                color={colors.white}
              />
            </View>
            {selectedStore?.name ? (
              <>
                {selectedStore?.id !== 'all' && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('StorePage', { store: selectedStore })
                    }
                    style={styles.MoreStore}>
                    <CustomText
                      label={`More from ${selectedStore?.name}`}
                      numberOfLines={1}
                      fontFamily={fonts?.regular}
                      fontSize={14}
                      width={150}
                    />
                    <Icons
                      name={'right'}
                      family={'AntDesign'}
                      color={colors.black}
                      size={17}
                    />
                  </TouchableOpacity>
                )}
              </>
            ) : null}
          </View>

          <View style={{ flex: 1, width: '100%' }}>
            {featuredOffers?.length > 0 ? (
              <FlatList
                data={featuredOffers}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <FeatureCard
                    storeIcon={
                      item?.store_logo
                        ? imgUrl + item?.store_logo
                        : selectedStore?.logo
                    }
                    item={item}
                    ishori
                    onBodyPress={() =>
                      navigation.navigate('OfferAdDetails', { ad: item })
                    }
                    onPress={() =>
                      navigation.navigate('OfferAdDetails', { ad: item })
                    }
                    // onPress={() => handleAdSelect(item)}
                  />
                )}
                keyExtractor={(item, index) => `featured-${item.id || index}`}
              />
            ) : (
              !isLoading && <EmptyComponent isStore />
            )}
          </View>
        </View>

        <View>
          <FlatList
            data={offerCategories}
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
            marginTop: 10,
            paddingHorizontal: 10,
            marginLeft: 5,
            width: '100%',
            flex: 1,
          }}>
          {categoryData?.length > 0 ? (
            <FlatList
              data={categoryData}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <FeatureCard
                  storeIcon={
                    item?.store_logo
                      ? imgUrl + item?.store_logo
                      : selectedStore?.logo
                  }
                  item={item}
                  onBodyPress={() =>
                    navigation.navigate('OfferAdDetails', { ad: item })
                  }
                  onPress={() =>
                    navigation.navigate('OfferAdDetails', { ad: item })
                  }
                  // onPress={() => handleAdSelect(item)}
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

      {/* <SliderModal
        url
        images={images}
        isVisible={showImageModal}
        onDisable={() => setShowImageModal(false)}
      /> */}
    </>
  );
};

export default StoreDetails;

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
    height: 40,
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

  MoreStore: {
    backgroundColor: colors.white,
    padding: 5,
    height: 30,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
});

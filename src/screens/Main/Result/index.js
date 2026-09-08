/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  LayoutAnimation,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { useSelector } from 'react-redux';
import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import Customlistmodal from '../../../components/Customlistmodal';
import CustomText from '../../../components/CustomText';
import EmptyComponent from '../../../components/EmptyComponent';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import ScreenWrapper from '../../../components/ScreenWrapper';
import SearchBar from '../../../components/SearchBar';
import ApiRequest from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import GridViewCard from './molecules/GridViewCard';
import ListViewCard from './molecules/ListViewCard';
import { ToastMessage } from '../../../utils/ToastMessage';

const options = [
  { name: 'Default', sort: '', orderBy: '' },
  { name: 'New to Old', sort: 'desc', orderBy: 'id' },
  { name: 'Old to New', sort: 'asc', orderBy: 'id' },
  { name: 'Price High to Low', sort: 'desc', orderBy: 'price' },
  { name: 'Price Low to High', sort: 'asc', orderBy: 'price' },
];

const Result = ({ navigation, route }) => {
  const { token } = useSelector(store => store?.user);
  const paramsData = route.params;
  const search = route.params?.search;
  const isFocus = useIsFocused();

  const [page, setPage] = useState(1);
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searches, setSearches] = useState([]);
  const [visible, setVisible] = useState(false);
  const [viewType, setViewType] = useState('list');
  const [refreshing, setRefreshing] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [bottomLoader, setBottomLoader] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0));
  const [filterData, setFilterData] = useState({
    date: '',
    cat_id: '',
    min_price: '',
    max_price: '',
    lat: '',
    lng: '',
    sort: '',
    orderBy: '',
    filter: '',
    nearMe: '',
  });

  const [dataShow, setDataShow] = useState({
    Date: '',
    Category: '',
    'Min Price': '',
    'Max Price': '',
    Address: '',
    'Sort By': '',
    'Near Me': '',
  });

  const debounceTimer = useRef(null);

  const handleRemoveFilter = () => {
    const resetValues = {
      date: '',
      cat_id: '',
      min_price: '',
      max_price: '',
      lat: '',
      lng: '',
      sort: '',
      order_by: '',
      filter: '',
    };

    setFilterData(resetValues);
    setDataShow({
      Date: '',
      Address: '',
      Category: '',
      'Min Price': '',
      'Max Price': '',
      'Sort By': '',
    });
    setData([]);
    fetchData(resetValues);
    navigation.setParams({
      subCat: { id: '' },
      data: resetValues,
    });
  };

  const toggleCollapsibleView = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsCollapsed(!isCollapsed);
  };

  const handleLikeDislike = async (id, index) => {
    try {
      let status = '';

      let updatedData = [...data];

      status = updatedData[index].like === 'like' ? 'dislike' : 'like';
      updatedData[index].like = status;
      setData(updatedData);

      const dataToSend = {
        type: 'add_data',
        table_name: 'blog_likes',
        user_id: token,
        item_id: id,
        like_type: status,
      };

      await ApiRequest(dataToSend);
      fetchData();
    } catch (error) {
      console.log(error, 'err in like dislike');
    }
  };

  const handleSort = item => {
    const updatedFilterData = {
      ...filterData,
      sort: item.sort,
      order_by: item.orderBy,
    };

    setFilterData(updatedFilterData);
    setDataShow({ ...dataShow, 'Sort By': item.name });
    setVisible(false);

    fetchData(updatedFilterData);
  };

  const fetchData = async (isData, e) => {
    setRefreshing(true);
    try {
      if (e !== null && e !== undefined && e.trim() === '') {
        return false;
      }

      const dataToSend = {
        type: 'get_data',
        table_name: 'items',
        cat_id: filterData.cat_id,
        date: filterData?.date,
        min_price: filterData?.min_price,
        max_price: filterData?.max_price,
        lat: filterData.lat,
        lng: filterData.lng,
        user_id: token,
        order_by: filterData.orderBy || '',
        sort: filterData.sort || '',
        filter: filterData.filter ? JSON.stringify(filterData.filter) : '',
        near_me: filterData?.nearMe ? true : false,
      };
      if (e) {
        dataToSend.search = e.trim();
      }

      const requestData = isData
        ? { ...isData, type: 'get_data', user_id: token, table_name: 'items' }
        : dataToSend;

      const response = await ApiRequest(requestData);

      if (response.data?.data) {
        handleResentSearches();
        setData(response.data.data);
      } else {
        setData([]);
      }

      setRefreshing(false);
    } catch (error) {
      console.log(error, 'err in getting ads');
      setRefreshing(false);
    }
  };

  const debouncedSearch = useCallback(
    searchText => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        if (searchText.trim()) {
          fetchData(null, searchText);
        }
      }, 500);
    },
    [fetchData],
  );

  const fetchMoreData = async () => {
    if (data.length <= 0 || bottomLoader) {
      setBottomLoader(false);
      return false;
    }

    setBottomLoader(true);

    const filterDataToSend = {
      user_id: token,
      type: 'get_data',
      table_name: 'items',
      lng: paramsData?.data?.lng || '',
      lat: paramsData?.data?.lat || '',
      date: paramsData?.data?.date || '',
      cat_id: paramsData?.subCat?.id || '',
      min_price: paramsData?.data?.minPrice || '',
      max_price: paramsData?.data?.maxPrice || '',
      filter: paramsData?.data?.filter
        ? JSON.stringify(paramsData?.data?.filter)
        : '',
      last_id: page,
    };

    try {
      const dataToSend = {
        type: 'get_data',
        table_name: 'items',
        cat_id: filterData.cat_id,
        date: filterData?.date,
        min_price: filterData?.min_price,
        max_price: filterData?.max_price,
        lat: filterData.lat,
        lng: filterData.lng,
        user_id: token,
        order_by: filterData.orderBy || '',
        sort: filterData.sort || '',
        filter: filterData.filter ? JSON.stringify(filterData.filter) : '',
        last_id: page,
      };

      const requestData = paramsData ? filterDataToSend : dataToSend;

      const response = await ApiRequest(requestData);

      if (response.data?.data) {
        setData([...data, ...response.data.data]);
        setPage(page + 1);
      }
      setBottomLoader(false);
    } catch (error) {
      console.log(error, 'err in getting more ads');
      setBottomLoader(false);
    }
  };

  const handleFilterPress = async () => {
    try {
      setLoader(false);
      navigation.navigate('Filter', {
        fields: [],
        selected: paramsData?.subCat,
      });
    } catch (error) {
      console.log(error, 'err in getting custom fields');
      setLoader(false);
    }
  };

  const handleSpace = word => {
    if (!word) return;
    return word?.replace(/%/g, ' ');
  };

  const handleResentSearches = async () => {
    try {
      const res = await ApiRequest({
        type: 'get_data',
        table_name: 'search_suggestions',
        user_id: token,
      });
      const searchData = res.data?.data || [];
      setSearches(searchData);
    } catch (error) {
      console.log(error, 'err in getting recent');
    }
  };

  const onDeleteSearch = async (id, index) => {
    try {
      const dataToDelete = {
        type: 'delete_data',
        table_name: 'search_suggestions',
        id: id,
        user_id: token,
      };

      const updatedData = [...searches];
      updatedData.splice(index, 1);
      setSearches(updatedData);
      const res = await ApiRequest(dataToDelete);
    } catch (error) {
      console.log(error, 'err in delete search');
    }
  };

  const openWhatsAppChat = item => {
    const phoneNumber = item?.user?.phone;
    const message = 'Hi, I found this ad on vexem.co';
    const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message,
    )}`;

    Linking.canOpenURL(whatsappURL)
      .then(supported => {
        if (supported) {
          return Linking.openURL(whatsappURL);
        } else {
          ToastMessage('WhatsApp is not installed on this device.');
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  const makePhoneCall = item => {
    const phoneNumber = item?.user?.phone;
    const telURL = `tel:${phoneNumber}`;

    Linking.canOpenURL(telURL)
      .then(supported => {
        if (supported) {
          return Linking.openURL(telURL);
        } else {
          console.log('Phone call is not supported on this device.');
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  useEffect(() => {
    if (paramsData) {
      const newFilterData = {
        cat_id: paramsData?.subCat?.id || '',
        min_price: paramsData?.data?.minPrice || '',
        max_price: paramsData?.data?.maxPrice || '',
        date: paramsData?.data?.date || '',
        lat: paramsData?.data?.lat || '',
        lng: paramsData?.data?.lng || '',
        filter: paramsData?.data?.filter
          ? JSON.stringify(paramsData?.data?.filter)
          : '',
        nearMe: paramsData?.data?.nearMe || false,
      };
      setDataShow({
        Category: paramsData?.subCat?.name || '',
        'Max Price': paramsData?.data?.maxPrice || '',
        'Min Price': paramsData?.data?.minPrice || '',
        Date: paramsData?.data?.date || '',
        Address: paramsData?.data?.address || '',
        'Sort By': '',
        'Near Me': paramsData?.data?.nearMe || '',
      });
      setFilterData(newFilterData);
      fetchData(newFilterData);
    }
  }, [isFocus, paramsData]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', event => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }).start();
    });
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', event => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    });
    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const formattedData = Object.entries(dataShow).map(([key, value]) => ({
    key,
    value,
  }));

  const hasValue = Object.values(dataShow).some(value => value !== '' || value);

  return (
    <ScreenWrapper
      // scrollEnabled
      // refreshControl={
      //   <RefreshControl
      //     refreshing={refreshing}
      //     onRefresh={() => {
      //       setText('');
      //       fetchData();
      //     }}
      //     colors={[colors.primaryColor]}
      //   />
      // }
      paddingBottom={0.1}
      statusBarColor="white"
      headerUnScrollable={() => <Header title={'All Ads'} />}
      footerUnScrollable={() => (
        <Animated.View style={{ marginBottom: keyboardHeight }}>
          <View style={styles.bottomBox}>
            <CustomButton
              width="50%"
              title={'Filter'}
              borderRadius={0}
              iconName={'filter'}
              iconFamily={'AntDesign'}
              iconColor={colors.white}
              onPress={handleFilterPress}
              loading={loader}
              disabled={loader}
            />
            <View style={styles.line} />
            <CustomButton
              width="50%"
              title={'Sort By'}
              borderRadius={0}
              iconName={'sort'}
              iconFamily={'MaterialCommunityIcons'}
              iconColor={colors.white}
              onPress={() => setVisible(true)}
            />
          </View>
        </Animated.View>
      )}>
      <View style={styles.searchContainer}>
        <SearchBar
          autoFocus={search}
          placeHolder={'Search Any item...'}
          value={text}
          onChangeText={e => {
            setText(e);
            if (e.trim() === '') {
              fetchData(null, null);
            } else {
              debouncedSearch(e);
            }
          }}
          onEndEditing={e => fetchData(null, e.nativeEvent.text)}
          onSearchPress={() => {
            if (text.trim()) {
              fetchData(null, text);
            }
          }}
        />
        <TouchableOpacity
          disabled={viewType === 'list'}
          style={styles.viewContainer}
          onPress={() => setViewType('list')}>
          <Icons
            family={'Feather'}
            name={'list'}
            color={viewType === 'grid' ? colors.grey : colors.black}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={viewType === 'grid'}
          style={styles.viewContainer}
          onPress={() => setViewType('grid')}>
          <Icons
            family={'Feather'}
            name={'credit-card'}
            color={viewType === 'list' ? colors.grey : colors.black}
          />
        </TouchableOpacity>
      </View>
      {searches?.length > 0 && search && (
        <View style={styles.recentBox}>
          <CustomText
            label={'Recent Searches'}
            fontFamily={fonts.semiBold}
            marginBottom={5}
            color={colors.grey}
          />
          <FlatList
            data={searches}
            nestedScrollEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={[styles.searchBox]}>
                <CustomText
                  label={handleSpace(item?.search)}
                  fontFamily={fonts.semiBold}
                  fontSize={16}
                />
                <TouchableOpacity
                  style={styles.delete}
                  onPress={() => onDeleteSearch(item?.id, index)}>
                  <Icons name={'close'} size={15} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
      {hasValue && (
        <Pressable style={styles.row} onPress={toggleCollapsibleView}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomText
              label={'Applied Filters'}
              fontFamily={fonts.semiBold}
              fontSize={15}
              color={colors.grey}
              marginRight={10}
            />

            <CustomText
              label={'Clear Filter'}
              fontSize={12}
              color={colors.primaryColor}
              onPress={handleRemoveFilter}
            />
          </View>
          <TouchableOpacity
            onPress={toggleCollapsibleView}
            style={{ padding: 5 }}
            activeOpacity={0.5}>
            <Icons
              name={isCollapsed ? 'chevron-down' : 'chevron-up'}
              type="IonIcons"
              color={'#000'}
              size={24}
            />
          </TouchableOpacity>
        </Pressable>
      )}
      <View style={{ maxHeight: 160 }}>
        {!isCollapsed && (
          <FlatList
            data={formattedData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) =>
              item.value && (
                <View style={styles.row}>
                  <CustomText label={item.key + ' ' + ':'} marginRight={10} />
                  <CustomText
                    label={item.value}
                    color={colors.primaryColor}
                    fontFamily={fonts.semiBold}
                  />
                </View>
              )
            }
          />
        )}
      </View>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!refreshing && EmptyComponent}
        onScrollEndDrag={() => fetchMoreData()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setText('');
              fetchData();
            }}
            colors={[colors.primaryColor]}
          />
        }
        ListFooterComponent={
          bottomLoader && (
            <View style={styles.footer}>
              <ActivityIndicator size={40} color={colors.primaryColor} />
            </View>
          )
        }
        contentContainerStyle={{ flex: data?.length > 0 ? 0 : 1 }}
        renderItem={({ item, index }) => {
          let customFields = item?.custom_fileds_data
            ? JSON?.parse(item?.custom_fileds_data)
            : '';

          let featuredFields = Array.isArray(customFields)
            ? customFields.filter(field => field?.featured == 1)
            : [];

          let tags = Array.isArray(customFields)
            ? customFields.filter(field => field?.hightlights == 1)
            : [];

          return viewType === 'list' ? (
            <ListViewCard
              source={{ uri: item?.image }}
              item={item}
              title={item?.name}
              key={item.id}
              price={item?.price}
              description={item?.description}
              date={item?.item_type === 'ad' ? item?.date : item?.end_date}
              time={item?.item_type === 'ad' ? item?.time : item?.end_time}
              onLike={() => handleLikeDislike(item?.id, index)}
              onPress={() =>
                navigation.navigate('Detail', { itemId: item?.id })
              }
              iconArray={featuredFields}
              featured={item?.featured == 1}
              tags={tags}
            />
          ) : (
            <GridViewCard
              key={item.id}
              item={item}
              title={item?.name}
              source={{ uri: item?.image }}
              price={item?.price}
              description={item?.description}
              date={item?.date}
              time={item?.time}
              onLike={() => handleLikeDislike(item?.id, index)}
              tags={tags}
              onPress={() =>
                navigation.navigate('Detail', { itemId: item?.id })
              }
              onCall={() => makePhoneCall(item)}
              onWhatsApp={() => openWhatsAppChat(item)}
              featured={item?.featured == 1}
              iconArray={featuredFields}
            />
          );
        }}
      />
      <Customlistmodal isVisible={visible} onDisable={() => setVisible(false)}>
        <View style={styles.main_container}>
          <View style={styles.btnClose} />
          <View style={styles.sortBox}>
            <CustomText
              fontSize={16}
              label={'Sort By'}
              fontFamily={fonts.bold}
            />
          </View>
          {options.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.sortBox}
              onPress={() => handleSort(item)}
              key={index}>
              <CustomText label={item.name} fontFamily={fonts.semiBold} />
            </TouchableOpacity>
          ))}
        </View>
      </Customlistmodal>
    </ScreenWrapper>
  );
};

export default Result;

const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 15,
  },
  viewContainer: {
    padding: 11,
    borderRadius: 8,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    marginLeft: 6,
  },
  bottomBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primaryColor,
    overflow: 'hidden',
  },
  line: {
    backgroundColor: colors.white,
    height: 45,
    width: 1,
    marginBottom: Platform.OS === 'ios' ? 14 : 0,
  },
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    paddingBottom: 10,
  },
  main_container: {
    backgroundColor: colors.white,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },

  sortBox: {
    height: 48,
    borderBottomWidth: 1,
    borderColor: colors.lightGrey,
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  btnClose: {
    backgroundColor: '#D9D9D9',
    width: 65,
    height: 7,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 10,
  },
  recentBox: {
    maxHeight: 140,
    paddingBottom: 10,
  },
  searchBox: {
    backgroundColor: colors.white,
    marginRight: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
    paddingBottom: 5,
  },
  delete: {
    backgroundColor: colors.grey1,
    justifyContent: 'center',
    position: 'absolute',
    right: -5,
    top: -5,
    borderRadius: 50,
    alignItems: 'center',
    width: 20,
    height: 20,
  },
  footer: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

/* eslint-disable react/no-unstable-nested-components */
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
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

const UserAdd = ({ navigation, route }) => {
  const { token } = useSelector(store => store?.user);
  const paramsData = route.params;
  const search = route.params?.search;
  const user = route.params?.id
  const username = route.params?.username
  
  
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
      if (e && e.trim() === '') {
        return false;
      }
      const dataToSend = {
        type: 'get_data',
        table_name: 'items',
        user_id: token,
        user_ads: user?.id || user,
      };

      if (e) {
        dataToSend.search = e.trim();
      }

      const requestData = {
        type: 'get_data',
        user_id: token,
        table_name: 'items',
        user_ads: user?.id || user,
      };

      const response = await ApiRequest(requestData);

      if (response.data?.data) {
        handleResentSearches();
        console.log(response.data);

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

  const fetchMoreData = async () => {
    if (data.length <= 0 || bottomLoader) {
      setBottomLoader(false);
      return false;
    }

    setBottomLoader(true);

    try {
      const dataToSend = {
        type: 'get_data',
        table_name: 'items',
        user_ads: user?.id || user,
        user_id: token,
        last_id: page,
      };

      const requestData = dataToSend;

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
      console.log(res.data);
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
      
      paddingBottom={0.1}
      statusBarColor="white"
      headerUnScrollable={() => <Header title={`${user?.name|| username}`} isbadge={user?.badge}/>}>

 
{/*  
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
      </View> */}
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
              marginTop={20}
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

export default UserAdd;

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

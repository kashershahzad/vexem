/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { CommonActions, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';
import fonts from '../../../assets/fonts';
import { Companybadge, Images, Officalbadge } from '../../../assets/images';
import { AppLoader } from '../../../components/AppLoader';
import CustomButton from '../../../components/CustomButton';
import CustomText from '../../../components/CustomText';
import EmptyComponent from '../../../components/EmptyComponent';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import SliderModal from '../../../components/ModaISlider';
import ScreenWrapper from '../../../components/ScreenWrapper';
import Swiper from '../../../components/Swipper';
import TextSpaceBetween from '../../../components/TextSpaceBetween';
import ApiRequest, { put } from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import { GOOGLE_API_KEY, imgUrl } from '../../../utils/constants';
import { ToastMessage } from '../../../utils/ToastMessage';
import HomeCard from '../Home/molecules/HomeCard';
import BidderCard from './molecules/BidderCard';
import DeleteModal from './molecules/DeleteModal';
import Feature from './molecules/Feature';
import FeatureModal from './molecules/FeatureModal';
import PlaceBidModal from './molecules/PlaceBidModal';
import TermsModal from './molecules/TermsModal';

const HeaderIcon = ({ onDeletePress, onShare, myAd, status }) => {
  return (
    <View style={styles.row1}>
      {status != 'pending' && (
        <TouchableOpacity style={styles.headerIcon} onPress={onShare}>
          <Icons name={'share'} family={'Entypo'} size={23} />
        </TouchableOpacity>
      )}

      {myAd && (
        <TouchableOpacity style={styles.headerIcon} onPress={onDeletePress}>
          <Icons
            name={'delete'}
            family={'MaterialCommunityIcons'}
            color={colors.red}
            size={23}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const Detail = ({ route }) => {
  const itemId = route.params.itemId;

  const navigation = useNavigation();

  const mapViewRef = useRef(null);
  const [data, setData] = useState([]);
  const [item, setItem] = useState({});

  const [like, setLike] = useState(false);
  const [bidData, setBidData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [bidModal, setBidModal] = useState(false);
  const [imgModal, setImgModal] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [auctionState, setAuctionState] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [featureModal, setFeatureModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const { loginUser, token } = useSelector(store => store.user);
  const [featureLoading, setfeatureLoading] = useState(false);
  const [TermandConidtionModal, setTermandConidtionModal] = useState(false);
  const [map, setmap] = useState()
  const [TermLoading, setTermLoading] = useState(false);
  const myAd = loginUser?.id === item?.user?.id ? true : false;
  const status = item?.status;

  const baseUrl = 'https://api.vexem.co/api.php';

  const parseImages =
    !refreshing && item?.other_images ? JSON.parse(item.other_images) : [];

  // Combine item.images and other_images into one array
  const allImages = [item?.images, ...parseImages];

  // Convert to full URLs if needed
  const preparedImages = allImages.map(img =>
    img?.startsWith('http') ? img : `${baseUrl}${img}`,
  );

  const parseFields = item?.custom_fileds_data
    ? JSON.parse(item?.custom_fileds_data)
    : [];

  const parseCustomFields = parseFields?.filter(obj => obj?.value !== '');

  const calculateTimeLeft = () => {
    const now = moment();

    const startDateTime = moment(
      `${item?.start_date} ${item?.start_time}`,
      'MMM DD, YYYY HH:mm:ss',
    );

    const endDateTime = moment(
      `${item?.end_date} ${item?.end_time}`,
      'MMM DD, YYYY HH:mm:ss',
    );

    if (now.isBefore(startDateTime)) {
      const duration = moment.duration(startDateTime.diff(now));
      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      setAuctionState('starting');
    } else if (now.isAfter(endDateTime)) {
      setTimeLeft('Auction ended');
      setAuctionState('ending');
    } else {
      const duration = moment.duration(endDateTime.diff(now));
      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      setAuctionState('ending');
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }
  };

  const openWhatsAppChat = () => {
    const phoneNumber = item?.user?.phone;
    const title = onGetUrl(item?.name);
    const message = `Hi, I found this ad on vexem.co https://vexem.co/item/Detail/${title}/${item?.id} `;
    const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message,
    )}`;

    Linking.canOpenURL(whatsappURL)
      .then(supported => {
        if (supported) {
          return Linking.openURL(whatsappURL);
        } else {
          console.log('WhatsApp is not installed on this device.');
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  const makePhoneCall = phoneNumber => {
    const telURL = `tel:${'+' + phoneNumber}`;

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

  const handleDownload = async url => {
    console.log(url);

    const fileName = url.split('/').pop();
    const destination =
      Platform.OS === 'ios'
        ? `${RNFS.DocumentDirectoryPath}/${fileName}`
        : `${RNFS.DownloadDirectoryPath}/${fileName}`;
    setLoader(true);
    try {
      const download = RNFS.downloadFile({
        fromUrl: url,
        toFile: destination,
      });

      const result = await download.promise;

      if (result.statusCode === 200) {
        ToastMessage('File downloaded successfully');
        FileViewer.open(destination, { showOpenWithDialog: true });
      } else {
        console.log('Failed to download file:', result);
      }
      setLoader(false);
    } catch (err) {
      console.log('Error downloading file:', err);
      setLoader(false);
    }
  };

  const handleApplyJob = async () => {
    try {
      if (!token) {
        return ToastMessage('Please login first!');
      }
      setBtnLoader(true);

      const dataToSend = {
        type: 'get_data',
        table_name: 'job_description',
        specific_user: token,
        limit: 1,
      };

      navigation.navigate('NewJobProfile', {
        addId: itemId,
      });

      setBtnLoader(false);
    } catch (error) {
      console.log(error.response.data, 'err in getting apply data');
      setBtnLoader(false);
      ToastMessage('Something failed');
    }
  };

  const handleStatusUpdate = async () => {
    setStatusLoading(true);
    try {
      const dataToGet = {
        type: 'update_data',
        table_name: 'items',
        status: 'sold_out',
        id: item?.id,
      };
      const response = await ApiRequest(dataToGet);

      if (response.data.result) {
        if (item?.job === 1) {
          ToastMessage('Job marked as hired');
        } else {
          ToastMessage('Ad marked as sold');
        }
        navigation.goBack();
      }
    } catch (error) {
      console.log(error, 'err in getting ads');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleLikeDislike = async () => {
    try {
      setLike(!like);
      const dataToSend = {
        type: 'add_data',
        table_name: 'blog_likes',
        user_id: token,
        item_id: itemId,
        like_type: like ? 'dislike' : 'like',
      };

      await ApiRequest(dataToSend);
    } catch (error) {
      console.log(error, 'err in like dislike');
    }
  };

  const handleEdit = () => {
    navigation.navigate('CreateAd', {
      ad: item,
      type: { type: item?.item_type },
    });
  };

  const handleAdDetail = async () => {
    setRefreshing(true);
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'items',
        id: itemId,
        user_id: token,
      };
      const response = await ApiRequest(dataToGet);
      const fetchedItem = response.data?.data?.[0];
      console.log("maps",fetchedItem);

      setItem(fetchedItem);
      handleRelatedAds(fetchedItem?.cat_id);
      handleGetBids(fetchedItem?.id);

      setLike(fetchedItem?.like === 'like' ? true : false);
      setRefreshing(false);
    } catch (error) {
      console.log(error, 'err in my ads');
      setRefreshing(false);
    }
  };

  const handleRelatedAds = async catId => {
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'items',
        cat_id: catId,
        user_id: token,
      };

      const response = await ApiRequest(dataToGet);
      const fetchedItem = response.data?.data || [];
      const filterData = fetchedItem?.filter(obj => obj?.id !== itemId);
      setData(filterData);
    } catch (error) {
      console.log(error, 'err in related ads');
    }
  };

  const handlePlaceBid = () => {
    if (!token) {
      return ToastMessage('Please login first');
    }
    console.log(item?.terms);

    if (item?.terms === 0) {
      setTermandConidtionModal(true);
      return;
    }

    const time = moment(item?.start_time, 'HH:mm:ss').format('hh:mm A');

    const now = moment();
    const auctionStartDateTime = moment(
      `${item?.start_date} ${item?.start_time}`,
      'MMM DD, YYYY HH:mm:ss',
    );

    if (now.isBefore(auctionStartDateTime)) {
      ToastMessage(`Auction will start on ${item?.start_date} at ${time}`);
    } else {
      if (loginUser?.phone) {
        setBidModal(true);
      } else {
        Alert.alert('Phone Number Required', 'Please add your phone number.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('EditProfile'), // or your screen name
          },
        ]);
      }
    }
  };

  const openGoogleMap = () => {
    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q=',
    });

    if (!item?.lat || !item?.lng) {
      return ToastMessage('Cannot open google map to show this location');
    }
    const latLng = `${item?.lat},${item?.lng}`;
    const label = item?.area;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  const handleGetBids = async id => {
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'items_bids',
        item_id: id,
        limit: 100,
      };

      const response = await ApiRequest(dataToGet);
      if (response.data.data) {
        setBidData(response.data?.data);
      } else {
        setBidData([]);
      }
    } catch (error) {
      console.log(error, 'err in getting bid');
    }
  };

  const handleChat = async () => {
    try {
      setLoader(true);
      const url = `users/getById/${item?.user?.email}/${item?.user?.id}`;

      const res = await put(url);
      if (res.data?.success) {
        const dataToSend = {
          id: res.data?.user?._id,
          img: item?.user?.image,
          name: item?.user?.name,
          chatUserId: res?.data?.user?.user_id,
        };

        navigation.navigate('ChatScreen', { data: dataToSend });
      }
      setLoader(false);
    } catch (error) {
      console.log(error, 'errr in getting chat user');
      setLoader(false);
      ToastMessage('Something failed');
    }
  };
  const handleChatBidder = async bidder => {
    try {
      setLoader(true);
      const url = `users/getById/${bidder?.user?.email}/${bidder?.user?.id}`;

      const res = await put(url);

      if (res.data?.success) {
        const dataToSend = {
          id: res.data?.user?._id,
          img: bidder?.user?.image,
          name: bidder?.user?.name,
          chatUserId: res?.data?.user?.user_id,
        };

        navigation.navigate('ChatScreen', { data: dataToSend });
      }
      setLoader(false);
    } catch (error) {
      console.log(error, 'errr in getting chat user');
      setLoader(false);
      ToastMessage('Something failed');
    }
  };

  const onGetUrl = title => {
    return title.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
  };

 const onShareAd = async () => {
  // Check if image URL is available
  const imageUrl = item?.images?.includes(imgUrl)
    ? item?.images
    : imgUrl + item?.images;
    
  if (!imageUrl) {
    console.log('No image URL available for sharing');
    return;
  }

  setLoader(true);
  let downloadedFilePath = null;

  try {
    // Create a unique filename for the downloaded image
    const timestamp = Date.now();
    const fileExtension = imageUrl.split('.').pop() || 'jpg';
    const fileName = `ad_image_${timestamp}.${fileExtension}`;
    const downloadPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
    
    // Generate the ad URL
    const title = onGetUrl(item?.name);
    const adUrl = `https://vexem.com/item/Detail/${title}/${item?.id}`;
    console.log(adUrl);

    const downloadResult = await RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: downloadPath,
      background: false,
      discretionary: false,
    }).promise;

    if (downloadResult.statusCode === 200) {
      downloadedFilePath = downloadPath;

      // Share the downloaded image 
      const shareOptions = {
        title: item?.name,
        message: `${item?.name}\n${item?.description}\n${adUrl}`,
        url: `file://${downloadedFilePath}`,
        type: 'image/jpeg',
      };

      await Share.open(shareOptions);
    } else {
      throw new Error(
        `Download failed with status code: ${downloadResult.statusCode}`,
      );
    }
  } catch (error) {
    if (error.message !== 'User did not share') {
      console.log('Error sharing the ad:', error);
    }
  } finally {
    // Clean up the downloaded file
    if (downloadedFilePath) {
      try {
        const fileExists = await RNFS.exists(downloadedFilePath);
        if (fileExists) {
          await RNFS.unlink(downloadedFilePath);
          console.log('Temporary file cleaned up:', downloadedFilePath);
        }
      } catch (cleanupError) {
        console.log('Error cleaning up temporary file:', cleanupError);
      }
    }
    setLoader(false);
  }
};



  useEffect(() => {
    handleAdDetail();
  }, [itemId]);

  const handlefeatureAdd = async () => {
    setfeatureLoading(true);
    const dataToGet = {
      type: 'add_data',
      table_name: 'feature_ads',
      user_id: token,
      item_id: itemId,
    };
    const res = await ApiRequest(dataToGet);
    if (res?.data?.result) {
      navigation.goBack();
      ToastMessage('Your ad featured successfully');
      setfeatureLoading(false);
    } else {
      ToastMessage(response.data.message);
      setfeatureLoading(false);
    }
  };

  const handlefeatureRemove = async () => {
    setfeatureLoading(true);
    const dataToGet = {
      type: 'update_data',
      table_name: 'items',
      featured: 0,
      user_id: token,
      id: itemId,
      status: status,
    };
    const res = await ApiRequest(dataToGet);
    if (res?.data?.result) {
      ToastMessage('Your ad  removed from feature successfully');
      navigation.goBack();
    }

    setfeatureLoading(false);
  };

  useEffect(() => {
    let interval = null;

    if (item?.item_type === 'auction') {
      interval = setInterval(() => {
        handleGetBids(item?.id);
      }, 30000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [itemId, item?.item_type]);

  useEffect(() => {
    calculateTimeLeft();
    if (item?.item_type === 'auction') {
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    }
  }, [item]);

  const handleAgrePress = async () => {
    setTermLoading(true);
    const BodySend = {
      type: 'add_data',
      table_name: 'item_terms',
      user_id: token,
      ad_id: item?.id,
    };
    const res = await ApiRequest(BodySend);
    setTermLoading(false);
    setTermandConidtionModal(false);
    handleAdDetail();
  };

  useEffect(() => {
    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion({
        latitude: Number(item.lat),
        longitude: Number(item.lng),
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [item?.lat, item?.lng]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'MainStack' }],
              }),
            );
        return true;
      },
    );

    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  const mapUrl =item?.map_url;

  const statusBg =
    status === 'active'
      ? '#e5f7e7'
      : status === 'pending'
      ? '#e6eef5'
      : status === 'sold_out'
      ? '#fff8EA'
      : '#ffe5e5';

  const statusColor =
    status === 'active'
      ? '#02ad11'
      : status === 'pending'
      ? '#0d5d9c'
      : status === 'sold_out'
      ? '#ffbb33'
      : '#fe2500';

  const statusToShow =
    item?.job === '1' && status === 'sold_out' ? 'Hired' : status;

  return refreshing ? (
    <View style={styles.container}>
      <CustomText
        fontSize={18}
        label={'Loading...'}
        fontFamily={fonts.semiBold}
      />
    </View>
  ) : !item ? (
    <View style={styles.container}>
      <EmptyComponent title={'No Ad found'} />
    </View>
  ) : (
    <>
      <ScreenWrapper
        scrollEnabled
        statusBarColor="white"
        paddingBottom={4}
        paddingHorizontal={0.1}
        headerUnScrollable={() => (
          <Header
            title={'Ad Details'}
            headerLeftIcon={
              <HeaderIcon
                onDeletePress={() => setDeleteModal(true)}
                myAd={myAd}
                status={status}
                onShare={onShareAd}
              />
            }
          />
        )}
        footerUnScrollable={() => (
          <>
            {myAd && (
              <>
                {item?.featured === '0' ? (
                  <View
                    style={{
                      paddingTop: 5,
                      paddingHorizontal: Platform.OS === 'ios' ? 20 : 10,
                      paddingBottom: Platform.OS === 'ios' ? 5 : 0,
                    }}>
                    <CustomButton
                      disabled={featureLoading}
                      onPress={handlefeatureAdd}
                      loading={featureLoading}
                      title={'Feature this ad'}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      paddingTop: 5,
                      paddingHorizontal: Platform.OS === 'ios' ? 20 : 10,
                      paddingBottom: Platform.OS === 'ios' ? 5 : 0,
                    }}>
                    <CustomButton
                      disabled={featureLoading}
                      onPress={handlefeatureRemove}
                      loading={featureLoading}
                      title={'Unfeature this ad'}
                    />
                  </View>
                )}
              </>
            )}

            {myAd && item?.job === '1' ? (
              <CustomButton
                title={'See Own Profiles'}
                onPress={()=> navigation.navigate('JobApplication')}
                width="95%"
                marginTop={10}
                marginBottom={5}
              />
           ):null} 

            {item?.item_type === 'auction' && !myAd ? (
              <CustomButton
                title={
                  timeLeft === 'Auction ended' ? 'Auction Ended' : 'Place Bid'
                }
                width="90%"
                onPress={handlePlaceBid}
                disabled={timeLeft === 'Auction ended'}
                marginTop={10}
                marginBottom={5}
              />
            ) : item?.job === '1' && !myAd ? (
              <CustomButton
                title={'Apply'}
                onPress={handleApplyJob}
                disabled={btnLoader}
                loading={btnLoader}
                width="90%"
                marginTop={10}
                marginBottom={5}
              />
            ) : (
              status !== 'sold_out' && (
                <View
                  style={[
                    styles.row,
                    {
                      paddingTop: 5,
                      paddingHorizontal: Platform.OS === 'ios' ? 20 : 10,
                      paddingBottom: Platform.OS === 'ios' ? 5 : 0,
                    },
                  ]}>
                  <CustomButton
                    width="48%"
                    iconName={myAd ? 'edit' : 'whatsapp'}
                    iconFamily={'FontAwesome'}
                    title={myAd ? 'Edit' : 'Whatsapp'}
                    iconColor={'white'}
                    onPress={myAd ? handleEdit : openWhatsAppChat}
                  />
                  <CustomButton
                    width="48%"
                    iconName={!myAd && 'phone-call'}
                    iconFamily={!myAd && 'Feather'}
                    title={
                      myAd && item?.job === '1'
                        ? 'Hired'
                        : myAd
                        ? 'Sold Out'
                        : 'Phone'
                    }
                    iconColor={'white'}
                    loading={statusLoading}
                    disabled={statusLoading}
                    onPress={
                      myAd
                        ? handleStatusUpdate
                        : () => makePhoneCall(item?.phone)
                    }
                  />
                </View>
              )
            )}
          </>
        )}>
        {item?.featured === '1' && (
          <View style={styles.feature}>
            <CustomText label={'Featured'} color={'#fff'} />
          </View>
        )}
        {token && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.heartBox}
            onPress={handleLikeDislike}>
            <Icons
              name={like ? 'heart' : 'hearto'}
              family={'AntDesign'}
              size={15}
              color={like ? colors.red : colors.white}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setImgModal(true)} activeOpacity={0.8}>
          <Swiper images={preparedImages} />
        </TouchableOpacity>

        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={[styles.row, { alignItems: 'flex-start', marginTop: 20 }]}>
            <View style={{ flex: 1 }}>
              <CustomText
                fontSize={18}
                label={item?.name}
                fontFamily={fonts.bold}
                lineHeight={24}
                top={0}
                marginRight={10}
              />
            </View>
            {(item?.item_type === 'auction' &&
              Number(item?.current_price) > 0) ||
            (item?.item_type !== 'auction' && Number(item?.price) > 0) ? (
              <View style={styles.price}>
                <CustomText
                  label={'$'}
                  color={colors.white}
                  fontFamily={fonts.semiBold}
                  fontSize={17}
                />
                <CustomText
                  label={`${
                    item?.item_type === 'auction'
                      ? Number(item?.current_price).toLocaleString()
                      : Number(item?.price).toLocaleString()
                  }`}
                  fontSize={17}
                  fontFamily={fonts.semiBold}
                  color={colors.white}
                />
              </View>
            ) : null}
          </View>

          {myAd ? (
            <View style={[styles.row, { marginVertical: 10 }]}>
              <TouchableOpacity onPress={() => setFeatureModal(true)}>
                <CustomText
                  label={
                    myAd && item?.featured === '0' ? 'Make ad featured' : ''
                  }
                  fontSize={16}
                  fontFamily={fonts.semiBold}
                />
              </TouchableOpacity>
              <View
                activeOpacity={0.6}
                style={[styles.button, { backgroundColor: statusBg }]}>
                <CustomText
                  label={statusToShow}
                  fontSize={14}
                  color={statusColor}
                />
              </View>
            </View>
          ) : null}

          {item?.item_type === 'auction' && (
            <>
              {loginUser?.user_lang === 'ar' ? (
                <View style={styles.row1}>
                  <CustomText
                    color={colors.red}
                    label={timeLeft}
                    numberOfLines={1}
                  />
                  <CustomText label={`Auction ${auctionState} in :`} />
                </View>
              ) : (
                <View style={styles.row1}>
                  <CustomText label={`Auction ${auctionState} in :`} />
                  <CustomText
                    color={colors.red}
                    label={timeLeft}
                    numberOfLines={1}
                  />
                </View>
              )}
              {loginUser?.user_lang === 'ar' ? (
                <View style={styles.row1}>
                  <CustomText
                    label={bidData?.length > 0 ? `${bidData.length}` : ''}
                    numberOfLines={1}
                  />
                  <CustomText label={'Total bids :'} />
                </View>
              ) : (
                <View style={styles.row1}>
                  <CustomText label={'Total bids :'} />
                  <CustomText
                    label={bidData?.length > 0 ? `${bidData.length}` : ''}
                    numberOfLines={1}
                  />
                </View>
              )}
              {loginUser?.user_lang === 'ar' ? (
                <View style={styles.row1}>
                  <View style={styles.row1}>
                    <CustomText label={'$'} />
                    <CustomText
                      label={` ${item?.price_max}`}
                      numberOfLines={1}
                    />
                  </View>
                  <CustomText label={'Minimum increment :'} />
                </View>
              ) : (
                <View style={styles.row1}>
                  <CustomText label={'Minimum increment :'} />
                  <View style={styles.row1}>
                    <CustomText label={'$'} />
                    <CustomText
                      label={`${item?.price_max}`}
                      numberOfLines={1}
                    />
                  </View>
                </View>
              )}
            </>
          )}

          <View style={styles.mapContainer}>
            {parseCustomFields?.map((obj, index) => (
              <Feature
                key={index}
                image={{ uri: imgUrl + obj?.image }}
                name={obj?.translations}
                value={obj?.value}
                type={obj?.type}
                onPress={() => handleDownload(imgUrl + obj?.value)}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('UserAdd', { id: item?.user })}
            style={[
              styles.descBox,
              {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: 'white',
              },
            ]}>
            <Image
              source={
                item?.user?.image
                  ? { uri: imgUrl + item?.user?.image }
                  : Images.user
              }
              style={{ width: 50, height: 50, borderRadius: 100 }}
            />
            <View>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <CustomText
                  label={item?.user?.name}
                  fontFamily={fonts.bold}
                  fontSize={16}
                />
                {item?.user?.badge === 'company' ? (
                  <Companybadge height={25} width={25} />
                ) : item?.user?.badge === 'official' ? (
                  <Officalbadge height={25} width={25} />
                ) : null}
              </View>
            </View>
          </TouchableOpacity>

          <CustomText
            fontSize={16}
            marginBottom={5}
            label={'About this item'}
            fontFamily={fonts.semiBold}
          />
          <View style={styles.descBox}>
            <CustomText label={item?.description} />
          </View>
          <CustomText label={'Address :'} fontSize={12} />
          <View
            style={[
              styles.row1,
              {
                alignItems: 'flex-start',
                marginTop: 5,
                paddingRight: 20,
              },
            ]}>
            <Icons
              name={'location-outline'}
              family={'Ionicons'}
              size={20}
              marginTop={3}
            />
            <CustomText label={item?.area} />
          </View>
          <TouchableOpacity onPress={openGoogleMap} activeOpacity={0.6}>
            <Image
              source={{ uri: mapUrl }}
              style={styles.mapImg}
              resizeMode="stretch"
            />
          </TouchableOpacity>
          {/* {!myAd && (
            <UserCard
              name={item?.user?.name}
              source={item?.user?.image ? item?.user?.image : ''}
              onPress={() =>
                token ? handleChat(null) : ToastMessage('Please login first')
              }
            />
          )} */}

          {item?.item_type === 'auction' && (
            <>
              <TextSpaceBetween leftText={'Recent Bidder'} />
              {bidData?.length > 0 ? (
                bidData.map((obj, index) => (
                  <BidderCard
                    key={index}
                    price={`${obj?.amount}`}
                    name={obj?.user?.name}
                    time={`${obj?.timestamp}`}
                    phone={obj?.user?.phone}
                    isOwner={myAd}
                    onPress={() =>
                      token
                        ? handleChatBidder(obj)
                        : ToastMessage('Please login first')
                    }
                  />
                ))
              ) : (
                <View>
                  <CustomText
                    marginTop={10}
                    marginBottom={20}
                    alignSelf={'center'}
                    label={'No bids added yet'}
                    fontFamily={fonts.semiBold}
                  />
                </View>
              )}
            </>
          )}
          {data?.length > 0 && <TextSpaceBetween leftText={'Related Ads'} />}
          <FlatList
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: ad }) => (
              <HomeCard
                item={ad}
                loading={refreshing}
                source={{ uri: ad?.image }}
                price={Number(ad?.price).toLocaleString()}
                title={ad?.name}
                auctionTIme={ad?.end_time}
                featured={ad?.featured === '1'}
                isRelated
              />
            )}
          />
          {token && !myAd && (
            <View style={styles.reportCard}>
              <CustomText
                label={'Did you find any problem with this item?'}
                fontFamily={fonts.semiBold}
              />
              <TouchableOpacity
                style={styles.reportBtn}
                activeOpacity={0.5}
                onPress={() => navigation.navigate('ReportAd', { id: itemId })}>
                <CustomText
                  label={'Report Ad'}
                  color={colors.white}
                  fontFamily={fonts.semiBold}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <PlaceBidModal
          id={item?.id}
          isVisible={bidModal}
          maxBid={item?.price_max}
          onDisable={() => setBidModal(false)}
          auctionPrice={
            item?.current_price == null ? item?.price : item?.current_price
          }
          fetchData={handleAdDetail}
        />
        <DeleteModal
          isVisible={deleteModal}
          item={item?.id}
          goBack={() => setDeleteModal(false)}
          type={item?.item_type}
        />
        <TermsModal
          isVisible={TermandConidtionModal}
          onDisable={() => setTermandConidtionModal(false)}
          handleDeletePress={handleAgrePress}
          refreshing={TermLoading}
          Terms={() => {
            setTermandConidtionModal(false);
            setTimeout(() => {
              navigation.navigate('Terms', { termId: 4 });
            }, 500);
          }}
        />
        <FeatureModal
          isVisible={featureModal}
          goBack={() => setFeatureModal(false)}
          item={item?.id}
        />
      </ScreenWrapper>
      <AppLoader show={loader} />
      <SliderModal
        images={preparedImages}
        isVisible={imgModal}
        onDisable={() => setImgModal(false)}
      />
    </>
  );
};

export default Detail;

const styles = StyleSheet.create({
  image: {
    height: 230,
    width: '100%',
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  mapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  feature: {
    height: 28,
    width: 76,
    position: 'absolute',
    zIndex: 999,
    top: 14,
    left: 15,
    backgroundColor: colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingBottom: 2,
  },
  button: {
    padding: 8,
    width: '32%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99,
  },
  mapStyle: {
    height: 200,
    width: '100%',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Platform.OS === 'ios' ? 12 : 0,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  mapImg: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  heartBox: {
    backgroundColor: colors.grey,
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    right: 15,
    top: 10,
    borderRadius: 50,
  },
  headerIcon: {
    marginLeft: 10,
  },
  reportCard: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  reportBtn: {
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: colors.lightBlue,
    width: 120,
    marginTop: 10,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  descBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 12,
    marginBottom: 10,
  },
  price: {
    backgroundColor: colors.primaryColor,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingBottom: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 5,
  },
});

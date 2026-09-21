import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import fonts from '../../../assets/fonts';
import { Images } from '../../../assets/images';
import Customlistmodal from '../../../components/Customlistmodal';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import ImageFastWrapper from '../../../components/ImageFast';
import LogoutSheet from '../../../components/LogoutSheet';
import ScreenWrapper from '../../../components/ScreenWrapper';
import ApiRequest, { get } from '../../../services/ApiRequest';
import { getUserProfile, userLogout } from '../../../store/reducer/usersSlice';
import { colors } from '../../../utils/colors';
import { onSharePress } from '../../../utils/Commonfun';
import { imgUrl } from '../../../utils/constants';
import DeleteAccountModal from './ProfileScreens/molecules/DeleteAccountModal';
import { tabIcons } from '../../../assets/images/tabIcons';
import { Image } from 'react-native';

const WEBSITE_URL = 'https://vexem.co/login';
const HeaderIcon = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.logoutIcon} onPress={onPress}>
      <Icons name={'power'} family={'Feather'} />
    </TouchableOpacity>
  );
};

const Profile = () => {
  const sheetRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isfocus = useIsFocused();
  const [visible, setVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [UnseenMessage, setUnseenMessage] = useState('');
  const { loginUser, token } = useSelector(state => state.user);

  const isNewsId = loginUser?.news_cat_ids
    ? JSON.parse(loginUser?.news_cat_ids)
    : '';

  const isStoreId = loginUser?.store_id !== '0' && loginUser?.store_id !== '';

  const sections = [
    ...(isStoreId
      ? [
          {
            name: 'My Offer ads',
            icon: 'star',
            family: 'MaterialCommunityIcons',
            screenName: 'MyOfferAds',
          },
        ]
      : []),
    {
      name: 'My Featured ads',
      icon: 'crown',
      family: 'MaterialCommunityIcons',
      screenName: 'FeaturedAd',
    },

    ...(loginUser?.job_ads
      ? [
          {
            name: 'Job Applications',
            icon: 'crown',
            family: 'MaterialCommunityIcons',
            screenName: 'JobApplication',
            image: Images.jobicn,
          },
        ]
      : []),

    {
      name: 'Job Profiles',
      icon: 'user',
      family: 'AntDesign',
      screenName: 'NewJobProfile',
    },
    {
      name: 'Language',
      icon: 'language',
      family: 'FontAwesome',
      screenName: 'ChangeLanguage',
    },
    {
      name: 'Website',
      icon: 'globe',
      family: 'Feather',
      screenName: '',
    },
    {
      name: 'Notifications',
      icon: 'bell',
      family: 'FontAwesome',
      screenName: 'Notifications',
    },
    {
      name: 'Setting',
      icon: 'setting',
      family: 'AntDesign',
      screenName: 'Setting',
    },
    ...(isNewsId.length > 0
      ? [
          {
            name: 'My News & Blogs',
            icon: 'article',
            family: 'MaterialIcons',
            screenName: 'News',
          },
        ]
      : []),
    {
      name: 'Favourites',
      icon: 'heart',
      family: 'AntDesign',
      screenName: 'Favorite',
    },
    {
      name: 'Favourites News',
      icon: 'heart',
      family: 'AntDesign',
      screenName: 'FavouritesNews',
    },
    {
      name: 'Change Password',
      icon: 'lock',
      family: 'AntDesign',
      screenName: 'ChangePassword',
    },
    {
      name: 'Share this App',
      icon: 'share-2',
      family: 'Feather',
      screenName: '',
    },
    {
      name: 'Contact Us',
      icon: 'contact-mail',
      family: 'MaterialIcons',
      screenName: 'ContactUs',
    },
    {
      name: 'About Us',
      icon: 'info-with-circle',
      family: 'Entypo',
      screenName: 'AboutUs',
    },
    {
      name: 'Terms & Conditions',
      icon: 'card-text',
      family: 'MaterialCommunityIcons',
      screenName: 'Terms',
    },
    {
      name: 'Privacy Policy',
      icon: 'privacy-tip',
      family: 'MaterialIcons',
      screenName: 'PrivacyPolicy',
    },
    ...(token
      ? [
          {
            name: 'Delete Account',
            icon: 'delete',
            family: 'AntDesign',
            screenName: '',
          },
        ]
      : []),
  ];

  const getConversationData = async () => {
    try {
      const response = await get('msg/conversations/');
      const conversations = response?.data?.conversations;

      const totalUnseen = conversations.reduce((total, conversation) => {
        return total + (conversation.unseen || 0);
      }, 0);
      setUnseenMessage(totalUnseen);
    } catch (error) {
      console.log(error, 'in getting chatlist');
      return { conversations: [], totalUnseen: 0 };
    }
  };

  useEffect(() => {
    getConversationData();
  }, [isfocus]);

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const dataToDelete = {
        type: 'update_data',
        table_name: 'users',
        id: token,
        status: 3,
      };
      const res = await ApiRequest(dataToDelete);
      if (res.data?.result) {
        setIsVisible(false);
        setLoading(false);
        dispatch(userLogout());
        navigation.navigate('Home');
      }
    } catch (error) {
      console.log(error, 'err in delete account');
      setLoading(false);
    }
  };

  const handleNavigation = screen => {
    const screens = ['PrivacyPolicy', 'Terms', 'AboutUs', 'ContactUs'];
    if (!screens.includes(screen) && !token) {
      return setVisible(true);
    }

    if (screen === 'News') {
      navigation.navigate('News', { myAd: true });
    } else {
      screen && navigation.navigate(screen);
    }
  };
  useEffect(() => {
    getUserProfile(dispatch, token);
  }, [token, dispatch]);

  const path = loginUser?.image !== imgUrl && loginUser?.image;

  return (
    <ScreenWrapper
      paddingBottom={70}
      headerUnScrollable={() => (
        <Header
          headerColor="#fff"
          title={'Profile'}
          headerLeftIcon={
            token ? (
              <HeaderIcon onPress={() => sheetRef.current?.open()} />
            ) : null
          }
        />
      )}>
      <>
        <View style={styles.topBox}>
          <ImageFastWrapper
            source={path ? { uri: path } : Images.user}
            style={styles.avatar}
          />
          {token ? (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <CustomText
                  label={loginUser?.name}
                  fontFamily={fonts.semiBold}
                  fontSize={16}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate('Chat')}
                  style={styles.iconBox1}>
                  <Image
                    source={tabIcons.chat}
                    resizeMode={'contain'}
                    style={{ height: 24, width: 25, tintColor: colors.white }}
                  />
                  <CustomText label={'inbox'} color={colors.white} />

                  {UnseenMessage > 0 && (
                    <View style={styles.count}>
                      <CustomText
                        label={UnseenMessage}
                        marginTop={-3}
                        color={colors.white}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <CustomText
                label={loginUser?.email}
                numberOfLines={1}
                width={160}
              />
              <View style={{ width: 150 }}>
                <CustomText
                  label={'Edit Profile'}
                  color={colors.primaryColor}
                  containerStyle={styles.editBtn}
                  alignSelf={'center'}
                  fontSize={12}
                  onPress={() => navigation.navigate('EditProfile')}
                />
              </View>
            </View>
          ) : (
            <View>
              <CustomText label={'Guest User'} fontFamily={fonts.semiBold} />
              <CustomText
                label={'login now'}
                color={colors.primaryColor}
                containerStyle={styles.editBtn}
                alignSelf={'center'}
                fontSize={12}
                onPress={() => navigation.navigate('AuthStack')}
              />
            </View>
          )}
        </View>

        <FlatList
          data={sections}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentStyle}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.sectionBox}
              onPress={() =>
                item?.icon === 'delete' && token
                  ? setIsVisible(true)
                  : item.icon === 'share-2'
                  ? onSharePress()
                  : item.icon === 'globe'
                  ? Linking.openURL(WEBSITE_URL)
                  : handleNavigation(item.screenName)
              }>
              <View style={styles.innerBox}>
                <View style={styles.iconBox}>
                  {item?.image ? (
                    <ImageFastWrapper
                      source={item.image}
                      resizeMode={'contain'}
                      style={{ height: 20, width: 20 }}
                    />
                  ) : (
                    <Icons
                      family={item.family}
                      name={item.icon}
                      color={colors.white}
                    />
                  )}
                </View>
                <CustomText
                  label={item.name}
                  fontFamily={fonts.semiBold}
                  numberOfLines={item.name === 'Share this App' ? 4 : 1}
                  lineHeight={item.name === 'Share this App' ? 20 : undefined}
                  containerStyle={styles.sectionLabel}
                  textStyle={styles.sectionLabelText}
                />
              </View>
              <TouchableOpacity
                onPress={() => handleNavigation(item.screenName)}>
                <Icons name={'chevron-right'} family={'Feather'} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </>

      <LogoutSheet bottomSheetRef={sheetRef} />
      <DeleteAccountModal
        isVisible={isVisible}
        StayLoggedIn={() => setIsVisible(false)}
        loading={loading}
        onPress={handleDeleteAccount}
      />
      <Customlistmodal isVisible={visible} onDisable={() => setVisible(false)}>
        <View style={styles.main_container}>
          <CustomText
            fontSize={16}
            label={'Login is required to access this feature'}
            fontFamily={fonts.semiBold}
            marginBottom={5}
          />
          <CustomText fontSize={13} label={'Tap on login to authorize'} />
          <CustomText
            label={'Login now'}
            containerStyle={styles.loginBtn}
            alignSelf={'center'}
            color={'#fff'}
            onPress={() => {
              setVisible(false);
              navigation.navigate('AuthStack');
            }}
          />
        </View>
      </Customlistmodal>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  logoutIcon: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
    borderRadius: 10,
  },
  avatar: {
    height: 75,
    width: 75,
    borderRadius: 100,
    marginRight: 20,
  },
  topBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  editBtn: {
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    marginTop: 5,
    borderColor: colors.primaryColor,
  },
  sectionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    marginBottom: 2,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    minHeight: 56,
  },
  innerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  sectionLabel: {
    flex: 1,
    flexShrink: 1,
    paddingRight: 8,
  },
  sectionLabelText: {
    flexShrink: 1,
  },
  iconBox: {
    backgroundColor: colors.lightBlue,
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  iconBox1: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: colors.lightBlue,
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    position: 'absolute',
    right: 0,
    height: 80,
    width: 60,
    zIndex: 9999,
  },

  count: {
    backgroundColor: colors.red,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 100,
    position: 'absolute',
    right: 5,
    top: 5,
  },
  contentStyle: {
    paddingBottom: 6,
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 18,
    color: colors.black,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },
  main_container: {
    backgroundColor: colors.white,
    padding: 25,
  },
  loginBtn: {
    backgroundColor: colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 40,
    borderRadius: 2,
    marginTop: 15,
  },
});

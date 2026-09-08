/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import fonts from '../assets/fonts';
import { HomeIcon, HomeIcon1 } from '../assets/images';
import { tabIcons } from '../assets/images/tabIcons';
import Customlistmodal from '../components/Customlistmodal';
import CustomText from '../components/CustomText';
import Icons from '../components/Icons';
import i18n from '../Language/i18n';
import Home from '../screens/Main/Home';
import MyAd from '../screens/Main/MyAd';
import Profile from '../screens/Main/Profile';
import StoreDetails from '../screens/Main/StoreDetails';
import { colors } from '../utils/colors';

const Tab = createBottomTabNavigator();

// Empty component that doesn't do anything when navigated to
const EmptyScreen = () => <View />;

const TabStack = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { loginUser, token } = useSelector(store => store.user);
  const canAdNews = loginUser?.news_cat_ids !== '';
  const isStoreId = loginUser?.store_id !== '0' && loginUser?.store_id !== '';

  const openModal = useCallback(() => {
    if (!token) {
      return setVisible(true);
    }
    setModalVisible(true);
  }, [token]);

  const closeModal = () => {
    setModalVisible(false);
  };

  const route = value => {
    setModalVisible(false);
    if (value.type === 'offer') {
      navigation.navigate('CreateOfferAd', { offer: true });
    } else if (value.type === 'blog') {
      navigation.navigate('BlogsCat');
    } else if (value.type === 'news') {
      navigation.navigate('BlogsCat');
    } else {
      navigation.navigate('Categories', { type: value.type });
    }
  };

  const labels = [
    { id: 1, name: 'Publish your ad', type: 'ad', show: true },
    { id: 2, name: 'Publish your auction ad', type: 'auction', show: true },
    { id: 3, name: 'Offer Ads', type: 'offer', show: isStoreId },
    { id: 4, name: 'News', type: 'blog', show: canAdNews },
  ];

  const TabIcon = ({ focused, source }) => {
    return (
      <Image
        source={source}
        style={[
          styles.icon,
          { tintColor: focused ? colors.primaryColor : colors.tabIcon },
        ]}
      />
    );
  };

  const handleTabPress = (routeName, defaultHandler) => {
    if (
      !token &&
      (routeName === i18n.t('Chat') || routeName === i18n.t('My Ads'))
    ) {
      return setVisible(true);
    }
    defaultHandler();
  };

  // This useEffect prevents navigation to the empty screen if someone clicks the middle tab
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      // Check if it's the empty middle tab
      if (e.target.includes('')) {
        // Prevent default navigation behavior
        e.preventDefault();
        // Open the modal instead
        openModal();
      }
    });

    return unsubscribe;
  }, [navigation, token, openModal]);

  return (
    <>
      <Customlistmodal isVisible={modalVisible} onDisable={closeModal}>
        <View style={styles.main_container}>
          <View style={styles.innerBox}>
            <View style={styles.btnClose} />
          </View>

          <View style={styles.modal_container}>
            {labels.map(
              item =>
                item.show && (
                  <TouchableOpacity
                    style={styles?.molecule}
                    onPress={() => route(item)}
                    key={item.id}>
                    <CustomText
                      label={item.name}
                      fontFamily={fonts.regular}
                      fontSize={16}
                    />
                    <View style={styles.icn}>
                      <Icons family={'AntDesign'} name={'right'} />
                    </View>
                  </TouchableOpacity>
                ),
            )}
          </View>
        </View>
      </Customlistmodal>
      <Customlistmodal isVisible={visible} onDisable={() => setVisible(false)}>
        <View style={styles.main_container1}>
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

      <Tab.Navigator
        screenOptions={() => ({
          tabBarStyle: {
            height: 75 + insets.bottom,
            backgroundColor: 'white',
            elevation: 10,
            paddingBottom: insets.bottom + (Platform.OS === 'ios' ? 20 : 12),
            position: 'absolute',
          },
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: colors.primaryColor,
          headerShown: false,
          tabBarLabelStyle: { fontFamily: fonts.semiBold, fontSize: 12 },
        })}
        screenListeners={({ navigation, route }) => ({
          tabPress: e => {
            e.preventDefault();
            handleTabPress(route.name, () => navigation.navigate(route.name));
          },
        })}>
        <Tab.Screen
          component={Home}
          name={i18n.t('Home')}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <HomeIcon height={25} width={25} marginTop={15} />
              ) : (
                <HomeIcon1 height={25} width={25} marginTop={15} />
              ),
          }}
        />
        <Tab.Screen
          component={StoreDetails}
          name={i18n.t('Offers')}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} source={tabIcons.offers} />
            ),
          }}
        />
        <Tab.Screen
          component={EmptyScreen}
          name={' '}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              openModal();
            },
          }}
          options={{
            tabBarIcon: () => (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={openModal}
                style={styles.plusIcon}>
                <Icons name={'add'} color={colors.white} size={30} />
              </TouchableOpacity>
            ),
            tabBarButton: props => (
              <TouchableOpacity {...props} onPress={openModal} />
            ),
          }}
        />

        <Tab.Screen
          component={MyAd}
          name={i18n.t('My Ads')}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} source={tabIcons.myAd} />
            ),
          }}
        />
        <Tab.Screen
          component={Profile}
          name={i18n.t('Profile')}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} source={tabIcons.profile} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default TabStack;

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginBottom: -14,
  },
  tabIcon: {
    height: 18,
    width: 18,
    position: 'absolute',
    bottom: 28,
  },
  main_container: {
    backgroundColor: colors.white,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
  },

  modal_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 30,
  },

  molecule: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icn: {
    backgroundColor: colors.mainBg,
    width: 32,
    height: 32,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnClose: {
    backgroundColor: '#D9D9D9',
    width: 65,
    height: 7,
    borderRadius: 100,
  },
  plusIcon: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    backgroundColor: colors.primaryColor,
    borderRadius: 50,
    marginTop: 30,
  },
  innerBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  main_container1: {
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

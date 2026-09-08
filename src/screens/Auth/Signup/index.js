import { appleAuth } from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import jwt_decode from 'jwt-decode';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import CustomPhone from '../../../components/CustomPhone';
import CustomText from '../../../components/CustomText';
import Layout from '../../../components/Layout';
import { className } from '../../../global-styles';
import { colors } from '../../../utils/colors';

import { AppleIcon, GoogleIcon } from '../../../assets/images';
import { AppLoader } from '../../../components/AppLoader';
import Icons from '../../../components/Icons';
import ApiRequest, { post } from '../../../services/ApiRequest';
import { setUserToken } from '../../../store/reducer/usersSlice';
import { passwordRegex, regEmail } from '../../../utils/Commonfun';
import { ToastMessage } from '../../../utils/ToastMessage';
import { validatePhone } from '../../../utils/constants';
import PrivacySheet from '../../../components/PrivacySheet';

const Signup = () => {
  //

  const sheetRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const init = {
    name: '',
    email: '',
    password: '',
    phone: '',
  };
  const inits = {
    nameError: '',
    emailError: '',
    passwordError: '',
    phoneError: '',
  };

  const [state, setState] = useState(init);
  const [agree, setAgree] = useState(true);
  const [content, setContent] = useState('');
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState(inits);
  const [loading, setLoading] = useState(false);
  const [emailIcon, setEmailIcon] = useState(null);
  const [phoneIcon, setPhoneIcon] = useState(null);
  const [phoneAvail, setPhoneAvail] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [contentLoader, setContentLoader] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  const validateField = (field, value) => {
    let error = '';
    if (field === 'name') {
      if (!value || value?.trim() === '') error = 'Please enter username';
    } else if (field === 'email') {
      if (!value) error = 'Please enter Email';
      else if (!regEmail.test(value)) error = 'Please enter valid email';
    } else if (field === 'phone') {
      const valid = validatePhone(value);
      if (!value) error = 'Please enter phone number';
      else if (!valid)
        error = 'Please enter a valid 10-digit Pakistan phone number';
    } else if (field === 'password') {
      if (!value) error = 'Please enter password';
      else if (!passwordRegex.test(value))
        error = 'Password must contain letters, numbers and minimum 8 digits';
    }
    return error;
  };

  const handleInputChange = (field, value) => {
    setState(prevState => ({ ...prevState, [field]: value }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [`${field}Error`]: validateField(field, value),
    }));
  };

  const checkEmail = async email => {
    if (!email || !regEmail.test(email)) {
      setIsCheckingEmail(false);
      setEmailIcon(null);
      return;
    }

    try {
      setIsCheckingEmail(true);
      const dataToCheck = {
        type: 'check_email',
        email: email,
      };
      const res = await ApiRequest(dataToCheck);
      setIsCheckingEmail(false);
      if (res.data.result) {
        setErrors(prevErrors => ({
          ...prevErrors,
          emailError: '',
        }));
        setIsEmailAvailable(true);
        setEmailIcon(
          <Icons name="check" color={colors.green} family={'Feather'} />,
        );
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          emailError: 'Email already exists',
        }));
        setIsEmailAvailable(false);
        setEmailIcon(
          <Icons name="close" color={colors.red} family={'IonIcons'} />,
        );
      }
    } catch (error) {
      setIsCheckingEmail(false);
      console.log(error);
    }
  };

  const checkPhone = async phone => {
    const valid = validatePhone(phone);
    if (!phone || !valid) {
      setCheckingPhone(false);
      setPhoneIcon(null);
      return;
    }

    try {
      setCheckingPhone(true);
      const dataToCheck = {
        type: 'check_phone',
        phone: '92' + phone,
      };
      const res = await ApiRequest(dataToCheck);
      setCheckingPhone(false);
      if (res.data.result) {
        setPhoneIcon(
          <Icons name="check" color={colors.green} family={'Feather'} />,
        );
        setPhoneAvail(true);
        setErrors(prevErrors => ({
          ...prevErrors,
          phoneError: '',
        }));
      } else {
        setPhoneIcon(
          <Icons name="close" color={colors.red} family={'IonIcons'} />,
        );
        setErrors(prevErrors => ({
          ...prevErrors,
          phoneError: 'Phone number already exists',
        }));
        setPhoneAvail(false);
      }
    } catch (error) {
      setCheckingPhone(false);
      console.log(error);
    }
  };

  const fetchContent = async id => {
    try {
      setContentLoader(true);

      const dataToGet = {
        type: 'get_data',
        table_name: 'content',
        id: id,
      };
      sheetRef.current?.open();
      const res = await ApiRequest(dataToGet);
      if (res.data?.data) {
        const data = JSON.parse(res.data.data[0]?.translations) || {};
        const contentForLang = data?.en;
        setContent(contentForLang);
      }
      setContentLoader(false);
    } catch (error) {
      console.log(error);
      setContentLoader(false);
    }
  };

  const handleDeviceRegistration = async id => {
    try {
      let model = DeviceInfo.getModel();
      let fcmToken = await AsyncStorage.getItem('fcmToken');

      const _data = {
        type: 'add_data',
        table_name: 'devices',
        user_id: id,
        devicePlatform: Platform.OS,
        deviceRid: fcmToken,
        deviceModel: model,
      };

      await ApiRequest(_data);
    } catch (error) {
      console.log(error, 'err in login device');
    }
  };

  const handleSubLogin = async email => {
    try {
      const res = await post('auth/login/user', { email });
      if (res.data?.success) {
        return res.data?.token;
      }
    } catch (error) {
      console.log(error, 'in sub login');
    }
  };

  const handleSubSignup = async (name, email, id) => {
    try {
      const dataToPost = {
        firstName: 'Habeebi User',
        email: email,
        user_id: String(id),
      };
      const res = await post('users/signup/user', dataToPost);
      if (res.data?.success) {
        return res.data?.token;
      }
    } catch (error) {
      console.log(error, 'in sub signup');
    }
  };

  const handleAppleLogin = async () => {
    try {
      if (!appleAuth.isSupported) {
        return ToastMessage(
          'Signin with apple is not supported on this device',
        );
      }

      if (!agree) {
        return ToastMessage(
          'Please agree to our Terms of services and Privacy policy',
        );
      }

      const appleData = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleData.identityToken) {
        return ToastMessage('An error occurred during Apple sign in');
      }

      let appleRes;
      if (appleData.email == null || appleData.email === undefined) {
        appleRes = await jwt_decode(appleData.identityToken);
      } else {
        appleRes = appleData;
      }

      const email = appleRes?.email;
      const name =
        appleRes?.fullName?.familyName + ' ' + appleRes?.fullName?.givenName ||
        '';

      const dataToPost = {
        type: 'social_login',
        provider: 'apple',
        oauth_id: appleRes?.user || appleRes?.sub,
        email: email,
        name: name,
      };

      setLoader(true);
      const res = await ApiRequest(dataToPost);
      let chatToken = '';

      if (res.data?.result) {
        chatToken = await handleSubSignup(name, email, res?.data?.user_id_int);

        if (!chatToken) {
          chatToken = await handleSubLogin(email);
        }

        await AsyncStorage.setItem('chatToken', chatToken);
        await handleDeviceRegistration(res.data?.user_id);
        dispatch(setUserToken(res.data?.user_id));
        navigation.reset({ index: 0, routes: [{ name: 'MainStack' }] });
      }
      setLoader(false);
    } catch (error) {
      console.log(error, 'err in apple auth');
      setLoader(false);
    }
  };

  const hangleGoogleLogin = async () => {
    try {
      if (!agree) {
        return ToastMessage(
          'Please agree to our Terms of services and Privacy policy',
        );
      }

      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();

      const dataToPost = {
        type: 'social_login',
        provider: 'google',
        oauth_id: userInfo.user.id,
        email: userInfo.user.email,
        name: userInfo.user.name,
      };

      setLoader(true);
      const res = await ApiRequest(dataToPost);
      let chatToken = '';
      if (res.data?.result) {
        chatToken = await handleSubSignup(
          userInfo?.user?.name,
          userInfo?.user?.email,
          res?.data?.user_id_int,
        );

        if (!chatToken) {
          chatToken = await handleSubLogin(userInfo?.user?.email);
        }

        await AsyncStorage.setItem('chatToken', chatToken);
        await handleDeviceRegistration(res.data?.user_id);
        dispatch(setUserToken(res.data?.user_id));
        navigation.reset({ index: 0, routes: [{ name: 'MainStack' }] });
      }
      setLoader(false);
    } catch (error) {
      console.log(error, 'err in google auth');
      setLoader(false);
    }
  };

  const handlePress = async () => {
    try {
      console.log('=== SIGNUP START ===', {
        email: state?.email,
        phone: '92' + state?.phone,
        name: state?.name,
        isEmailAvailable,
        phoneAvail,
        agree,
      });

      const isValid = errorCheck();
      console.log('SIGNUP validation', { isValid, errors });
      if (!isValid) {
        console.log('SIGNUP stopped: form validation failed');
        return;
      }

      if (!isEmailAvailable || !phoneAvail) {
        console.log('SIGNUP stopped: email/phone not available', {
          isEmailAvailable,
          phoneAvail,
        });
        ToastMessage('Please use an available email and phone number');
        return;
      }

      if (!agree) {
        console.log('SIGNUP stopped: terms not agreed');
        return ToastMessage(
          'Please agree to our Terms of services and Privacy policy',
        );
      }

      setLoading(true);

      const dataToPost = {
        type: 'register',
        email: state?.email,
        password: state?.password,
        phone: '92' + state?.phone,
        name: state?.name?.trim(),
      };

      console.log('SIGNUP API payload', dataToPost);
      const response = await ApiRequest(dataToPost);
      console.log('SIGNUP API response', response?.data);

      if (response.data?.result) {
        const email = state.email;
        const userId = response.data.user_id;
        const userIdInt = response.data.user_id_int;
        const userName = state?.name?.trim();

        setLoading(false);
        setState(init);
        setErrors(inits);
        setEmailIcon(null);
        setPhoneIcon(null);

        console.log('SIGNUP navigating to EmailMessage', { email, userId });
        navigation.navigate('EmailMessage', {
          email,
          id: userId,
        });

        try {
          console.log('SIGNUP creating chat user');
          let chatToken = await handleSubSignup(userName, email, userIdInt);
          console.log('SIGNUP chatToken from sub signup', chatToken);

          if (!chatToken) {
            chatToken = await handleSubLogin(email);
            console.log('SIGNUP chatToken from sub login', chatToken);
          }

          if (chatToken) {
            await AsyncStorage.setItem('chatToken', chatToken);
          }
          await handleDeviceRegistration(userId);
        } catch (extraError) {
          console.log('SIGNUP extras failed', extraError);
        }
      } else {
        console.log('SIGNUP failed', response?.data);
        setLoading(false);
        ToastMessage(response.data?.message || 'Signup failed');
      }
    } catch (error) {
      console.log('SIGNUP ERROR', error);
      console.log('SIGNUP ERROR response', error?.response?.data);
      setLoading(false);
      ToastMessage(
        error?.response?.data?.message || error?.message || 'Signup failed',
      );
    }
  };

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      newErrors.nameError = validateField('name', state.name);
      newErrors.emailError = validateField('email', state.email);
      newErrors.phoneError = validateField('phone', state.phone);
      newErrors.passwordError = validateField('password', state.password);
      setErrors(newErrors);
      return Object.keys(newErrors).every(key => !newErrors[key]);
    };
  }, [state]);

  return (
    <>
      <Layout showNavBar={false}>
        <CustomText
          label={'Welcome'}
          fontFamily={fonts.semiBold}
          fontSize={22}
          marginTop={50}
        />
        <CustomText
          label={'Sign up to Vexem'}
          marginTop={5}
          marginBottom={35}
          fontSize={16}
        />
        <CustomInput
          placeholder="User Name"
          value={state.name}
          onChangeText={text => handleInputChange('name', text)}
          error={errors.nameError}
        />
        <View>
          <View style={styles.loader}>
            {!errors.emailError && isCheckingEmail ? (
              <ActivityIndicator color={colors.grey} />
            ) : (
              state.email && emailIcon
            )}
          </View>
          <CustomInput
            placeholder="Email"
            value={state.email}
            onChangeText={text => {
              checkEmail(text);
              handleInputChange('email', text);
            }}
            error={errors.emailError}
            keyboardType="email-address"
          />
        </View>
        <View>
          <View style={styles.loader}>
            {!errors.phoneError && checkingPhone ? (
              <ActivityIndicator color={colors.grey} />
            ) : (
              state.phone && phoneIcon
            )}
          </View>
          <CustomPhone
            placeholder="Phone"
            value={state.phone}
            onChangeText={text => {
              checkPhone(text);
              handleInputChange('phone', text);
            }}
            error={errors.phoneError}
          />
        </View>
        <CustomInput
          placeholder="Password"
          value={state.password}
          onChangeText={text => handleInputChange('password', text)}
          error={errors.passwordError}
          secureTextEntry
        />
        <View style={className('flex mb-4')}>
          <TouchableOpacity
            style={styles.checkBox}
            onPress={() => setAgree(!agree)}>
            {agree && <Icons name={'check'} family={'Feather'} />}
          </TouchableOpacity>
          <View style={[className('flex align-center'), { flexWrap: 'wrap' }]}>
            <CustomText
              label={'By Signing in you agree to our '}
              color={colors.grey2}
              fontSize={16}
            />
            <CustomText
              label={'Terms of services'}
              fontFamily={fonts.semiBold}
              onPress={() => fetchContent(1)}
              textDecorationLine={'underline'}
              color={colors.primaryColor}
            />
            <CustomText label={' and  '} color={colors.grey2} fontSize={16} />
            <CustomText
              label={'privacy'}
              fontFamily={fonts.semiBold}
              onPress={() => fetchContent(2)}
              textDecorationLine={'underline'}
              color={colors.primaryColor}
            />
          </View>
        </View>
        <CustomButton
          title={'Signup'}
          onPress={handlePress}
          loading={loading}
          disabled={loading}
        />
        <View style={className('justify-center align-center flex mb-5 mt-3')}>
          <CustomText
            label={'Already have an account?'}
            fontSize={15}
            marginRight={5}
          />
          <CustomText
            label={'Log in'}
            fontFamily={fonts.semiBold}
            fontSize={15}
            color={colors.primaryColor}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
        <CustomText
          label={'Or Sign in with'}
          fontFamily={fonts.semiBold}
          alignSelf={'center'}
        />
        <View style={className('mt-6 mb-5')}>
          {Platform.OS === 'android' ? (
            <TouchableOpacity
              style={className(
                'bg-white justify-center align-center flex mb-3 flex-1 rounded-2 h-13',
              )}
              onPress={hangleGoogleLogin}>
              <GoogleIcon />
              <CustomText
                label={'authGoogle'}
                marginLeft={8}
                fontSize={16}
                fontFamily={fonts.semiBold}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={className(
                'bg-white justify-center align-center flex mb-3 flex-1 rounded-2 h-13',
              )}
              onPress={handleAppleLogin}>
              <AppleIcon />
              <CustomText
                label={'authApple'}
                marginLeft={8}
                fontSize={16}
                fontFamily={fonts.semiBold}
              />
            </TouchableOpacity>
          )}
        </View>
      </Layout>
      <AppLoader show={loader} />
      <PrivacySheet
        content={content}
        loading={contentLoader}
        setContent={setContent}
        bottomSheetRef={sheetRef}
      />
    </>
  );
};

export default Signup;

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 14,
  },

  checkBox: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 4,
    marginRight: 10,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
});

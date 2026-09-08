import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import CustomText from '../../../components/CustomText';
import Layout from '../../../components/Layout';
import OTPComponent from '../../../components/OTP';
import { className } from '../../../global-styles';
import ApiRequest from '../../../services/ApiRequest';
import { useDispatch } from 'react-redux';
import { setUserToken } from '../../../store/reducer/usersSlice';
import { ToastMessage } from '../../../utils/ToastMessage';

const VerifyUser = () => {
  //

  const { params } = useRoute();

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(59);
  const [loading, setLoading] = useState(false);

  const handleResendCode = async () => {
    try {
      setTimer(59);
      const dataToSend = {
        type: 'send_code',
        email: params?.email,
      };

      await ApiRequest(dataToSend);
    } catch (error) {
      console.log(error, 'errr in sending code');
    }
  };

  const handlePress = async () => {
    try {
      const dataToPost = {
        type: 'verify_code',
        user_id: params?.id,
        code: value,
      };

      setLoading(true);
      const res = await ApiRequest(dataToPost);
      if (res.data?.result) {
        dispatch(setUserToken(params?.id));
        navigation.reset({ index: 0, routes: [{ name: 'LocationAccess' }] });
      } else {
        ToastMessage('Incorrect code');
      }
      setLoading(false);
    } catch (error) {
      console.log(error, 'err in verify user');
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <Layout StatusBarBg="#fff">
      <CustomText
        label={'OTP Verfication'}
        fontFamily={fonts.bold}
        fontSize={20}
        marginTop={50}
      />
      <CustomText label={'We have sent a code to'} marginTop={10} />
      <CustomText
        label={params?.email}
        fontFamily={fonts.semiBold}
        marginBottom={25}
        fontSize={16}
      />
      <OTPComponent value={value} setValue={setValue} />
      <CustomButton
        title={'Continue'}
        onPress={handlePress}
        customStyle={className('my-7')}
        loading={loading}
        disabled={value?.length < 4 || loading}
      />
      <View style={className('align-self flex')}>
        {timer > 0 ? (
          <View style={className('align-self flex')}>
            <CustomText
              label={'Resend code in  '}
              fontFamily={fonts.semiBold}
            />
            <Text
              style={className('text-black text-bold')}>{`00:${timer}`}</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={handleResendCode}>
            <CustomText
              label={'Resend Code'}
              fontFamily={fonts.semiBold}
              fontSize={15}
            />
          </TouchableOpacity>
        )}
      </View>
    </Layout>
  );
};

export default VerifyUser;

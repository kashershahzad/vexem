import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import CustomText from '../../../components/CustomText';
import Layout from '../../../components/Layout';
import OTPComponent from '../../../components/OTP';
import { className } from '../../../global-styles';
import ApiRequest from '../../../services/ApiRequest';
import { ToastMessage } from '../../../utils/ToastMessage';

const VerifyOtp = () => {
  //

  const { params } = useRoute();
  const navigation = useNavigation();

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
      setLoading(true);
      const dataToSend = {
        type: 'verify_code',
        user_id: params?.id,
        code: value,
      };

      const res = await ApiRequest(dataToSend);
      if (res.data?.result) {
        navigation.navigate('NewPassword', { id: params?.id });
      } else {
        ToastMessage('Invalid code');
      }
      console.log(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error, 'err in verification otp');
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
        fontSize={18}
        marginTop={40}
      />
      <CustomText
        label={'We have sent a code to'}
        marginTop={10}
        fontSize={16}
      />
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
        disabled={value?.length < 4 || loading}
        loading={loading}
      />
      <View style={className('align-self flex')}>
        {timer > 0 ? (
          <View style={className('align-self flex')}>
            <CustomText
              label={'Resend code in  '}
              fontFamily={fonts.semiBold}
              top={0}
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

export default VerifyOtp;

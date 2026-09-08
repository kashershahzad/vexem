import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import CustomText from '../../../components/CustomText';
import Layout from '../../../components/Layout';
import Tab from '../../../components/TabBar';
import { className } from '../../../global-styles';
import { colors } from '../../../utils/colors';
import { regEmail } from '../../../utils/Commonfun';
import CustomPhone from '../../../components/CustomPhone';
import ApiRequest from '../../../services/ApiRequest';
import { ToastMessage } from '../../../utils/ToastMessage';
import { validatePhone } from '../../../utils/constants';

const ForgotPassword = () => {
  const navigation = useNavigation();

  const init = {
    email: '',
    phone: '',
  };
  const inits = {
    emailError: '',
    phoneError: '',
  };

  const [state, setState] = useState(init);
  const [errors, setErrors] = useState(inits);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const validateField = (field, value) => {
    let error = '';

    if (field === 'email') {
      if (!value) error = 'Please enter email address';
      else if (!regEmail.test(value)) error = 'Please enter valid email';
    } else if (field === 'phone') {
      const valid = validatePhone(value);
      if (!value) error = 'Please enter phone number';
      else if (!valid) error = 'Please enter valid phone number';
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

  const handlePress = async () => {
    try {
      if (errorCheck()) {
        setLoading(true);
        const dataToSend = {
          type: 'send_code',
          email: activeTab === 0 ? state.email : '974' + state.phone,
        };
        const res = await ApiRequest(dataToSend);
        if (res.data?.result) {
          navigation.navigate('VerifyOtp', {
            email: state.email || '974' + state.phone,
            id: res.data?.user_id,
          });
        } else {
          ToastMessage('User does not exist');
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error, 'errr in sending code');
      setLoading(false);
    }
  };

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      if (activeTab === 0) {
        newErrors.emailError = validateField('email', state.email);
      } else if (activeTab === 1) {
        newErrors.phoneError = validateField('phone', state.phone);
      }

      setErrors(newErrors);
      return Object.keys(newErrors).every(key => !newErrors[key]);
    };
  }, [state, activeTab]);

  return (
    <Layout
      StatusBarBg={colors.white}
      footerComponent={
        <View style={className('justify-center align-center flex mb-5')}>
          <CustomText
            label={'Remember password?'}
            fontSize={15}
            marginRight={5}
          />
          <CustomText
            label={'Sign in'}
            fontFamily={fonts.semiBold}
            fontSize={15}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      }>
      <CustomText
        label={'Forgot Password'}
        fontFamily={fonts.semiBold}
        fontSize={17}
        marginTop={50}
      />
      <CustomText label={'forgotDes'} marginTop={5} marginBottom={25} />
      <View style={{ marginTop: 10 }}>
        <Tab tab={activeTab} setTab={setActiveTab} />
      </View>
      {activeTab === 0 ? (
        <CustomInput
          placeholder="Enter email here"
          value={state.email}
          onChangeText={text => handleInputChange('email', text)}
          error={errors?.emailError}
          keyboardType="email-address"
        />
      ) : (
        <CustomPhone
          placeholder="Enter phone number here"
          value={state.phone}
          onChangeText={text => handleInputChange('phone', text)}
          error={errors?.phoneError}
        />
      )}
      <CustomButton
        title={'Continue'}
        disabled={loading}
        onPress={handlePress}
        loading={loading}
      />
    </Layout>
  );
};

export default ForgotPassword;

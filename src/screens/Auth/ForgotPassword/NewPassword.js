import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import CustomText from '../../../components/CustomText';
import Layout from '../../../components/Layout';
import { className } from '../../../global-styles';
import { passwordRegex } from '../../../utils/Commonfun';
import ApiRequest from '../../../services/ApiRequest';
import { ToastMessage } from '../../../utils/ToastMessage';

const NewPassword = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const init = {
    nPassword: '',
    cPassword: '',
  };
  const inits = {
    nPasswordError: '',
    cPasswordError: '',
  };
  const [state, setState] = useState(init);
  const [errors, setErrors] = useState(inits);
  const [loading, setLoading] = useState(false);

  const validateField = (field, value) => {
    let error = '';

    if (field === 'nPassword') {
      if (!value) {
        error = 'Please enter new password';
      } else if (!passwordRegex.test(value)) {
        error = 'Password must contain letters, numbers and minimum 8 digits';
      } else if (state.cPassword && value !== state.cPassword) {
        setErrors({
          ...errors,
          cPasswordError: 'Password do not match',
          nPasswordError: '',
        });
      } else {
        setErrors({ ...errors, cPasswordError: '', nPasswordError: '' });
      }
    } else if (field === 'cPassword') {
      if (!value) error = 'Please enter confirm password';
      else if (state.nPassword && value !== state.nPassword)
        error = 'Passwords do not match';
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
          type: 'forgot_password',
          password: state.nPassword,
          user_id: params?.id,
        };

        const res = await ApiRequest(dataToSend);

        if (res.data?.result) {
          ToastMessage('Password reset successfully');
          navigation.navigate('Login');
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error, 'err in change password');
      setLoading(false);
    }
  };

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      newErrors.nPasswordError = validateField('nPassword', state.nPassword);
      newErrors.cPasswordError = validateField('cPassword', state.cPassword);
      setErrors(newErrors);
      return Object.keys(newErrors).every(key => !newErrors[key]);
    };
  }, [state]);

  return (
    <Layout StatusBarBg="#fff">
      <CustomText
        label={'Reset Password'}
        fontFamily={fonts.bold}
        fontSize={20}
        marginTop={50}
      />
      <CustomText label={'resetDes'} />
      <CustomText
        label={params?.email}
        fontFamily={fonts.semiBold}
        marginBottom={25}
        fontSize={16}
        marginTop={-20}
      />
      <CustomInput
        withLabel={'New Password'}
        value={state.nPassword}
        onChangeText={e => handleInputChange('nPassword', e)}
        secureTextEntry
        error={errors.nPasswordError}
      />
      <CustomInput
        withLabel={'Confirm Password'}
        value={state.cPassword}
        onChangeText={e => handleInputChange('cPassword', e)}
        secureTextEntry
        error={errors.cPasswordError}
      />
      <CustomButton
        title={'Reset Password'}
        onPress={handlePress}
        customStyle={className('mt-5')}
        disabled={loading}
        loading={loading}
      />
    </Layout>
  );
};

export default NewPassword;

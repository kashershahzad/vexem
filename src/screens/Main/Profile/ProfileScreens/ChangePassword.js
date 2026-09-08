import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import fonts from '../../../../assets/fonts';
import CustomButton from '../../../../components/CustomButton';
import CustomInput from '../../../../components/CustomInput';
import CustomText from '../../../../components/CustomText';
import Header from '../../../../components/Header';
import ScreenWrapper from '../../../../components/ScreenWrapper';
import ApiRequest from '../../../../services/ApiRequest';
import { colors } from '../../../../utils/colors';
import { ToastMessage } from '../../../../utils/ToastMessage';
import { passwordRegex } from '../../../../utils/Commonfun';

const ChangePassword = () => {
  //

  const init = {
    password: '',
    nPassword: '',
    cPassword: '',
  };
  const inits = {
    passwordError: '',
    nPasswordError: '',
    cPasswordError: '',
  };
  const [state, setState] = useState(init);
  const [errors, setErrors] = useState(inits);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const { token } = useSelector(store => store.user);

  const validateField = (field, value) => {
    let error = '';

    if (field === 'password') {
      if (!value || value.trim() === '') error = 'Please enter password';
    } else if (field === 'nPassword') {
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
          type: 'change_password',
          old_password: state.password,
          password: state.nPassword,
          user_id: token,
        };

        const res = await ApiRequest(dataToSend);

        if (res.data.result) {
          ToastMessage('Password Changed Successfully');
          navigation.navigate('Home');
        } else {
          ToastMessage(res.data?.message);
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
      newErrors.passwordError = validateField('password', state.password);
      newErrors.nPasswordError = validateField('nPassword', state.nPassword);
      newErrors.cPasswordError = validateField('cPassword', state.cPassword);
      setErrors(newErrors);
      return Object.keys(newErrors).every(key => !newErrors[key]);
    };
  }, [state]);

  return (
    <ScreenWrapper
      scrollEnabled
      statusBarColor={colors.white}
      headerUnScrollable={() => <Header title={'Change Password'} />}>
      <CustomText
        label={'passChange'}
        marginTop={20}
        marginBottom={30}
        fontFamily={fonts.semiBold}
      />
      <CustomInput
        withLabel={'Current Password'}
        value={state.password}
        onChangeText={e => handleInputChange('password', e)}
        secureTextEntry
        error={errors.passwordError}
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
      <View style={styles.footer}>
        <CustomButton
          title={'Change Password'}
          onPress={handlePress}
          loading={loading}
          disabled={loading}
        />
      </View>
    </ScreenWrapper>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 10,
  },
});

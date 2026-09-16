/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo, useState } from 'react';
import fonts from '../../../../assets/fonts';
import CustomButton from '../../../../components/CustomButton';
import CustomInput from '../../../../components/CustomInput';
import CustomText from '../../../../components/CustomText';
import Header from '../../../../components/Header';
import ScreenWrapper from '../../../../components/ScreenWrapper';
import { regEmail } from '../../../../utils/Commonfun';
import { useSelector } from 'react-redux';
import ApiRequest from '../../../../services/ApiRequest';
import { ToastMessage } from '../../../../utils/ToastMessage';
import { colors } from '../../../../utils/colors';

const ContactUs = ({ navigation }) => {
  const init = {
    title: '',
    email: '',
    desc: '',
  };
  const inits = {
    titleError: '',
    emailError: '',
    descError: '',
  };
  const [state, setState] = useState(init);
  const [errors, setErrors] = useState(inits);
  const [loading, setLoading] = useState(false);

  const { token } = useSelector(store => store.user);

  const validateField = (field, value) => {
    let error = '';

    if (field === 'title') {
      if (!value || value?.trim() === '') error = 'Please enter title';
    } else if (field === 'email') {
      if (!value) error = 'Please enter Email';
      else if (!regEmail.test(value)) error = 'Please enter valid email';
    } else if (field === 'desc') {
      if (!value || value.trim() === '') error = 'Please enter message';
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
        const dataToPost = {
          type: 'add_data',
          table_name: 'contact_us',
          user_id: token,
          name: state.title.trim(),
          email: state.email,
          message: state.desc.trim(),
        };

        const res = await ApiRequest(dataToPost);
        if (res.data?.result) {
          setLoading(false);
          navigation.navigate('Home');
          ToastMessage('Request sent successfully');
        }
      }
    } catch (error) {
      console.log(error, 'err in contact us');
      setLoading(false);
    }
  };

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      newErrors.titleError = validateField('title', state.title);
      newErrors.emailError = validateField('email', state.email);
      newErrors.descError = validateField('desc', state.desc);
      setErrors(newErrors);
      return Object.keys(newErrors).every(key => !newErrors[key]);
    };
  }, [state]);

  return (
    <ScreenWrapper
      scrollEnabled
      statusBarColor={colors.white}
      headerUnScrollable={() => <Header title={'Contact Us'} />}>
      <CustomText
        label={'How can we help you?'}
        marginBottom={12}
        marginTop={20}
        fontSize={16}
        fontFamily={fonts.bold}
      />
      <CustomText label={'helpDes'} marginBottom={22} />
      <CustomInput
        withLabel={'Title'}
        placeholder={'Enter title'}
        value={state.title}
        onChangeText={e => handleInputChange('title', e)}
        error={errors.titleError}
      />
      <CustomInput
        withLabel={'Email'}
        placeholder={'Enter email'}
        value={state.email}
        onChangeText={e => handleInputChange('email', e)}
        error={errors.emailError}
        keyboardType="email-address"
      />
      <CustomInput
        withLabel={'Message'}
        placeholder={'Enter message'}
        value={state.desc}
        onChangeText={e => handleInputChange('desc', e)}
        error={errors.descError}
        multiline
      />
      <CustomButton
        title={'Submit'}
        onPress={handlePress}
        marginBottom={10}
        marginTop={10}
        disabled={loading}
        loading={loading}
      />
    </ScreenWrapper>
  );
};

export default ContactUs;

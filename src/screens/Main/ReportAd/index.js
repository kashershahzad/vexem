import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import Header from '../../../components/Header';
import ScreenWrapper from '../../../components/ScreenWrapper';
import ApiRequest from '../../../services/ApiRequest';
import { ToastMessage } from '../../../utils/ToastMessage';

const ReportAd = () => {
  const { params } = useRoute();
  const navigation = useNavigation();

  const init = {
    reason: '',
  };
  const inits = {
    reasonError: '',
  };

  const [state, setState] = useState(init);
  const [errors, setErrors] = useState(inits);
  const [loading, setLoading] = useState(false);

  const { token } = useSelector(store => store?.user);

  const validateField = (field, value) => {
    let error = '';

    if (field === 'reason') {
      if (!value || value?.trim() === '') error = 'Please enter reason';
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
          table_name: 'reports',
          user_id: token,
          item_id: params?.id,
          reason: state.reason?.trim(),
        };

        const res = await ApiRequest(dataToPost);

        if (res.data?.result) {
          navigation.navigate('Home');
          ToastMessage('Your request has been sent');
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error, 'err in report ad');
      setLoading(false);
    }
  };

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      newErrors.reasonError = validateField('reason', state.reason);
      setErrors(newErrors);
      return Object.keys(newErrors).every(key => !newErrors[key]);
    };
  }, [state]);

  return (
    <ScreenWrapper headerUnScrollable={() => <Header title={'Report Ad'} />}>
      <View style={{ marginTop: 20 }}>
        <CustomInput
          withLabel={'Reason'}
          placeholder={'Enter reason here...'}
          value={state.reason}
          onChangeText={e => handleInputChange('reason', e)}
          error={errors.reasonError}
          multiline
          height={300}
        />
        <CustomButton
          title={'Report'}
          loading={loading}
          disabled={loading}
          onPress={handlePress}
        />
      </View>
    </ScreenWrapper>
  );
};

export default ReportAd;

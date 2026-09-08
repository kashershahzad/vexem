import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../../../components/CustomButton';
import CustomInput from '../../../../components/CustomInput';
import Header from '../../../../components/Header';
import ScreenWrapper from '../../../../components/ScreenWrapper';
import { className } from '../../../../global-styles';
import { colors } from '../../../../utils/colors';
import { pick } from '@react-native-documents/picker';
import { ToastMessage } from '../../../../utils/ToastMessage';
import Icons from '../../../../components/Icons';
import fonts from '../../../../assets/fonts';
import CustomText from '../../../../components/CustomText';
import ApiRequest from '../../../../services/ApiRequest';

const VerifyDocuments = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loginUser, token } = useSelector(state => state.user);

  const [fileLoader, setFileLoader] = useState(false);
  const [fileLoader1, setFileLoader1] = useState(false);
  const [fileLoader2, setFileLoader2] = useState(false);

  const [imgLoading1, setImgLoading1] = useState(false);
  const [imgLoading2, setImgLoading2] = useState(false);
  const [imgLoading3, setImgLoading3] = useState(false);

  const init = {
    company_name: '',
    computer_card: '',
    registration: '',
    id_card: '',
  };
  const inits = {
    companynameError: '',
    computercardError: '',
    registrationError: '',
    idcardError: '',
  };

  const [state, setState] = useState(init);
  const [errors, setErrors] = useState(inits);
  const [loading, setLoading] = useState(false);

  const validateField = (field, value) => {
    let error = '';

    if (field === 'company_name') {
      if (!value || value?.trim() === '') error = 'Please enter Company Name';
    } else if (field === 'computer_card') {
      if (!value) error = 'Please upload computerized card';
    } else if (field === 'registration') {
      if (!value) error = 'Please upload registration';
    } else if (field === 'id_card') {
      if (!value) error = 'Please upload Id Card';
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
    setLoading(true);
    try {
      if (errorCheck()) {
        const dataToSend = {
          type: 'add_data',
          table_name: 'verification_requests',
          user_id: token,
          company_name: state.company_name,
          computer_card: state.computer_card,
          registration: state.registration,
          id_card: state.id_card,
        };
        const res = await ApiRequest(dataToSend);
        if (res.data?.result) {
          setLoading(false);
          navigation.navigate('Home');
          ToastMessage(res?.data?.message);
        }
      }
    } catch (error) {
      console.log(error, 'err in update profile');
      setLoading(false);
    }
  };

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      newErrors.companynameError = validateField(
        'company_name',
        state.company_name,
      );
      newErrors.computercardError = validateField(
        'computer_card',
        state.computer_card,
      );
      newErrors.registrationError = validateField(
        'registration',
        state.registration,
      );
      newErrors.idcardError = validateField('id_card', state.id_card);
      setErrors(newErrors);
      return Object.keys(newErrors).every(key => !newErrors[key]);
    };
  }, [state]);

  const HanderRemovePdf = () => {
    setState(prevState => ({
      ...prevState,
      computer_card: '',
    }));
  };

  const HanderRemovePdf2 = () => {
    setState(prevState => ({
      ...prevState,
      registration: '',
    }));
  };

  const HanderRemovePdf3 = () => {
    setState(prevState => ({
      ...prevState,
      id_card: '',
    }));
  };
  const onPicker = async () => {
    try {
      const [pickResult] = await pick({
        type: ['application/pdf'],
      });
      const res = [pickResult];
      const file = {
        fileCopyUri: null,
        name: res[0].name,
        size: res[0].size,
        type: res[0].type,
        uri: res[0].uri,
      };
      setFileLoader(true);
      const body = new FormData();
      body.append('type', 'upload_data');
      body.append('dir', 'chat_uploads');
      body.append('file', file);
      const response = await ApiRequest(body);
      if (response.data?.file_path) {
        setState({ ...state, computer_card: response.data?.file_name });
        setErrors({ ...errors, computercardError: '' });
      } else {
        setState({ ...state, computer_card: '' });
        ToastMessage('Upload again');
      }
      setFileLoader(false);
    } catch (err) {
      console.log(err);
      setFileLoader(false);
    }
  };

  const onPicker2 = async () => {
    try {
      const [pickResult] = await pick({
        type: ['application/pdf'],
      });
      const res = [pickResult];
      const file = {
        fileCopyUri: null,
        name: res[0].name,
        size: res[0].size,
        type: res[0].type,
        uri: res[0].uri,
      };
      setFileLoader1(true);
      const body = new FormData();
      body.append('type', 'upload_data');
      body.append('dir', 'chat_uploads');
      body.append('file', file);
      const response = await ApiRequest(body);
      if (response.data?.file_path) {
        setState({ ...state, registration: response.data?.file_name });
        setErrors({ ...errors, registrationError: '' });
      } else {
        setState({ ...state, registration: '' });
        ToastMessage('Upload again');
      }
      setFileLoader1(false);
    } catch (err) {
      console.log(err);
      setFileLoader1(false);
    }
  };

  const onPicker3 = async () => {
    try {
      const [pickResult] = await pick({
        type: ['application/pdf'],
      });
      const res = [pickResult];
      const file = {
        fileCopyUri: null,
        name: res[0].name,
        size: res[0].size,
        type: res[0].type,
        uri: res[0].uri,
      };
      setFileLoader2(true);
      const body = new FormData();
      body.append('type', 'upload_data');
      body.append('dir', 'chat_uploads');
      body.append('file', file);
      const response = await ApiRequest(body);
      if (response.data?.file_path) {
        setState({ ...state, id_card: response.data?.file_name });
        setErrors({ ...errors, idcardError: '' });
      } else {
        setState({ ...state, id_card: '' });
        ToastMessage('Upload again');
      }
      setFileLoader2(false);
    } catch (err) {
      console.log(err);
      setFileLoader2(false);
    }
  };

  return (
    <>
      <ScreenWrapper
        scrollEnabled
        headerUnScrollable={() => <Header title={'Documents'} />}>
        <View style={className('mt-10')}>
          <CustomInput
            withLabel={'Company Name'}
            placeholder={'Enter your name'}
            value={state.company_name}
            onChangeText={e => handleInputChange('company_name', e)}
            error={errors.companynameError}
          />

          <TouchableOpacity
            onPress={onPicker}
            activeOpacity={0.6}
            style={styles.upload}>
            <Icons name={'add'} top={1} left={-5} />
            <CustomText label={'Computer Card'} />
          </TouchableOpacity>
          <View>
            {fileLoader ? (
              <View style={styles.loader}>
                <ActivityIndicator size={24} color={colors.white} />
              </View>
            ) : (
              <>
                {state.computer_card && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 5,
                    }}>
                    <CustomText
                      label={state.computer_card}
                      fontFamily={fonts.semiBold}
                      numberOfLines={2}
                      fontSize={16}
                      marginTop={5}
                      color={colors.primaryColor}
                    />
                    <TouchableOpacity
                      style={styles.crossIconPdf}
                      disabled={imgLoading1}
                      onPress={HanderRemovePdf}>
                      <Icons name={'close'} size={20} color={'black'} />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
          <CustomText
            label={errors.computercardError}
            color={colors.red}
            marginBottom={20}
          />

          <TouchableOpacity
            onPress={onPicker2}
            activeOpacity={0.6}
            style={styles.upload}>
            <Icons name={'add'} top={1} left={-5} />
            <CustomText label={'Commercial Registration'} />
          </TouchableOpacity>
          <View>
            {fileLoader1 ? (
              <View style={styles.loader}>
                <ActivityIndicator size={24} color={colors.white} />
              </View>
            ) : (
              <>
                {state.registration && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',

                      alignItems: 'center',
                      gap: 5,
                    }}>
                    <CustomText
                      label={state.registration}
                      fontFamily={fonts.semiBold}
                      numberOfLines={2}
                      fontSize={16}
                      marginTop={5}
                      color={colors.primaryColor}
                    />
                    <TouchableOpacity
                      style={styles.crossIconPdf}
                      disabled={imgLoading2}
                      onPress={HanderRemovePdf2}>
                      <Icons name={'close'} size={20} color={'black'} />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
          <CustomText
            label={errors.registrationError}
            color={colors.red}
            marginBottom={20}
          />

          <TouchableOpacity
            onPress={onPicker3}
            activeOpacity={0.6}
            style={styles.upload}>
            <Icons name={'add'} top={1} left={-5} />
            <CustomText label={'QID of a shareholder'} />
          </TouchableOpacity>
          <View>
            {fileLoader2 ? (
              <View style={styles.loader}>
                <ActivityIndicator size={24} color={colors.white} />
              </View>
            ) : (
              <>
                {state.id_card && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',

                      gap: 5,
                    }}>
                    <CustomText
                      label={state.id_card}
                      fontFamily={fonts.semiBold}
                      numberOfLines={2}
                      fontSize={16}
                      marginTop={5}
                      color={colors.primaryColor}
                    />
                    <TouchableOpacity
                      style={styles.crossIconPdf}
                      disabled={imgLoading3}
                      onPress={HanderRemovePdf3}>
                      <Icons name={'close'} size={20} color={'black'} />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
          <CustomText
            label={errors.idcardError}
            color={colors.red}
            marginBottom={20}
          />

          <CustomButton
            title={'Submit'}
            loading={loading}
            onPress={handlePress}
            customStyle={{ marginBottom: 40, marginTop: 20 }}
            disabled={loading}
          />
        </View>
      </ScreenWrapper>
    </>
  );
};

export default VerifyDocuments;

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    bottom: -10,
    right: 10,
    padding: 5,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryColor,
    borderWidth: 2,
    borderColor: colors.white,
  },
  imageCircle: {
    borderWidth: 2,
    borderRadius: 100,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 30,
    padding: 10,
    borderColor: colors.primaryColor,
  },
  img: {
    width: 90,
    height: 90,
    borderRadius: 100,
  },
  loader: {
    width: 90,
    height: 90,
    borderRadius: 100,
    backgroundColor: '#0000009E',
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 10,
  },
  locationBtn: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 10,
    backgroundColor: colors.white,
    marginBottom: 15,
    flex: 1,
    marginLeft: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  upload: {
    height: 50,
    width: '100%',
    borderStyle: 'dashed',
    borderColor: '#343F534D',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 5,
  },
  loader: {
    backgroundColor: '#0000004E',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 5,
  },

  crossIconPdf: {
    width: 22,
    height: 22,
    backgroundColor: '#FFFFFF99',
    elevation: 2,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

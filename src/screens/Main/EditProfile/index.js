import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import fonts from '../../../assets/fonts';
import { Images } from '../../../assets/images';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import CustomPhone from '../../../components/CustomPhone';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import ImageFastWrapper from '../../../components/ImageFast';
import LocationModal from '../../../components/LocationModal';
import ScreenWrapper from '../../../components/ScreenWrapper';
import UploadImage from '../../../components/UploadImage';
import { className } from '../../../global-styles';
import ApiRequest, { put } from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import {
  imgUrl,
  uploadAndGetUrl,
  validatePhone,
} from '../../../utils/constants';
import { ToastMessage } from '../../../utils/ToastMessage';
import { getUserProfile } from '../../../store/reducer/usersSlice';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loginUser, token } = useSelector(state => state.user);

  const strippedPhoneNumber = loginUser?.phone.replace(/^974/, '');

  const init = {
    name: loginUser?.name,
    email: loginUser?.email,
    address: loginUser?.address,
    phone: strippedPhoneNumber,
    lat: loginUser?.lat,
    lng: loginUser?.lng,
    image: loginUser?.image,
  };
  const inits = {
    nameError: '',
    emailError: '',
    addressError: '',
    phoneError: '',
  };
  const [state, setState] = useState(init);
  const [errors, setErrors] = useState(inits);
  const [imgLoader, setImgLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateField = (field, value) => {
    let error = '';

    if (field === 'name') {
      if (!value || value?.trim() === '') error = 'Please enter username';
    } else if (field === 'phone') {
      const valid = validatePhone(value);
      if (!value) error = 'Please enter phone number';
      else if (!valid) error = 'Please enter valid phone number';
    } else if (field === 'address') {
      if (!value) error = 'Please enter your address';
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

  const handleSubEdit = async () => {
    try {
      const dataToPost = {
        profileImage: state.image?.split('/').pop(),
        firstName: state.name,
      };

      const a = await put('users/edit', dataToPost);
      console.log(a.data);
    } catch (error) {
      console.log(error, 'err in sub edit');
    }
  };

  const handlePress = async () => {
    try {
      if (errorCheck()) {
        setLoading(true);
        const dataToSend = {
          type: 'update_data',
          table_name: 'users',
          id: token,
          name: state.name.trim(),
          email: state.email,
          phone: '974' + state.phone,
          address: state.address,
          lat: state.lat,
          lng: state.lng,
          image: state.image?.split('/').pop(),
        };

        const res = await ApiRequest(dataToSend);
        if (res.data?.result) {
          getUserProfile(dispatch, token);
          await handleSubEdit();
          setLoading(false);
          navigation.navigate('Home');
          ToastMessage('Profile updated successfully');
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
      newErrors.nameError = validateField('name', state.name);
      newErrors.emailError = validateField('email', state.email);
      newErrors.phoneError = validateField('phone', state.phone);
      newErrors.addressError = validateField('address', state.address);
      setErrors(newErrors);
      return Object.keys(newErrors).every(key => !newErrors[key]);
    };
  }, [state]);

  const isOnlyUrl = state.image === imgUrl;
  const isAttachUrl = state.image?.includes(imgUrl);

  const path = isOnlyUrl
    ? ''
    : isAttachUrl
    ? state.image
    : imgUrl + state.image;

  return (
    <ScreenWrapper
      scrollEnabled
      headerUnScrollable={() => <Header title={'Edit Profile'} />}>
      <UploadImage
        handleChange={async res => {
          const url = await uploadAndGetUrl(res);
          setState({ ...state, image: url });
        }}
        renderButton={res => (
          <View style={styles.imageCircle}>
            {imgLoader && (
              <View style={styles.loader}>
                <ActivityIndicator size={30} color={colors.white} />
              </View>
            )}
            <ImageFastWrapper
              source={path ? { uri: path } : Images.user}
              style={styles.img}
            />
            <TouchableOpacity style={styles.btn} onPress={res}>
              <Icons name={'edit'} family={'Feather'} color={colors.white} />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={className('mt-10')}>
        <CustomInput
          withLabel={'Name'}
          placeholder={'Enter your name'}
          value={state.name}
          onChangeText={e => handleInputChange('name', e)}
          error={errors.nameError}
        />
        <CustomInput
          withLabel={'Email'}
          placeholder={'Enter your email'}
          value={state.email}
          onChangeText={e => handleInputChange('email', e)}
          error={errors.emailError}
          keyboardType="email-address"
          editable={false}
        />
        <CustomText
          label={'Phone'}
          fontFamily={fonts.semiBold}
          marginBottom={8}
        />
        <CustomPhone
          placeholder="Phone"
          value={state.phone}
          onChangeText={e => handleInputChange('phone', e)}
          error={errors.phoneError}
        />
        <TouchableOpacity onPress={() => setVisible(true)} activeOpacity={0.5}>
          <CustomInput
            withLabel={'Address'}
            placeholder={'Enter your address'}
            value={state.address}
            onChangeText={e => handleInputChange('address', e)}
            error={errors.addressError}
            editable={false}
          />
        </TouchableOpacity>
        <CustomButton
          title={'Update'}
          loading={loading}
          onPress={handlePress}
          customStyle={{ marginBottom: 40, marginTop: 20 }}
          disabled={loading}
        />
        {loginUser?.badge === '' && (
          <CustomButton
            title={'Upgrade to Verified Business'}
            loading={loading}
            onPress={() => navigation.navigate('VerifyDocuments')}
            customStyle={{ marginBottom: 40, marginTop: 20 }}
            disabled={loading}
          />
        )}
      </View>
      <LocationModal
        addressData={state}
        setData={setState}
        visible={visible}
        setVisible={setVisible}
      />
    </ScreenWrapper>
  );
};

export default EditProfile;

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
});

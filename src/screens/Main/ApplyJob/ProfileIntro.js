import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import CustomPhone from '../../../components/CustomPhone';
import CustomText from '../../../components/CustomText';
import { DatePicker } from '../../../components/DatePicker';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import ScreenWrapper from '../../../components/ScreenWrapper';
import UploadImage from '../../../components/UploadImage';
import ApiRequest from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import { numberRegex } from '../../../utils/Commonfun';
import {
  imgUrl,
  regEmail,
  uploadAndGetUrl,
  validatePhone,
} from '../../../utils/constants';
import { ToastMessage } from '../../../utils/ToastMessage';

function extractPhoneNumber(number) {
  const phone = number?.replace(/\D/g, '');

  if (phone?.startsWith('974') && phone?.length === 11) {
    return phone?.slice(3);
  }
  return phone;
}

const ProfileIntro = ({ navigation, route }) => {
  const ad = route?.params?.data;

  const [ParsedJobData, setParsedJobData] = useState({});

  useEffect(() => {
    let parsedJobData = {};
    try {
      if (ad?.extra_data) {
        parsedJobData = JSON.parse(ad?.extra_data);
        setParsedJobData(parsedJobData);
      }
    } catch (e) {
      console.warn('Error parsing job_data:', e);
    }
  }, [ad]);

  const init = {
    title: '',
    desc: '',
    phone: '',
    price: '',
    maxPrice: '',
    images: [],
    emailId: '',
    otherImages: [],
  };
  const inits = {
    titleError: '',
    phoneError: '',
    descError: '',
    priceError: '',
    imagesError: '',
    emailIDError: '',
    otherImagesError: '',
  };
  const bidPrices = [10, 25, 50, '+'];
  const [state, setState] = useState(init);
  const [errors, setErrors] = useState(inits);

  const [imgLoading, setImgLoading] = useState(false);
  const [imgSingle, setImgSingle] = useState([]);
  const [imgSingle1, setImgSingle1] = useState([]);

  const [imagesSingle, setImagesSingle] = useState([]);

  const [imagesSingle1, setImagesSingle1] = useState([]);

  const [imgDouble, setImgDouble] = useState([]);
  const [imagesDouble, setImagesDouble] = useState([]);
  const [isCustom, setIsCustom] = useState(false);
  const [imgLoading1, setImgLoading1] = useState(false);
  const [imgLoading2, setImgLoading2] = useState(false);

  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState({
    sTime: false,
    eTime: false,
    sDate: false,
    eDate: false,
  });

  const handleInputChange = (field, value) => {
    if (field === 'price' || field === 'maxPrice') {
      const isNum = numberRegex.test(value);
      if (!isNum) {
        return false;
      }
    }
    setState(prevState => ({ ...prevState, [field]: value }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [`${field}Error`]: validateField(field, value),
    }));
  };

  const getImages = async (res, name) => {
    if (res?.path) {
      setImgLoading(true);
      setImgSingle([res?.path]);
      const url = await uploadAndGetUrl(res);
      if (url) {
        setImagesSingle([url]);
        setImgLoading(false);
      } else {
        setImgSingle([]);
        setImagesSingle([]);
        setImgLoading(false);
      }
    }
  };

  const getImages2 = async (res, name) => {
    if (res?.path && name === 'img') {
      setImgLoading2(true);
      setImgSingle1([res?.path]);
      const url = await uploadAndGetUrl(res);
      if (url) {
        setImagesSingle1([url]);
        setImgLoading2(false);
      } else {
        setImagesSingle1([]);
        setImgSingle1([]);
        setImgLoading2(false);
      }
    }
  };

  const handlePress = async () => {
    try {
      if (errorCheck()) {
        const dataToSend = {
          name: state.title.trim(),
          description: state.desc.trim(),
          price: state.price || 0,
          image: imagesSingle[0],
          cover: imagesSingle1[0],
          phone: '974' + state?.phone,
          email: state?.emailId,
        };

        navigation.navigate('ApplyJob', {
          data: dataToSend,
          ParsedJobData: ParsedJobData,
          profile_id: ad?.id,
        });
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const validateField = useCallback((field, value) => {
    let error = '';
    if (field === 'title') {
      if (!value || value.trim() === '') error = 'Please enter ad title';
    } else if (field === 'desc') {
      if (!value || value.trim() === '') error = 'Please enter description';
    } else if (field === 'price') {
      if (!value) error = 'Please enter price';
    } else if (field === 'phone') {
      const valid = validatePhone(value);
      if (!value) error = 'Please enter phone number';
      else if (!valid) error = 'Please enter valid phone number';
    } else if (field === 'emailId') {
      if (!value) error = `This is required`;
      else if (!regEmail.test(value)) error = 'Please enter valid email';
    }
    return error;
  }, []);

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      newErrors.titleError = validateField('title', state.title);
      if (!state.phone) {
        newErrors.phoneError = 'Please enter phone number';
      } else {
        const cleanPhone = state.phone.replace(/\D/g, '');
        if (cleanPhone.length !== 8) {
          newErrors.phoneError = 'Phone number must be 8 digits';
        } else {
          const isValid = validatePhone(state.phone);
          if (!isValid) {
            newErrors.phoneError = 'Please enter valid phone number';
          } else {
            newErrors.phoneError = '';
          }
        }
      }
      newErrors.descError = validateField('desc', state.desc);
      newErrors.imagesError =
        imgSingle.length === 0 ? 'Please select an image' : '';
      newErrors.emailIDError = validateField('emailId', state.emailId);

      newErrors.priceError = validateField('price', state.price);

      setErrors(newErrors);
      return Object.keys(newErrors).every(key => !newErrors[key]);
    };
  }, [state, validateField, imgSingle]);

  useEffect(() => {
    if (ParsedJobData) {
      const profileImageUrl = ParsedJobData?.image
        ? ParsedJobData.image.startsWith('http')
          ? ParsedJobData.image
          : imgUrl + ParsedJobData.image
        : null;
      const coverImageUrl = ParsedJobData?.cover
        ? ParsedJobData.cover.startsWith('http')
          ? ParsedJobData.cover
          : imgUrl + ParsedJobData.cover
        : null;

      if (profileImageUrl) {
        setImgSingle([profileImageUrl]);
        setImagesSingle([profileImageUrl]);
      }

      if (coverImageUrl) {
        // setImgSingle1([coverImageUrl]);
        // setImagesSingle1([coverImageUrl]);
      }

      setState({
        title: ad?.fullname || '',
        desc: ParsedJobData?.description || '',
        price: ParsedJobData?.salary || '',
        phone: extractPhoneNumber(ad?.phone) || '',
        emailId: ad?.email || '',
      });
    }
  }, [ParsedJobData, ad]);

  return (
    <>
      <ScreenWrapper
        scrollEnabled
        paddingHorizontal={20}
        statusBarColor="white"
        headerUnScrollable={() => <Header title={'Profile'} />}>
        <CustomInput
          marginTop={20}
          withLabel={'Job Profile Title'}
          value={state.title}
          onChangeText={text => handleInputChange('title', text)}
          error={errors.titleError}
        />
        <CustomInput
          withLabel={'Description'}
          multiline
          value={state.desc}
          onChangeText={text => handleInputChange('desc', text)}
          error={errors.descError}
        />

        <UploadImage
          handleChange={res => getImages(res, 'img')}
          renderButton={onPress => (
            <>
              <CustomText
                label={'Profile Picture (Max 3MB)'}
                fontFamily={fonts.semiBold}
                fontSize={14}
              />
              <TouchableOpacity
                onPress={() => {
                  if (imgLoading) {
                    return ToastMessage('Please wait...');
                  }
                  onPress();
                }}
                activeOpacity={0.6}
                style={styles.upload}>
                <CustomText
                  label={'+ Add your Profile Picture'}
                  fontFamily={fonts.semiBold}
                  fontSize={15}
                />
              </TouchableOpacity>
            </>
          )}
        />
        {errors.imagesError && imgSingle.length === 0 && (
          <CustomText
            label={errors.imagesError}
            color={colors.red}
            marginTop={-5}
            marginBottom={5}
          />
        )}

        {imagesSingle?.length > 0 && (
          <View style={styles.imgContainer}>
            {imgSingle?.map((item, index) => {
              return (
                <View style={styles.imgBox} key={index}>
                  {imgLoading && (
                    <View style={styles.loader}>
                      <ActivityIndicator size={25} color={'#fff'} />
                    </View>
                  )}
                  <TouchableOpacity
                    disabled={imgLoading}
                    style={styles.crossIcon}
                    onPress={() => {
                      setImgSingle([]);
                      setImagesSingle([]);
                    }}>
                    <Icons name={'close'} />
                  </TouchableOpacity>
                  <Image source={{ uri: item }} style={styles.img} />
                </View>
              );
            })}
          </View>
        )}

        {/* <UploadImage
          handleChange={res => getImages2(res, 'img')}
          renderButton={onPress => (
            <>
              <CustomText
                label={'Cover Image (Max 3MB)'}
                fontFamily={fonts.semiBold}
                fontSize={14}
              />
              <TouchableOpacity
                onPress={() => {
                  if (imgLoading) {
                    return ToastMessage('Please wait...');
                  }
                  onPress();
                }}
                activeOpacity={0.6}
                style={styles.upload}>
                <CustomText
                  label={'+ Add your Cover Picture'}
                  fontFamily={fonts.semiBold}
                  fontSize={15}
                />
              </TouchableOpacity>
            </>
          )}
        /> */}
        {/* {errors.imagesError1 && imgSingle1.length === 0 && (
          <CustomText
            label={errors.imagesError1}
            color={colors.red}
            marginTop={-5}
            marginBottom={5}
          />
        )} */}

        {/* {imgSingle1 && (
          <View style={styles.imgContainer}>
            {imgSingle1?.map((item, index) => {
              return (
                <View style={styles.imgBox} key={index}>
                  {imgLoading2 && (
                    <View style={styles.loader}>
                      <ActivityIndicator size={25} color={'#fff'} />
                    </View>
                  )}
                  <TouchableOpacity
                    disabled={imgLoading2}
                    style={styles.crossIcon}
                    onPress={() => {
                      setImgSingle1([]);
                      setImagesSingle1([]);
                    }}>
                    <Icons name={'close'} />
                  </TouchableOpacity>
                  <Image source={{ uri: item }} style={styles.img} />
                </View>
              );
            })}
          </View>
        )} */}

        <CustomInput
          withLabel={'Expected Salary in QAR'}
          placeholder={'QAR'}
          value={state.price}
          onChangeText={text => handleInputChange('price', text)}
          error={errors.priceError}
          keyboardType="numeric"
        />

        <CustomText
          label={'Phone Number'}
          fontFamily={fonts.semiBold}
          marginBottom={8}
        />

        <CustomPhone
          value={state.phone}
          onChangeText={text => handleInputChange('phone', text)}
          error={errors.phoneError}
        />

        <CustomInput
          withLabel={'Email id'}
          placeholder={'Enter Email'}
          value={state.emailId}
          onChangeText={text => handleInputChange('emailId', text)}
          error={errors.emailIDError}
          keyboardType="email-address"
        />

        <View style={styles.btnBox}>
          <CustomButton
            onPress={handlePress}
            title={'Next'}
            loading={loader}
            // disabled={loader || imgLoading || imgLoading1}
          />
        </View>
      </ScreenWrapper>
    </>
  );
};

export default ProfileIntro;

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 5,
    marginBottom: 15,
    flexWrap: 'wrap',
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
    marginTop: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  imgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 5,
  },

  imgBox: {
    width: '22%',
    height: 70,
    borderRadius: 10,
    margin: 10,
    backgroundColor: 'white',
    marginLeft: 0,
    marginRight: 10,
  },
  img: {
    width: '100%',
    height: 70,
    borderRadius: 10,
  },
  loader: {
    width: '100%',
    height: 70,
    borderRadius: 10,
    backgroundColor: '#0000007E',
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossIcon: {
    width: 22,
    height: 22,
    backgroundColor: '#FFFFFF99',
    elevation: 2,
    position: 'absolute',
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
    right: -5,
    top: -8,
    borderRadius: 10,
  },
  btnBox: {
    paddingVertical: 8,
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateBox: {
    flex: 1,
    marginRight: 10,
  },
  box: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: colors.lightGrey,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  box1: {
    backgroundColor: colors.lightBlue,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightBlue,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
});

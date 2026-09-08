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
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function extractPhoneNumber(number) {
  const phone = number?.replace(/\D/g, '');

  if (phone?.startsWith('974') && phone?.length === 11) {
    return phone?.slice(3);
  }
  return phone;
}

const newLocal = 'I agree biding';
const CreateAd = ({ navigation, route }) => {
  const {
    parentName,
    childName,
    grandChild,
    type,
    id,
    ad,
    job,
    grandParentName,
  } = route.params;

  

  const isJob = job?.trim() === 'yes' || ad?.job === '1';

  const init = {
    title: '',
    desc: '',
    sDate: '',
    eDate: '',
    sTime: '',
    eTime: '',
    phone: '',
    price: '',
    maxPrice: '',
    emailId: '',
    images: [],
    otherImages: [],
  };
  const inits = {
    titleError: '',
    descError: '',
    sDateError: '',
    eDateError: '',
    sTimeError: '',
    eTimeError: '',
    phoneError: '',
    priceError: '',
    maxPriceError: '',
    imagesError: '',
    emailIDError: '',
    // otherImagesError: '',
  };
  const bidPrices = [10, 25, 50, '+'];
  const [state, setState] = useState(init);
  const [errors, setErrors] = useState(inits);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgSingle, setImgSingle] = useState([]);
  const [imagesSingle, setImagesSingle] = useState([]);
  const [imgDouble, setImgDouble] = useState([]);

  const [imagesDouble, setImagesDouble] = useState([]);
  console.log(imagesDouble);

  const [isCustom, setIsCustom] = useState(false);
  const [imgLoading1, setImgLoading1] = useState(false);
  const [loader, setLoader] = useState(false);
  const [agree, setAgree] = useState(false);

  const [modal, setModal] = useState({
    sTime: false,
    eTime: false,
    sDate: false,
    eDate: false,
  });

  const handleDateTime = (e, dateTime, name) => {
    if (e?.type === 'dismissed') {
      setModal({ ...modal, [name]: false });
    } else {
      const formattedDate = moment(dateTime).format('YYYY-MM-DD');
      const formattedTime = moment(dateTime).format('HH:mm:ss');

      const newState = {
        ...state,
        [name]:
          name === 'sTime' || name === 'eTime' ? formattedTime : formattedDate,
      };
      setModal({ ...modal, [name]: false });
      setErrors(prevErrors => ({
        ...prevErrors,
        [`${name}Error`]: '',
      }));
      setState(newState);
    }
  };

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
    if (res?.path && name === 'img') {
      setImgLoading(true);
      setImgSingle([res?.path]);
      const url = await uploadAndGetUrl(res);
      if (url) {
        setImagesSingle([url]);
      } else {
        setImagesSingle([]);
        setImgSingle([]);
      }
      setImgLoading(false);
    } else {
      setImgLoading1(true);
      const newImgDouble = [...imgDouble, ...res?.map(item => item?.path)];
      setImgDouble(newImgDouble);

      const uploadPromises = res.map((image, index) => {
        return new Promise(async (resolve, reject) => {
          try {
            const url = await uploadAndGetUrl(image);
            resolve(url);
          } catch (error) {
            reject(error);
          }
        });
      });

      try {
        const uploadedImages = await Promise.all(uploadPromises);

        const validImages = uploadedImages.filter(url => url !== undefined);
        const undefinedIndices = uploadedImages
          .map((item, index) => (item === undefined ? index : -1))
          .filter(index => index !== -1);

        const updateData = newImgDouble.filter(
          (_, index) => !undefinedIndices.includes(index - imgDouble.length),
        );

        setImgDouble(updateData);
        setImagesDouble(prevImages => [
          ...prevImages,
          ...validImages.map(img => imgUrl + img),
        ]);
        setImgLoading(false);
      } catch (error) {
        console.error('Error uploading images:', error);
        setImgLoading(false);
      } finally {
        setImgLoading(false);
        setImgLoading1(false);
      }
    }
  };

  const handleRemoveImg = index => {
    setImgDouble(prevImages => prevImages.filter((_, i) => i !== index));
    setImagesDouble(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const onGetFields = async () => {
    try {
      const dataToGet = {
        type: 'get_custom_fields',
        cat_id: id || ad?.cat_id,
      };
      const response = await ApiRequest(dataToGet);
      setLoader(false);
      if (response.data?.custom) {
        return response.data?.custom;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error, 'err in getting custom fields');
      setLoader(false);
    }
  };

  const handleIncrement = item => {
    if (item === '+') {
      setIsCustom(true);
      handleInputChange('maxPrice', '');
      setErrors({ ...errors, maxPriceError: '' });
    } else {
      handleInputChange('maxPrice', String(item));
      setIsCustom(false);
    }
  };

  const handlePress = async () => {
    if (type?.type === 'auction' && !agree) {
      ToastMessage('Please agree to the terms and conditions');
      return;
    }

    try {
      if (errorCheck()) {
        const dataToSend = {
          name: state.title.trim(),
          description: state.desc.trim(),
          price: state.price || 0,
          images: imagesSingle[0],
          other_images: JSON.stringify(imagesDouble),
          cat_id: id || ad?.cat_id,
          item_type: type?.type || ad?.item_type,
          phone: '974' + state?.phone,
          email: state?.emailId,
        };
        if (type?.type === 'auction') {
          dataToSend.start_date = state.sDate;
          dataToSend.end_date = state.eDate;
          dataToSend.start_time = state.sTime;
          dataToSend.end_Time = state.eTime;
          dataToSend.price_max = state.maxPrice;
        }

        if (isJob) {
          dataToSend.job = 1;
        }

        setLoader(true);
        const fields = await onGetFields();

        if (fields?.length === 0) {
          navigation.navigate('AdsLocation', {
            data: dataToSend,
            customField: '',
            ad,
          });
        } else {
          navigation.navigate('CustomFields', {
            data: dataToSend,
            fields,
            ad,
          });
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const validateField = useCallback(
    (field, value) => {
      let error = '';
      if (field === 'title') {
        if (!value || value.trim() === '') error = 'Please enter ad title';
      } else if (field === 'desc') {
        if (!value || value.trim() === '') error = 'Please enter description';
      } else if (field === 'price') {
        if (!isJob && !value) error = 'Please enter price';
      } else if (field === 'phone') {
        const valid = validatePhone(value);
        if (!value) error = 'Please enter phone number';
        else if (!valid) error = 'Please enter valid phone number';
      } else if (field === 'emailId') {
        if (!value) error = `This is required`;
        else if (!regEmail.test(value)) error = 'Please enter valid email';
      } else if (
        field === 'sDate' ||
        field === 'eDate' ||
        field === 'sTime' ||
        field === 'eTime' ||
        field === 'maxPrice'
      ) {
        if (!value) error = `This is required`;
      }
      return error;
    },
    [isJob],
  );

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      newErrors.titleError = validateField('title', state.title);
      newErrors.descError = validateField('desc', state.desc);
      newErrors.phoneError = validateField('phone', state.phone);
      if (isJob) {
        newErrors.emailIDError = validateField('emailId', state.emailId);
      }
      newErrors.imagesError =
        imgSingle.length === 0 ? 'Please select an image' : '';

      if (!isJob) {
        newErrors.priceError = validateField('price', state.price);
      }

      if (type?.type === 'auction') {
        newErrors.sDateError = validateField('sDate', state.sDate);
        newErrors.eDateError = validateField('eDate', state.eDate);
        newErrors.sTimeError = validateField('sTime', state.sTime);
        newErrors.eTimeError = validateField('eTime', state.eTime);
        newErrors.maxPriceError = validateField('maxPrice', state.maxPrice);
      }
      setErrors(newErrors);
      return Object.keys(newErrors).every(key => !newErrors[key]);
    };
  }, [state, type, validateField, imgSingle, isJob]);

  useEffect(() => {
    if (ad) {
      const otherImgs = ad?.other_images ? JSON.parse(ad?.other_images) : [];

      const otherImages = otherImgs.map(item => item);

      setImagesSingle([ad?.images]);
      setImagesDouble(otherImages);
      setImgSingle([ad?.image]);
      setImgDouble(otherImages);

      const eDate = moment(ad?.end_date, 'MMM DD, YYYY').format('YYYY-MM-DD');
      const sDate = moment(ad?.start_date, 'MMM DD, YYYY').format('YYYY-MM-DD');

      setState({
        desc: ad?.description,
        eDate: eDate,
        eTime: ad?.end_time,
        images: [ad?.images],
        otherImages: JSON.parse(ad?.other_images),
        maxPrice: ad?.price_max,
        price: ad?.price,
        sDate: sDate,
        sTime: ad?.start_time,
        title: ad?.name,
        phone: extractPhoneNumber(ad?.phone) || '',
      });
    }
  }, [ad]);

  const handleDragEnd = ({ data }) => {
    const newImgDouble = [...data];

    // Reorder imagesDouble based on the new imgDouble order
    const reorderedImagesDouble = [];

    newImgDouble.forEach(draggedPath => {
      // Find the original index of this path in imgDouble
      const originalIndex = imgDouble.findIndex(path => path === draggedPath);
      if (originalIndex !== -1 && imagesDouble[originalIndex]) {
        reorderedImagesDouble.push(imagesDouble[originalIndex]);
      }
    });

    setTimeout(() => {
      setImgDouble(newImgDouble);
      setImagesDouble(reorderedImagesDouble);
    }, 100);
  };
  const getImageDimensions = uri => {
    return new Promise(resolve => {
      Image.getSize(
        uri,
        (width, height) => {
          const aspectRatio = width / height;
          const fixedHeight = 250;
          const calculatedWidth = fixedHeight * aspectRatio;
          resolve({ width: calculatedWidth, height: fixedHeight });
        },
        error => {
          console.log('Error getting image size:', error);
          resolve({ width: 200, height: 250 }); // fallback dimensions
        },
      );
    });
  };

  const DynamicImageItem = ({ item, drag, isActive, getIndex }) => {
    const [imageDimensions, setImageDimensions] = useState({
      width: 200,
      height: 250,
    });
    const index = getIndex() || 0;

    useEffect(() => {
      getImageDimensions(item).then(setImageDimensions);
    }, [item]);

    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          delayLongPress={150}
          disabled={isActive || imgLoading1}
          style={[
            {
              height: 230,
              width: imageDimensions.width,
              borderRadius: 10,
              margin: 10,
              backgroundColor: 'white',
              marginLeft: 0,
              marginRight: 10,
            },
            {
              opacity: isActive ? 0.5 : 1,
              elevation: isActive ? 5 : 0,
              zIndex: isActive ? 999 : 1,
            },
          ]}
          activeOpacity={1}>
          {imgLoading1 && (
            <View style={styles.loader}>
              <ActivityIndicator size={25} color={'#fff'} />
            </View>
          )}

          <TouchableOpacity
            disabled={imgLoading1}
            style={styles.crossIcon}
            onPress={() => handleRemoveImg(index)}>
            <Icons name={'close'} size={20} color={'black'} />
          </TouchableOpacity>

          <Image
            source={{ uri: item }}
            style={{
              width: imageDimensions.width,
              height: 230,
              borderRadius: 10,
            }}
            resizeMode="cover" // or "contain" based on your preference
            key={`img-${item}-${index}`}
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  

  return (
    <>
      <ScreenWrapper
        scrollEnabled
        paddingHorizontal={20}
        statusBarColor="white"
        headerUnScrollable={() => <Header title={'Ad Details'} />}>
        {ad ? (
          <CustomText
            label={`Update your ad`}
            fontFamily={fonts.bold}
            fontSize={16}
            marginTop={20}
            marginBottom={10}
          />
        ) : (
          <CustomText
            label={`Your${"'"}e almost there!`}
            fontFamily={fonts.bold}
            fontSize={16}
            marginTop={20}
          />
        )}
        {!ad && (
          <View style={styles.head}>
            <CustomText
              label={grandParentName}
              fontFamily={fonts.regular}
              fontSize={13}
              color={'#2F0D4F'}
            />
            <Icons
              family={'Entypo'}
              name={'chevron-small-right'}
              size={12}
              color={'#2F0D4F'}
            />
            <CustomText
              label={parentName}
              fontFamily={fonts.regular}
              fontSize={13}
              color={'#2F0D4F'}
            />
            <Icons
              family={'Entypo'}
              name={'chevron-small-right'}
              size={12}
              color={'#2F0D4F'}
            />
            <CustomText
              label={childName}
              fontFamily={fonts.regular}
              fontSize={12}
              color={'#2F0D4F'}
            />
            {grandChild && (
              <>
                <Icons
                  family={'Entypo'}
                  name={'chevron-small-right'}
                  size={12}
                  color={'#2F0D4F'}
                />
                <CustomText
                  label={grandChild}
                  fontFamily={fonts.regular}
                  fontSize={11}
                  color={'#2F0D4F'}
                />
              </>
            )}
          </View>
        )}
        <CustomInput
          withLabel={isJob ? 'Job Title*' : 'Ad Title*'}
          placeholder={'Enter title'}
          value={state.title}
          onChangeText={text => handleInputChange('title', text)}
          error={errors.titleError}
        />
        <CustomInput
          withLabel={'Description*'}
          placeholder={'Enter description'}
          multiline
          value={state.desc}
          onChangeText={text => handleInputChange('desc', text)}
          error={errors.descError}
        />
        {type?.type === 'auction' && (
          <View>
            <CustomText
              label={'Start Date and Time*'}
              fontFamily={fonts.semiBold}
              marginBottom={8}
            />
            <View style={styles.dateContainer}>
              <View style={styles.dateBox}>
                <DatePicker
                  show={modal.sDate}
                  date={state.sDate}
                  showDatepicker={() => setModal({ ...modal, sDate: true })}
                  onChange={(e, time) => handleDateTime(e, time, 'sDate')}
                  error={errors.sDateError}
                />
              </View>
              <View style={[styles.dateBox, { marginRight: 0 }]}>
                <DatePicker
                  show={modal.sTime}
                  isTime
                  date={state.sTime}
                  showDatepicker={() => setModal({ ...modal, sTime: true })}
                  onChange={(e, time) => handleDateTime(e, time, 'sTime')}
                  error={errors.sTimeError}
                />
              </View>
            </View>
            <CustomText
              label={'End Date and Time*'}
              fontFamily={fonts.semiBold}
              marginBottom={8}
            />
            <View style={styles.dateContainer}>
              <View style={[styles.dateBox]}>
                <DatePicker
                  show={modal.eDate}
                  date={state.eDate}
                  showDatepicker={() => setModal({ ...modal, eDate: true })}
                  onChange={(e, time) => handleDateTime(e, time, 'eDate')}
                  error={errors.eDateError}
                />
              </View>
              <View style={[styles.dateBox, { marginRight: 0 }]}>
                <DatePicker
                  show={modal.eTime}
                  isTime
                  date={state.eTime}
                  showDatepicker={() => setModal({ ...modal, eTime: true })}
                  onChange={(e, time) => handleDateTime(e, time, 'eTime')}
                  error={errors.eTimeError}
                />
              </View>
            </View>
          </View>
        )}
        {imgSingle?.length === 0 && (
          <UploadImage
            handleChange={res => getImages(res, 'img')}
            renderButton={onPress => (
              <>
                <CustomText
                  label={'Main Pictures (Max 3MB)*'}
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
                    label={'Add Main Picture'}
                    fontFamily={fonts.semiBold}
                    fontSize={15}
                  />
                </TouchableOpacity>
              </>
            )}
          />
        )}
        {errors.imagesError && imgSingle.length === 0 && (
          <CustomText
            label={errors.imagesError}
            color={colors.red}
            marginTop={-5}
            marginBottom={5}
          />
        )}
        {imgSingle && (
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

        {!isJob && (
          <>
            <UploadImage
              multiple
              handleChange={res => {
                Array.isArray(res) ? getImages(res) : getImages([res]);
              }}
              renderButton={onPress => (
                <>
                  <CustomText
                    label={'Other Pictures'}
                    fontFamily={fonts.semiBold}
                    fontSize={14}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (imgLoading1) {
                        return ToastMessage('Please wait...');
                      }
                      onPress();
                    }}
                    activeOpacity={0.6}
                    style={styles.upload}>
                    <CustomText
                      label={'Add Other Pictures'}
                      fontFamily={fonts.semiBold}
                      fontSize={15}
                    />
                  </TouchableOpacity>
                </>
              )}
            />

            {imgDouble && imgDouble.length > 0 && (
              <>
                <CustomText
                  label={'Hold to Re Arrange'}
                  color={colors.primaryColor}
                />
                <View>
                  <DraggableFlatList
                    horizontal
                    data={imgDouble}
                    onDragEnd={handleDragEnd}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) =>
                      `draggable-item-${item}-${index}`
                    }
                    renderItem={({ item, drag, isActive, getIndex }) => {
                      return (
                        <DynamicImageItem
                          item={item}
                          drag={drag}
                          isActive={isActive}
                          getIndex={getIndex}
                          imgLoading1={imgLoading1}
                          handleRemoveImg={handleRemoveImg}
                        />
                      );
                    }}
                    activationDistance={20}
                    containerStyle={{ flex: 1 }}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    // Add these props to ensure proper re-rendering
                    extraData={imgDouble.length} // This will trigger re-render when data changes
                    removeClippedSubviews={false} // Prevent views from being removed
                  />
                </View>
              </>
            )}
          </>
        )}

        <CustomInput
          withLabel={isJob ? 'Salary' : 'Price*'}
          placeholder={isJob ? 'Enter Salary' : 'Enter Price'}
          value={state.price}
          onChangeText={text => handleInputChange('price', text)}
          error={errors.priceError}
          keyboardType="numeric"
        />
        {type?.type === 'auction' && (
          <>
            <CustomText
              label={'Increment Price'}
              fontFamily={fonts.semiBold}
              marginBottom={8}
            />
            <View style={styles.row}>
              {bidPrices.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    state.maxPrice === String(item) ? styles.box1 : styles.box,
                  ]}
                  onPress={() => handleIncrement(item)}>
                  {item === '+' ? (
                    <Icons name={'add'} />
                  ) : (
                    <CustomText
                      label={item + ' ' + 'QAR'}
                      fontFamily={fonts.semiBold}
                      color={
                        state.maxPrice === String(item)
                          ? colors.white
                          : colors.black
                      }
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {isCustom && (
              <CustomInput
                placeholder={'Enter increment price'}
                value={state.maxPrice}
                onChangeText={text => handleInputChange('maxPrice', text)}
                keyboardType="numeric"
              />
            )}
            {errors.maxPriceError && (
              <CustomText
                label={errors.maxPriceError}
                color={colors.red}
                marginBottom={10}
                marginTop={-10}
              />
            )}
          </>
        )}
        <CustomText
          label={'Phone Number*'}
          fontFamily={fonts.semiBold}
          marginBottom={8}
        />

        <CustomPhone
          value={state.phone}
          onChangeText={text => handleInputChange('phone', text)}
          error={errors.phoneError}
        />
        {isJob && (
          <CustomInput
            withLabel={'Email id'}
            placeholder={'Enter Email'}
            value={state.emailId}
            onChangeText={text => handleInputChange('emailId', text)}
            error={errors.emailIDError}
            keyboardType="email-address"
          />
        )}

        {type?.type === 'auction' && (
          <>
            <TouchableOpacity
              onPress={() => setAgree(!agree)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={() => setAgree(!agree)}
                style={styles.checkBox}>
                {agree && <Icons name={'check'} family={'Feather'} />}
              </TouchableOpacity>

              <CustomText label={newLocal} fontFamily={fonts.medium} />
              <TouchableOpacity
                onPress={() => navigation.navigate('Terms', { termId: 4 })}>
                <CustomText
                  label={' terms and condition'}
                  fontFamily={fonts.bold}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.btnBox}>
          <CustomButton
            onPress={handlePress}
            title={'Next'}
            loading={loader}
            disabled={loader || imgLoading || imgLoading1}
          />
        </View>
      </ScreenWrapper>
    </>
  );
};

export default CreateAd;

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
  imgBox1: {
    height: 250,
    borderRadius: 10,
    margin: 10,
    backgroundColor: 'white',
    marginLeft: 0,
    marginRight: 10,
  },
  imgOther: {
    height: 250,
    resizeMode: 'contain', // very important to preserve aspect ratio
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
  img: {
    width: '100%',
    height: 70,
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

  checkBox: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 4,
    marginRight: 10,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imgContainer: {
    // Add any container styles you need
  },
  imgBox: {
    width: 70, // Changed from '22%' to fixed width for horizontal scrolling
    height: 70,
    borderRadius: 10,
    margin: 10,
    backgroundColor: 'white',
    marginLeft: 0,
    marginRight: 10,
  },

  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    zIndex: 1,
  },
  crossIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 2,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

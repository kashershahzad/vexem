/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { pick } from '@react-native-documents/picker';

import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import CustomText from '../../../components/CustomText';
import { DatePicker } from '../../../components/DatePicker';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import ScreenWrapper from '../../../components/ScreenWrapper';
import UploadImage from '../../../components/UploadImage';
import ApiRequest from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import { numberRegex } from '../../../utils/Commonfun';
import { imgUrl, uploadAndGetUrl } from '../../../utils/constants';
import { ToastMessage } from '../../../utils/ToastMessage';
import CustomDropdown from '../../../components/CustomDropDown';
import MutileDropDown from '../../../components/MutileDropDown';
import DropDownWithSearch from '../../../components/DropDownWithSearch';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

const CreateOfferAd = ({ navigation }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const { params } = useRoute();
  const ad = params?.ad;
  

  const [fileLoader, setFileLoader] = useState(false);

  const { loginUser, token } = useSelector(store => store.user);
  const init = {
    title: '',
    desc: '',
    sDate: '',
    eDate: '',
    sTime: '',
    eTime: '',
    price: '',
    link: '',
    category: '',
    images: [],
    otherImages: [],
    brochure: '',
  };
  const inits = {
    titleError: '',
    descError: '',
    sDateError: '',
    eDateError: '',
    sTimeError: '',
    eTimeError: '',
    priceError: '',
    linkError: '',
    imagesError: '',
    otherImagesError: '',
    categoryError: '',
    brochureError: '',
  };
  const [state, setState] = useState(init);

  const [errors, setErrors] = useState(inits);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgLoading1, setImgLoading1] = useState(false);
  const [imgSingle, setImgSingle] = useState([]);
  const [imagesSingle, setImagesSingle] = useState([]);
  const [imgDouble, setImgDouble] = useState([]);

  const [imagesDouble, setImagesDouble] = useState([]);

  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState({
    sDate: false,
    eDate: false,
    sTime: false,
    eTime: false,
  });

  const [OfferCategires, setOfferCategires] = useState([]);

  const [StoreLocation, setStoreLocation] = useState(['all Branches']);

  const handleRemoveImg = indexToRemove => {
    setImgDouble(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagesDouble(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const fetchAds = async () => {
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'offer_categories',
      };

      const response = await ApiRequest(dataToGet);
      if (response.data.data) {
        const categoryOptions = response.data.data.map(item => ({
          title: item.name,
          _id: item.id,
        }));
        setOfferCategires(categoryOptions);
      }
    } catch (error) {
      console.log(error, 'errr in getting store ads');
    }
  };

  const fetchStoreLocation = async () => {
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'store_locations',
        limit: 100,
        store_id: loginUser?.store_id,
      };

      const response = await ApiRequest(dataToGet);
      if (response.data.data) {
        const categoryOptions = response.data.data.map(item => ({
          title: item.address,
          _id: item.address,
        }));

        const allBranchesOption = {
          title: 'All Branch',
          _id: 'all Branch',
        };
        const updatedCategoryOptions = [allBranchesOption, ...categoryOptions];

        setStoreLocation(updatedCategoryOptions);
      }
    } catch (error) {
      console.log(error, 'errr in getting store ads');
    }
  };

  useEffect(() => {
    fetchAds();
    fetchStoreLocation();
  }, []);

  

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
    if (field === 'price') {
      const isNum = numberRegex.test(value);
      if (!isNum) {
        return false;
      }
    }
    setState(prevState => ({ ...prevState, [field]: value }));
    if (field !== 'link' && field !== 'price') {
      setErrors(prevErrors => ({
        ...prevErrors,
        [`${field}Error`]: validateField(field, value),
      }));
    }
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

  const handlePress = async () => {
    try {
      if (errorCheck()) {
        setLoader(true);
        const dataToSend = {
          type: ad ? 'update_data' : 'add_data',
          table_name: 'items',
          item_type: 'offer',
          name: state.title.trim(),
          description: state.desc.trim(),
          price: state.price,
          images: imagesSingle[0],
          other_images: JSON.stringify(imagesDouble),
          start_date: state.sDate,
          end_date: state.eDate,
          offer_link: state.link?.trim(),
          store_id: loginUser?.store_id,
          user_id: token,
          lat: loginUser.lat,
          lng: loginUser.lng,
          store_cat_id: state?.category,
          store_locations: JSON.stringify(selectedItems),
          pdf_file: state?.brochure,
          start_time: state.sTime,
          end_Time: state.eTime,
        };

        if (ad) {
          dataToSend.id = ad?.id;
        }

        setLoader(true);

        const response = await ApiRequest(dataToSend);
        setLoader(false);
        if (response.data?.result) {
          if (ad) {
            navigation.navigate('Home');
          } else {
            navigation.navigate('SuccessScreen');
          }
        } else {
          setLoader(false);
          ToastMessage('Something went wrong');
        }
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
    } else if (field === 'link') {
      if (!value || value.trim() === '') error = 'Please enter url';
    } else if (field === 'category') {
      if (!value) error = 'Please Select Category';
    } else if (field === 'sDate' || field === 'eDate') {
      if (!value) error = `This is required`;
    }
    return error;
  }, []);

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      newErrors.titleError = validateField('title', state.title);
      newErrors.descError = validateField('desc', state.desc);
      newErrors.sDateError = validateField('sDate', state.sDate);
      newErrors.eDateError = validateField('eDate', state.eDate);
      newErrors.categoryError = validateField('category', state.category);
      newErrors.imagesError =
        imgSingle?.length === 0 ? 'Please select image' : '';
      setErrors(newErrors);
      return Object.keys(newErrors).every(key => !newErrors[key]);
    };
  }, [state, validateField]);

  useEffect(() => {
    if (ad) {
      const otherImgs = ad?.other_images ? JSON.parse(ad?.other_images) : [];

      const otherImages = otherImgs.map(item => item);
      const eDate = moment(ad?.end_date, 'MMM DD, YYYY').format('YYYY-MM-DD');
      const sDate = moment(ad?.start_date, 'MMM DD, YYYY').format('YYYY-MM-DD');
      setImagesSingle([ad?.images]);
      setImagesDouble(otherImgs);
      setImgSingle([ad?.image]);
      setImgDouble(otherImages);
      setState({
        desc: ad?.description,
        eDate: eDate,
        images: [ad?.images],
        otherImages: JSON.parse(ad?.other_images),
        price: ad?.price,
        sDate: ad?.start_date,
        title: ad?.name,
        link: ad?.offer_link,
        category:  OfferCategires.find(cat => cat._id === ad?.store_cat_id) || null,
        brochure: ad?.pdf_file,
        sDate: sDate,
        sTime: ad?.start_time,
        eTime: ad?.end_time
      });
      setStoreLocation(
        ad?.store_locations ? JSON.parse(ad?.store_locations) : [],
      );

      console.log( OfferCategires.find(cat => cat._id === ad?.store_cat_id) || null,)

    }

    
  }, [ad, OfferCategires]);

  const onPicker = async () => {
    setFileLoader(true);

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

      const body = new FormData();
      body.append('type', 'upload_data');
      body.append('file', file);
      const response = await ApiRequest(body);
      if (response.data?.file_path) {
        setState({ ...state, brochure: response.data?.file_name });
        setErrors({ ...errors, brochureError: '' });
        setTimeout(() => {
          setFileLoader(false);
        }, 1000);
      } else {
        setState({ ...state, brochure: '' });
        ToastMessage('Upload again');
        setFileLoader(false);
      }
    } catch (err) {
      console.log(err);
      setFileLoader(false);
    }
  };

  const HanderRemovePdf = () => {
    setState(prevState => ({
      ...prevState,
      brochure: '', // clear the resume
    }));
  };

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
              height: 250,
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
              height: 250,
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
        <CustomText
          label={ad ? 'Update your ad' : `Your${"'"}e almost there!`}
          fontFamily={fonts.bold}
          fontSize={16}
          marginTop={20}
          marginBottom={20}
        />

        <CustomInput
          withLabel={'Ad Title'}
          placeholder={'Enter title'}
          value={state.title}
          onChangeText={text => handleInputChange('title', text)}
          error={errors.titleError}
        />
        <CustomInput
          withLabel={'Description'}
          placeholder={'Enter description'}
          multiline
          value={state.desc}
          onChangeText={text => handleInputChange('desc', text)}
          error={errors.descError}
        />

        <View style={styles.dateContainer}>
          <View style={styles.dateBox}>
            <CustomText
              label={'Start date'}
              fontFamily={fonts.semiBold}
              marginBottom={8}
            />
            <DatePicker
              show={modal.sDate}
              date={state.sDate}
              showDatepicker={() => setModal({ ...modal, sDate: true })}
              onChange={(e, time) => handleDateTime(e, time, 'sDate')}
              error={errors.sDateError}
            />
          </View>
          <View style={[styles.dateBox, { marginRight: 0 }]}>
            <CustomText
              label={'End date'}
              fontFamily={fonts.semiBold}
              marginBottom={8}
            />
            <DatePicker
              show={modal.eDate}
              date={state.eDate}
              showDatepicker={() => setModal({ ...modal, eDate: true })}
              onChange={(e, time) => handleDateTime(e, time, 'eDate')}
              error={errors.eDateError}
            />
          </View>
        </View>

        <View style={styles.dateContainer}>
          <View style={styles.dateBox}>
            <CustomText
              label={'Start Time'}
              fontFamily={fonts.semiBold}
              marginBottom={8}
            />
            <DatePicker
              show={modal.sTime}
              date={state.sTime}
              isTime
              showDatepicker={() => setModal({ ...modal, sTime: true })}
              onChange={(e, time) => handleDateTime(e, time, 'sTime')}
              error={errors.sTimeError}
            />
          </View>
          <View style={[styles.dateBox, { marginRight: 0 }]}>
            <CustomText
              label={'End Time'}
              fontFamily={fonts.semiBold}
              marginBottom={8}
            />
            <DatePicker
              show={modal.eTime}
              date={state.eTime}
              isTime
              showDatepicker={() => setModal({ ...modal, eTime: true })}
              onChange={(e, time) => handleDateTime(e, time, 'eTime')}
              error={errors.eTimeError}
            />
          </View>
        </View>
        <CustomText
          label={'Select Category'}
          marginBottom={8}
          fontFamily={fonts.semiBold}
        />
        <DropDownWithSearch
          data={OfferCategires}
          placeholder={'Select Category'}
          value={state.category}
          setValue={e => handleInputChange('category', e)}
        />

        {errors.categoryError && (
          <CustomText
            label={errors.categoryError}
            color={colors.red}
            marginBottom={10}
            marginTop={-10}
          />
        )}

        <CustomText
          label={'Select Store Locations'}
          marginBottom={8}
          fontFamily={fonts.semiBold}
        />

        <MutileDropDown
          data={StoreLocation}
          placeholder="All branch"
          value={selectedItems}
          setValue={setSelectedItems}
        />

        {imgSingle?.length === 0 && (
          <UploadImage
            handleChange={res => getImages(res, 'img')}
            renderButton={onPress => (
              <>
                <CustomText
                  label={'Main Pictures (Max 3MB)'}
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
          <CustomText label={errors.imagesError} color={colors.red} />
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
                      setImagesSingle([]);
                      setImgSingle([]);
                    }}>
                    <Icons name={'close'} />
                  </TouchableOpacity>
                  <Image source={{ uri: item }} style={styles.img} />
                </View>
              );
            })}
          </View>
        )}
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
        {errors.otherImagesError && state.otherImages.length === 0 && (
          <CustomText label={errors.otherImagesError} color={colors.red} />
        )}
        {imgDouble && imgDouble.length > 0 && (
          <>
            <CustomText
              label={'Hold to Re Arrange'}
              color={colors.primaryColor}
            />
              <DraggableFlatList
                horizontal
                data={imgDouble}
                showsHorizontalScrollIndicator={false}
                onDragEnd={handleDragEnd}
                keyExtractor={(item, index) =>
                  `draggable-item-${item}-${index}`
                } // Make key more unique
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
                extraData={imgDouble.length}
                removeClippedSubviews={false}
              />
          </>
        )}

        <TouchableOpacity
          onPress={onPicker}
          activeOpacity={0.6}
          style={styles.upload}>
          <Icons name={'add'} top={1} left={-5} />
          <CustomText label={'Upload Pdf Brochure'} />
        </TouchableOpacity>
        <View>
          {fileLoader ? (
            <View style={styles.loader2}>
              <ActivityIndicator size={24} color={colors.primaryColor} />
            </View>
          ) : (
            <>
              {state.brochure && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                  }}>
                  <CustomText
                    label={state.brochure}
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
          label={errors.brochureError}
          color={colors.red}
          marginBottom={20}
        />

        <CustomInput
          withLabel={'Price'}
          placeholder={'Enter price'}
          value={state.price}
          onChangeText={text => handleInputChange('price', text)}
          error={errors.priceError}
          keyboardType="numeric"
        />
        <CustomInput
          withLabel={'Offer Link'}
          placeholder={'Enter link'}
          value={state.link}
          onChangeText={text => handleInputChange('link', text)}
          error={errors.linkError}
          keyboardType="url"
        />
        <View style={styles.btnBox}>
          <CustomButton
            onPress={handlePress}
            title={ad ? 'Update Ad' : 'Create Ad'}
            loading={loader}
            disabled={loader}
          />
        </View>
      </ScreenWrapper>
    </>
  );
};

export default CreateOfferAd;

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 5,
    marginBottom: 15,
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
    marginRight: 20,
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
    marginBottom: 20,
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

  imgContainer: {
    // Add any container styles you need
  },

  img: {
    width: '100%',
    height: 70,
    borderRadius: 10,
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

  loader2: {
    width: '100%',
    height: 70,
    borderRadius: 10,
    backgroundColor: '#0000007E',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

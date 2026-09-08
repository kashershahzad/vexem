import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import CustomDropdown from '../../../components/CustomDropDown';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import ScreenWrapper from '../../../components/ScreenWrapper';
import { colors } from '../../../utils/colors';

const JobInfo = ({ navigation, route }) => {
  const init = {
    title: '',
    description: '',
    price: '',
    addtional: '',
    phone: '',
    // inc: ''
  };
  const [state, setState] = useState(init);
  const [img, setImg] = useState([]);
  const [images, setImages] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [value, setvalue] = useState('');

  const incriment = [
    {
      lable: '10 QAR',
    },
    { lable: '50 QAR' },
    { lable: '100 QAR' },
    { lable: '500 QAR' },
  ];

  const getImagesothers = async res => {};
  const handleServiceChange = value => {
    setvalue(value);
  };

  const getImages = async res => {
    setLoading(true);
    if (res?.path) {
      setImg([...img, res?.path]);
      // const url = await uploadAndGetUrl(res);
      setImages(prevImages => [...prevImages, res?.path]);
      setLoading(false);
    } else {
      setImg([...img, ...res?.map(item => item?.path)]);
      const uploadPromises = res.map(image => {
        return new Promise(async (resolve, reject) => {
          try {
            //   const url = await uploadAndGetUrl(image);
            //   resolve(url);
          } catch (error) {
            //   reject(error)/;
            setLoading(false);
          }
        });
      });
      try {
        const uploadedImages = await Promise.all(uploadPromises);
        setImages(prevImages => [...prevImages, ...uploadedImages]);
        setLoading(false);
      } catch (error) {
        console.error('Error uploading images:', error);
        setLoading(false);
      }
    }
  };

  const [errors, setErrors] = useState({
    titleError: '',
    priceToError: '',
    priceError: '',
    descriptionError: '',
    discountError: '',
  });

  const array = [
    {
      id: 1,
      placeholder: 'Select Gender',
      label: 'Gender',
      value: state.title,
      onChange: text => setState({ ...state, title: text }),
      error: errors.titleError,
    },
    {
      id: 2,
      placeholder: 'Select Nationality',
      label: 'Nationality',
      value: state.title,
      onChange: text => setState({ ...state, title: text }),
      error: errors.titleError,
    },
    {
      id: 3,
      placeholder: 'Select salary rang',
      label: 'Salary',
      value: state.title,
      onChange: text => setState({ ...state, title: text }),
      error: errors.titleError,
    },
    {
      id: 4,
      placeholder: 'Full Time',
      label: 'Commitment',
      value: state.title,
      onChange: text => setState({ ...state, title: text }),
      error: errors.titleError,
    },
    {
      id: 5,
      placeholder: 'Bachelors',
      label: 'Degree',
      value: state.title,
      onChange: text => setState({ ...state, title: text }),
      error: errors.titleError,
    },
    {
      id: 6,
      placeholder: '50 - 100',
      label: 'Company Size',
      value: state.title,
      onChange: text => setState({ ...state, title: text }),
      error: errors.titleError,
    },
  ];

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      //   if (!state.title) newErrors.titleError = 'Please enter title';
      //   if (!state.price) newErrors.priceError = 'Please enter price';
      //   if (!state.description)
      //     newErrors.descriptionError = 'Please enter description';
      //   if (!state.phone) newErrors.phone = 'Please enter phone';
      //   if (!images?.length) newErrors.imageError = 'Please select image';
      //   if (!address) newErrors.addressError = "Please select address";
      setErrors(newErrors);
    };
  }, [state, images]);
  //   , address;
  useEffect(() => {
    errorCheck();
  }, [errorCheck]);

  return (
    <>
      <ScreenWrapper
        scrollEnabled
        paddingHorizontal={12}
        statusBarColor="white"
        headerUnScrollable={() => <Header title={'Ad Details'} />}
        footerUnScrollable={() => (
          <View
            style={{
              paddingHorizontal: 12,
              backgroundColor: colors.white,
              padding: 8,
            }}>
            <CustomButton
              onPress={() => navigation.navigate('Sucess')}
              title={'Next'}
            />
          </View>
        )}>
        <CustomText
          label={`Your${"'"}e almost there!`}
          fontFamily={fonts.bold}
          fontSize={16}
          marginTop={20}
        />

        <View style={styles.head}>
          <CustomText
            label={'HR/Admin'}
            fontFamily={fonts.regular}
            fontSize={12}
            color={'#2F0D4F'}
          />
          <Icons
            family={'Entypo'}
            name={'chevron-small-right'}
            size={12}
            color={'#2F0D4F'}
          />
          <CustomText
            label={'Human Resource Executive'}
            fontFamily={fonts.regular}
            fontSize={12}
            color={'#2F0D4F'}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          {array.map(item => {
            switch (item.id) {
              default:
                return (
                  <View key={item.id}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        marginBottom: 5,
                        marginTop: 10,
                      }}>
                      <CustomText
                        label={item?.label}
                        fontFamily={fonts.semiBold}
                        // marginBottom={10}
                      />
                    </View>
                    <CustomDropdown
                      placeholder={item?.placeholder}
                      data={['Demo1', 'Demo2', 'Demo3']}
                      value={value}
                      setValue={handleServiceChange}
                    />
                  </View>
                );
            }
          })}
        </View>
      </ScreenWrapper>
    </>
  );
};

export default JobInfo;

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 5,
  },
  main_map: {
    backgroundColor: colors.white,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomColor: colors?.mainBg,
    borderBottomWidth: 2,
    // marginTop: 20,
  },

  icn: {
    backgroundColor: colors.mainBg,
    width: 32,
    height: 32,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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

  upload_container: {
    height: 150,
    width: '100%',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  uplodedImges: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },

  imgContainer: {
    width: '22%',
    height: 75,
    borderRadius: 10,
    overflow: 'hidden',
    margin: 5,
    elevation: 5,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  deleteContainer: {
    width: 22,
    height: 22,
    backgroundColor: '#FFFFFF99',
    elevation: 2,
    position: 'absolute',
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
    right: 5,
    top: 5,
    borderRadius: 8,
  },
  inc: {
    backgroundColor: colors.white,
    height: 50,
    width: '22%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
});

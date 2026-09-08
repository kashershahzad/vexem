/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { pick } from '@react-native-documents/picker';

import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import CustomDropdown from '../../../components/CustomDropDown';
import CustomInput from '../../../components/CustomInput';
import CustomText from '../../../components/CustomText';
import EmptyComponent from '../../../components/EmptyComponent';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import ImageFastWrapper from '../../../components/ImageFast';
import ScreenWrapper from '../../../components/ScreenWrapper';
import { colors } from '../../../utils/colors';
import { imgUrl, uploadAndGetUrl } from '../../../utils/constants';

const CustomFields = ({ navigation, route }) => {
  const { data, fields, ad } = route.params;

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(
    fields.reduce((acc, field) => {
      if (field.type === 'checkbox') {
        acc[field.name] = [];
      } else {
        acc[field.name] = '';
      }
      return acc;
    }, {}),
  );

  const handlePress = () => {
    if (validateForm()) {
      try {
        let resultArray = [];

        if (fields?.length > 0) {
          resultArray = fields.map(field => ({
            name: field.name,
            value: Array.isArray(formValues[field.name])
              ? formValues[field.name].join(', ')
              : formValues[field.name],
            image: field.image,
            translations: field.translations,
            featured: field?.featured,
            type: field.type,
            hightlights: field.hightlights,
            color: field.color,
          }));
        }

        navigation.navigate('AdsLocation', {
          data: data,
          customField:
            resultArray.length > 0 ? JSON.stringify(resultArray) : '',
          ad,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleInputChange = (name, value) => {
    if (Array.isArray(formValues[name])) {
      const updatedArray = formValues[name].includes(value)
        ? formValues[name].filter(item => item !== value)
        : [...formValues[name], value];
      setFormValues({
        ...formValues,
        [name]: updatedArray,
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }

    validateField(name, value);
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    fields.forEach(field => {
      const value =
        formValues[field.name] || (field.type === 'checkbox' ? [] : '');

      if (field.required === '1') {
        if (field.type === 'checkbox' && value.length === 0) {
          newErrors[field.name] = 'This is required';
          valid = false;
        } else if (field.type !== 'checkbox' && value.trim() === '') {
          newErrors[field.name] = 'This is required';
          valid = false;
        }
      }

      if (field.type === 'number' && (isNaN(value) || value.trim() === '')) {
        newErrors[field.name] = 'Only numbers are allowed';
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const pickDocument = async name => {
    try {
      const [pickResult] = await pick({
        type: ['application/pdf', 'image/*'],
      });
      const res = [pickResult];

      const file = {
        fileCopyUri: null,
        name: res[0].name,
        size: res[0].size,
        type: res[0].type,
        uri: res[0].uri,
      };

      setFormValues({
        ...formValues,
        [name]: file.uri,
      });

      const fileName = await uploadAndGetUrl(file, true);

      if (fileName) {
        setFormValues({
          ...formValues,
          [name]: fileName,
        });
        setErrors({
          ...errors,
          [name]: '',
        });
      } else {
        setFormValues({
          ...formValues,
          [name]: '',
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    const field = fields.find(f => f.name === name);
    if (
      field.required === '1' &&
      !value &&
      !value?.trim() &&
      field.type !== 'radio'
    ) {
      error = 'This is required';
    } else if (
      field.type === 'number' &&
      (isNaN(value) || value.trim() === '')
    ) {
      error = 'Only numbers are allowed';
    }
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  useEffect(() => {
    if (ad) {
      const customFieldData = ad?.custom_fileds_data
        ? JSON.parse(ad.custom_fileds_data)
        : [];

      const customFieldMap = customFieldData.reduce((acc, field) => {
        acc[field.name] = field.value;
        return acc;
      }, {});

      setFormValues(
        fields.reduce((acc, field) => {
          let value = customFieldMap[field.name] || '';
          if (field.type === 'checkbox') {
            value = value ? value.split(', ') : [];
          }
          acc[field.name] = value;
          return acc;
        }, {}),
      );
    }
  }, [ad]);

  const renderField = field => {
    const errorMessage = errors[field.name];

    const getFileExtension = uri => {
      return uri.split('.').pop().toLowerCase();
    };

    switch (field.type) {
      case 'dropdown':
        return (
          <>
            <View style={[styles.row, { marginBottom: 10 }]}>
              <ImageFastWrapper
                source={{ uri: imgUrl + field.image }}
                style={styles.icon}
                svgH={30}
                svgW={30}
              />
              <CustomText
                translation
                label={field?.translations}
                fontFamily={fonts.semiBold}
                fontSize={16}
                marginLeft={10}
              />
            </View>
            <CustomDropdown
              placeholder={field?.name}
              data={field?.input_values && JSON.parse(field?.input_values)}
              value={formValues?.[field?.name]}
              setValue={value => handleInputChange(field?.name, value)}
            />
            {errorMessage && (
              <CustomText
                label={errorMessage}
                color={colors.red}
                marginTop={-10}
                marginBottom={10}
              />
            )}
          </>
        );
      case 'text':
        return (
          <CustomInput
            translation
            withLabel={field.translations}
            labelIcon={{ uri: imgUrl + field.image }}
            value={formValues?.[field?.name]}
            onChangeText={text => handleInputChange(field?.name, text)}
            error={errorMessage}
          />
        );
      case 'number':
        return (
          <CustomInput
            translation
            withLabel={field.translations}
            labelIcon={{ uri: imgUrl + field.image }}
            keyboardType="numeric"
            value={formValues?.[field?.name]}
            onChangeText={text => {
              if (/^\d*$/.test(text)) {
                handleInputChange(field?.name, text);
              }
            }}
            error={errorMessage}
          />
        );
      case 'file':
        return (
          <>
            <View style={[styles.row]}>
              <ImageFastWrapper
                source={{ uri: imgUrl + field?.image }}
                style={styles.icon}
                svgH={30}
                svgW={30}
              />
              <CustomText
                translation
                label={field?.translations}
                fontFamily={fonts.semiBold}
                fontSize={16}
                marginLeft={10}
              />
            </View>
            <TouchableOpacity
              onPress={() => pickDocument(field?.name)}
              activeOpacity={0.6}
              style={styles.upload}>
              <CustomText
                label={'choose'}
                fontFamily={fonts.semiBold}
                fontSize={15}
              />
            </TouchableOpacity>
            {errorMessage && !formValues[field?.name] && (
              <CustomText
                label={errorMessage}
                color={colors.red}
                marginTop={10}
                marginBottom={-3}
              />
            )}
            {formValues?.[field?.name] && (
              <>
                {getFileExtension(formValues[field?.name]) === 'pdf' ? (
                  <CustomText
                    label={formValues?.[field?.name]}
                    numberOfLines={1}
                    fontFamily={fonts.semiBold}
                    color={colors.primaryColor}
                    marginTop={5}
                  />
                ) : (
                  <View style={styles.imgBox}>
                    <Image
                      source={{ uri: imgUrl + formValues?.[field?.name] }}
                      style={styles.img}
                    />
                  </View>
                )}
              </>
            )}
          </>
        );
      case 'radio':
        return (
          <>
            <View style={[styles.row, { marginTop: 10 }]}>
              <ImageFastWrapper
                source={{ uri: imgUrl + field.image }}
                style={styles.icon}
                svgH={30}
                svgW={30}
              />
              <CustomText
                translation
                label={field?.translations}
                fontFamily={fonts.semiBold}
                fontSize={16}
                marginLeft={10}
              />
            </View>
            <View style={styles.row}>
              {field?.input_values &&
                JSON.parse(field?.input_values).map(value => (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    key={value}
                    onPress={() => handleInputChange(field?.name, value)}>
                    <View
                      style={[
                        formValues?.[field?.name] === value
                          ? styles.box1
                          : styles.box,
                      ]}>
                      <CustomText
                        label={value}
                        color={
                          formValues?.[field?.name] === value
                            ? colors.white
                            : colors.black
                        }
                      />
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
            {errorMessage && (
              <CustomText
                label={errorMessage}
                color={colors.red}
                marginBottom={10}
              />
            )}
          </>
        );
      case 'checkbox':
        return (
          <View style={{ marginTop: 3, marginBottom: 5 }}>
            <View style={[styles.row]}>
              <ImageFastWrapper
                source={{ uri: imgUrl + field.image }}
                style={styles.icon}
                svgH={30}
                svgW={30}
              />
              <CustomText
                translation
                label={field?.translations}
                fontFamily={fonts.semiBold}
                fontSize={16}
                marginLeft={10}
              />
            </View>
            <View style={styles.row}>
              {JSON.parse(field.input_values).map(value => (
                <TouchableOpacity
                  key={value}
                  activeOpacity={0.5}
                  onPress={() => handleInputChange(field.name, value)}>
                  <View
                    style={[
                      formValues[field.name].includes(value)
                        ? styles.box1
                        : styles.box,
                    ]}>
                    {formValues[field.name].includes(value) ? (
                      <Icons
                        name={'check'}
                        family={'AntDesign'}
                        color={colors.white}
                        size={18}
                        // left={-3}
                      />
                    ) : (
                      <Icons name={'add'} size={18} />
                    )}
                    <CustomText
                      label={value}
                      marginLeft={3}
                      color={
                        formValues[field.name].includes(value)
                          ? colors.white
                          : colors.black
                      }
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {errorMessage && (
              <CustomText
                label={errorMessage}
                color={colors.red}
                marginTop={10}
              />
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScreenWrapper
      scrollEnabled
      paddingHorizontal={20}
      statusBarColor="white"
      headerUnScrollable={() => <Header title={'Ad Details'} />}>
      <CustomText
        label={`Your${"'"}e almost there!`}
        fontFamily={fonts.bold}
        fontSize={16}
        marginTop={20}
        marginBottom={10}
      />
      {fields.length > 0 ? (
        fields.map(field => (
          <View key={field.id} style={styles.fieldContainer}>
            {renderField(field)}
          </View>
        ))
      ) : (
        <View style={styles.empty}>
          <EmptyComponent title={'No custom fields added yet'} />
        </View>
      )}
      <View style={styles.btnBox}>
        <CustomButton onPress={handlePress} title={'Next'} />
      </View>
    </ScreenWrapper>
  );
};

export default CustomFields;

const styles = StyleSheet.create({
  btnBox: {
    marginVertical: 20,
  },
  fieldContainer: {},

  fileInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 5,
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
  },
  imgBox: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: 20,
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  loader: {
    width: 70,
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
  empty: {
    flex: 1,
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
    marginVertical: 5,
  },
  box1: {
    backgroundColor: colors.lightBlue,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: colors.lightBlue,
  },
  icon: {
    width: 30,
    height: 30,
  },
});

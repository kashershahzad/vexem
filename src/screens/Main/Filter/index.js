/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import CustomText from '../../../components/CustomText';
import { DatePicker } from '../../../components/DatePicker';
import Header from '../../../components/Header';
import ScreenWrapper from '../../../components/ScreenWrapper';
import { colors } from '../../../utils/colors';
import { numberRegex } from '../../../utils/Commonfun';
import ImageFastWrapper from '../../../components/ImageFast';
import { imgUrl } from '../../../utils/constants';
import CustomDropdown from '../../../components/CustomDropDown';
import Icons from '../../../components/Icons';
import LocationModal from '../../../components/LocationModal';
import CategoryModal from '../../../components/CategoryModal';
import ApiRequest from '../../../services/ApiRequest';
import { ToastMessage } from '../../../utils/ToastMessage';

const Filter = ({ navigation, route }) => {
  //

  const [modal, setModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState('No');
  const [catModal, setCatModal] = useState(false);
  const [selected, setSelected] = useState({});
  const [fields, setFields] = useState(route.params?.fields || []);
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
  const [data, setData] = useState({
    minPrice: '',
    maxPrice: '',
    address: '',
    date: '',
    lat: '',
    lng: '',
  });

  const handleDateTime = (e, dateTime) => {
    if (e.type === 'dismissed') {
      setModal(false);
    } else {
      const formattedDate = moment(dateTime).format('YYYY-MM-DD');
      setModal(false);
      setData({ ...data, date: formattedDate });
    }
  };

  const handleChange = (value, field) => {
    const isNum = numberRegex.test(value);
    if (!isNum) {
      return false;
    }
    setData(prevState => ({ ...prevState, [field]: value }));
  };

  const handleReset = () => {
    setData({
      date: '',
      location: '',
      maxPrice: '',
      minPrice: '',
      lat: '',
      lng: '',
    });
    setFormValues(
      fields.reduce((acc, field) => {
        if (field.type === 'checkbox') {
          acc[field.name] = [];
        } else {
          acc[field.name] = '';
        }
        return acc;
      }, {}),
    );
    setSelected({});
    setChecked('Yes');
    setFields([]);
  };

  const handlePress = () => {
    if (
      data.minPrice &&
      data?.maxPrice &&
      Number(data?.maxPrice) < Number(data?.minPrice)
    ) {
      return ToastMessage('Min price cannot be greater than max price');
    }

    const resultArray = Object.entries(formValues)
      .filter(([_, value]) => value !== '' && value.length > 0)
      .map(([name, value]) => ({
        name,
        value: Array.isArray(value) ? value.join(', ') : value,
      }));

    const dataToSend = {
      ...data,
      filter: resultArray.length > 0 ? resultArray : '',
      nearMe: checked === 'Yes' ? 'Yes' : '',
    };

    navigation.navigate('Result', {
      data: dataToSend,
      subCat: { id: selected?.id || '', name: selected?.name || '' },
    });
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
  };

  const fetchData = async id => {
    try {
      const dataToGet = {
        type: 'get_custom_fields',
        cat_id: id,
        filter: 1,
      };

      const response = await ApiRequest(dataToGet);

      if (response.data?.custom) {
        const array = response.data?.custom;
        setFields(array);
        setFormValues(
          array.reduce((acc, field) => {
            if (field.type === 'checkbox') {
              acc[field.name] = [];
            } else {
              acc[field.name] = '';
            }
            return acc;
          }, {}),
        );
      } else {
        setFields([]);
      }
    } catch (error) {
      console.log(error, 'err in custom fields');
    }
  };

  const handleSelect = e => {
    setSelected(e);
    fetchData(e.id);
  };

  useEffect(() => {
    if (route?.params?.selected) {
      setSelected(route?.params?.selected);
      fetchData(route?.params?.selected?.id);
    }
  }, [route]);

  const renderField = field => {
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
                fontFamily={fonts.semiBold}
                fontSize={16}
                marginLeft={10}
                label={field?.translations}
                translation
              />
            </View>
            <CustomDropdown
              placeholder={field?.name}
              data={JSON.parse(field?.input_values)}
              value={formValues[field.name]}
              setValue={value => handleInputChange(field.name, value)}
            />
          </>
        );
      case 'text':
        return (
          <CustomInput
            labelIcon={{ uri: imgUrl + field.image }}
            value={formValues[field.name]}
            onChangeText={text => handleInputChange(field.name, text)}
            withLabel={field?.translations}
            translation
          />
        );
      case 'number':
        return (
          <CustomInput
            withLabel={field?.translations}
            translation
            labelIcon={{ uri: imgUrl + field.image }}
            keyboardType="numeric"
            value={formValues[field.name]}
            onChangeText={text => {
              if (/^\d*$/.test(text)) {
                handleInputChange(field.name, text);
              }
            }}
          />
        );
      case 'radio':
        return (
          <>
            <View style={[styles.row, { marginTop: 20 }]}>
              <ImageFastWrapper
                source={{ uri: imgUrl + field.image }}
                style={styles.icon}
                svgH={30}
                svgW={30}
              />
              <CustomText
                fontFamily={fonts.semiBold}
                fontSize={16}
                marginLeft={10}
                label={field?.translations}
                translation
              />
            </View>
            <View style={styles.row}>
              {JSON.parse(field.input_values).map(value => (
                <TouchableOpacity
                  activeOpacity={0.5}
                  key={value}
                  onPress={() => handleInputChange(field.name, value)}>
                  <View
                    style={[
                      formValues[field.name] === value
                        ? styles.box1
                        : styles.box,
                    ]}>
                    <CustomText
                      label={value}
                      color={
                        formValues[field.name] === value
                          ? colors.white
                          : colors.black
                      }
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
                fontFamily={fonts.semiBold}
                fontSize={16}
                marginLeft={10}
                label={field?.translations}
                translation
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
                      formValues[field.name]?.includes(value)
                        ? styles.box1
                        : styles.box,
                    ]}>
                    {formValues[field.name]?.includes(value) ? (
                      <Icons
                        name={'check'}
                        family={'AntDesign'}
                        color={colors.white}
                        left={-3}
                      />
                    ) : (
                      <Icons name={'add'} size={18} left={-3} />
                    )}
                    <CustomText
                      label={value}
                      marginLeft={3}
                      color={
                        formValues[field.name]?.includes(value)
                          ? colors.white
                          : colors.black
                      }
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScreenWrapper
      scrollEnabled
      statusBarColor="white"
      headerUnScrollable={() => (
        <>
          <View style={styles.headerContainer}>
            <Header title={'Filter'} />
            <TouchableOpacity onPress={handleReset}>
              <CustomText
                fontFamily={fonts.semiBold}
                label={'Reset'}
                color={'#000000'}
                fontSize={16}
                marginRight={20}
              />
            </TouchableOpacity>
          </View>
        </>
      )}>
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => setVisible(true)}>
          <CustomInput
            withLabel={'Location'}
            placeholder={'Enter Location'}
            value={data.address}
            editable={false}
          />
        </TouchableOpacity>
        <CustomText
          label={'Near me'}
          marginBottom={8}
          fontFamily={fonts.semiBold}
        />
        <CustomDropdown
          value={checked}
          data={['Yes', 'No']}
          setValue={setChecked}
          placeholder={'Select'}
        />
        <CustomText
          label={'Category'}
          marginBottom={8}
          fontFamily={fonts.semiBold}
        />
        <Pressable style={[styles.selector]} onPress={() => setCatModal(true)}>
          <View style={styles.selectorBox}>
            <Icons name={'dashboard'} family={'MaterialIcons'} />
            <CustomText
              label={selected?.name || 'Select Category'}
              marginLeft={8}
              numberOfLines={1}
            />
          </View>
          <TouchableOpacity onPress={() => setCatModal(true)}>
            <Icons name={'caretdown'} family={'AntDesign'} size={17} />
          </TouchableOpacity>
        </Pressable>
        <CustomText
          label={'Budget (Price)'}
          marginBottom={8}
          fontFamily={fonts.semiBold}
        />
        <View style={styles.row1}>
          <CustomInput
            containerStyle={{ width: '48%' }}
            placeholder={'Min'}
            value={data.minPrice}
            onChangeText={e => handleChange(e, 'minPrice')}
          />
          <CustomInput
            containerStyle={{ width: '48%' }}
            placeholder={'Max'}
            value={data.maxPrice}
            onChangeText={e => handleChange(e, 'maxPrice')}
          />
        </View>
        <CustomText
          label={'Posted Since'}
          marginBottom={8}
          fontFamily={fonts.semiBold}
        />
        <DatePicker
          show={modal}
          date={data.date}
          placeHolder={'Select date'}
          showDatepicker={() => setModal(true)}
          onChange={(e, date) => handleDateTime(e, date)}
        />
        {fields.map(field => (
          <View key={field.id}>{renderField(field)}</View>
        ))}
      </View>
      <View style={styles.bottom}>
        <CustomButton onPress={handlePress} title={'Filter'} />
      </View>
      <LocationModal
        visible={visible}
        setVisible={setVisible}
        addressData={data}
        setData={setData}
      />
      <CategoryModal
        visible={catModal}
        setVisible={setCatModal}
        setItem={handleSelect}
      />
    </ScreenWrapper>
  );
};

export default Filter;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottom: {
    marginVertical: 20,
  },
  row1: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  dateBox: {
    borderWidth: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderColor: colors.lightGrey,
    paddingHorizontal: 10,
    height: 52,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 5,
  },
  selector: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 10,
    height: 52,
    marginBottom: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkBox: {
    width: 25,
    height: 25,
    borderColor: colors.lightGrey,
    backgroundColor: colors.lightBlue,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

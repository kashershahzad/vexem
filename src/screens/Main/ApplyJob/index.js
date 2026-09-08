/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { pick } from '@react-native-documents/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import fonts from '../../../assets/fonts';
import { Images } from '../../../assets/images';
import CustomButton from '../../../components/CustomButton';
import CustomDropdown from '../../../components/CustomDropDown';
import CustomInput from '../../../components/CustomInput';
import CustomModal from '../../../components/CustomModal';
import CustomText from '../../../components/CustomText';
import { DatePicker } from '../../../components/DatePicker';
import DropDownWithSearch from '../../../components/DropDownWithSearch';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import ImageFastWrapper from '../../../components/ImageFast';
import ScreenWrapper from '../../../components/ScreenWrapper';
import UploadImage from '../../../components/UploadImage';
import ApiRequest from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import { imgUrl, uploadAndGetUrl } from '../../../utils/constants';
import { allCountries } from '../../../utils/countaryOptions';
import { ToastMessage } from '../../../utils/ToastMessage';

const ApplyJob = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const ParsedJobData = route.params?.ParsedJobData;

  const profile_id = route.params?.profile_id;

  const userData = route.params?.data;

  const addId = route.params?.add_Id;

  const init = {
    profilename: '',
    nationality: '',
    dob: '',
    gender: '',
    education: '',
    course: '',
    institute: '',
    institute_year: '',
    workExp: '',
    job_type: '',
    License: '',
    visa: '',
    country_status: '',
    resume: '',
    portfolio: '',
  };
  const inits = {
    profilenameError: '',
    nationalityError: '',
    dobError: '',
    genderError: '',
    educationError: '',
    courseError: '',
    instituteError: '',
    instituteYearError: '',
    workExpError: '',
    jobTypeError: '',
    licenseError: '',
    visaError: '',
    countryStatusError: '',
    resumeError: '',
    portfolioError: '',
  };

  const init1 = {
    position: '',
    cName: '',
    Location: '',
    fromDate: '',
    todate: '',
  };
  const inits1 = {
    positionError: '',
    cNameError: '',
    LocationError: '',
    fromDateError: '',
    todateError: '',
  };
  const [state, setState] = useState(init);

  const [errors, setErrors] = useState(inits);

  const [Modalstate, setMoadlState] = useState(init1);
  const [modalerrors, setModalErrors] = useState(inits1);
  const [fileLoader, setFileLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [ModalViewFrom, setModalViewFrom] = useState(false);
  const [ModalViewTo, setModalViewTo] = useState(false);
  const [UserExpriance, setUserExpriance] = useState([]);
  const [skillChange, setskillChange] = useState('');
  const [skills, setSkills] = useState([]);
  const [imgLoading1, setImgLoading1] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgSingle, setImgSingle] = useState([]);
  const [imagesSingle, setImagesSingle] = useState([]);

  const [ModalInstittue, setModalInstittue] = useState(false);
  const [imgDouble, setImgDouble] = useState([]);
  const [selectedExpIndex, setSelectedExpIndex] = useState(null);

  const [imagesDouble, setImagesDouble] = useState([]);

  const [isModalVisibleExp, setisModalVisibleExp] = useState(false);

  const [certificates, setCertificates] = useState([
    { course: '', date: new Date() },
  ]);

  const { token } = useSelector(store => store.user);

  const countryOptions = allCountries?.map(country => country.countryName);

  const addCertificate = () => {
    setCertificates([...certificates, { course: '', date: new Date() }]);
  };

  const handleCertificateChange = (index, field, value) => {
    const updated = [...certificates];
    updated[index][field] = value;
    setCertificates(updated);
  };

  const handleDateChange = (index, e, dateTime) => {
    const updated = [...certificates];
    updated[index].date = moment(dateTime).format('YYYY-MM-DD');
    updated[index].modal = false;
    setCertificates(updated);
  };

  const removeCertificate = index => {
    const updated = [...certificates];
    updated.splice(index, 1);
    setCertificates(updated);
  };

  const toggleModal = (index, value) => {
    const updated = [...certificates];
    updated[index].modal = value;
    setCertificates(updated);
  };

  const onSkillAddPress = () => {
    if (skillChange.trim() !== '') {
      setSkills([...skills, skillChange]);
      setskillChange('');
    }
  };

  const removeSkillByIndex = index => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  const handleDateTime = (e, dateTime) => {
    const formattedDate = moment(dateTime).format('YYYY-MM-DD');
    setModal(false);
    setState({ ...state, dob: formattedDate });
  };
  const handleDateTimeInstitute = (e, dateTime) => {
    const formattedDate = moment(dateTime).format('YYYY-MM-DD');
    setModalInstittue(false);
    setState({ ...state, institute_year: formattedDate });
  };

  const FromDate = (e, dateTime) => {
    setModalViewFrom(false);
    const formattedDate = moment(dateTime).format('YYYY-MM-DD');
    setModalViewFrom(false);
    setMoadlState({ ...Modalstate, fromDate: formattedDate });
  };

  const handleDateTimeTo = (e, dateTime) => {
    const formattedDate = moment(dateTime).format('YYYY-MM-DD');
    setModalViewTo(false);
    setMoadlState({ ...Modalstate, todate: formattedDate });
  };
  const modalSubmit = () => {
    if (errorCheck1()) {
      const updatedExperience = {
        position: Modalstate.position,
        cName: Modalstate.cName,
        Location: Modalstate.Location,
        fromDate: Modalstate.fromDate,
        todate: Modalstate.todate,
      };

      if (selectedExpIndex !== null) {
        const updatedArray = [...UserExpriance];
        updatedArray[selectedExpIndex] = updatedExperience;
        setUserExpriance(updatedArray);
        setSelectedExpIndex(null); // Reset after editing
      } else {
        setUserExpriance([...UserExpriance, updatedExperience]);
      }

      setisModalVisibleExp(false);
      // setisModalVisibleExp(false);
      // setUserExpriance(prevArray => [...prevArray, Modalstate]);
    }
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
      const fileName = await uploadAndGetUrl(file, true);
      if (fileName) {
        setState({ ...state, resume: fileName });
        setErrors({ ...errors, resumeError: '' });
      } else {
        setState({ ...state, resume: '' });
        ToastMessage('Upload again');
      }
      setFileLoader(false);
    } catch (err) {
      console.log(err);
      setFileLoader(false);
    }
  };

  const handleInputChange = (field, value) => {
    setState(prevState => ({ ...prevState, [field]: value }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [`${field}Error`]: validateField(field, value),
    }));
  };
  const handleInputChangeModal = (field, value) => {
    setMoadlState(prevState => ({ ...prevState, [field]: value }));
    setModalErrors(prevErrors => ({
      ...prevErrors,
      [`${field}Error`]: validateField(field, value),
    }));
  };

  const handleRemoveImg = indexToRemove => {
    setImgDouble(prev => prev.filter((_, index) => index !== indexToRemove));
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
        setState(prev => ({
          ...prev,
          portfolio: validImages, // OR use: portfolio: validImages
        }));

        setImgDouble(updateData);
        setImagesDouble(prevImages => [...prevImages, ...validImages]);
        setImgLoading(false);
      } catch (error) {
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
        setLoading(true);
        const cotaldata = {
          ...state,
          image: userData?.image,
          cover: userData?.cover,
          salary: userData?.price,
          description: userData?.description,
          skills: skills,
          certificates: certificates,
          useWorkExp: UserExpriance,
        };
        const body = {
          type: profile_id ? 'update_data' : 'add_data',
          table_name: 'job_description',
          fullname: userData?.name,
          email: userData?.email,
          phone: userData?.phone,
          user_id: token,
          ...(profile_id && { id: profile_id }),
          extra_data: JSON.stringify(cotaldata),
        };

        const res = await ApiRequest(body);
        if (res?.data?.result) {
          navigation.navigate('JobDone', {
            jobdone: profile_id ? true : false,
          });
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error, 'err in apply job');
      setLoading(false);
    }
  };

  const validateField = (field, value) => {
    let error = '';

    if (field === 'profilename') {
      if (!value || value.trim() === '') error = 'Full name is required';
    } else if (field === 'nationality') {
      if (!value || value.trim() === '') error = 'Nationality is required';
    } else if (field === 'dob') {
      if (!value || value.trim() === '') error = 'Date of birth is required';
    } else if (field === 'gender') {
      if (!value || value.trim() === '') error = 'Gender is required';
    } else if (field === 'education') {
      if (!value || value.trim() === '') error = 'Education level is required';
    } else if (field === 'course') {
      // Skip validation if education is High School
      if (
        state.education !== 'High School' &&
        (!value || value.trim() === '')
      ) {
        error = 'Course is required';
      }
    } else if (field === 'institute') {
      // Skip validation if education is High School
      if (
        state.education !== 'High School' &&
        (!value || value.trim() === '')
      ) {
        error = 'Institute name is required';
      }
    } else if (field === 'institute_year') {
      // Skip validation if education is High School
      if (
        state.education !== 'High School' &&
        (!value || value.trim() === '')
      ) {
        error = 'Institute year is required';
      }
    } else if (field === 'workExp') {
      if (!value || value.trim() === '') error = 'Work experience is required';
    } else if (field === 'job_type') {
      if (!value || value.trim() === '') error = 'Job type is required';
    } else if (field === 'License') {
      if (!value || value.trim() === '') {
        error = 'License information is required';
      }
    } else if (field === 'visa') {
      if (!value || value.trim() === '') error = 'Visa status is required';
    } else if (field === 'country_status') {
      if (!value || value.trim() === '') error = 'Country status is required';
    } else if (field === 'resume') {
      if (!value || value.trim() === '') error = 'Resume is required';
    }

    return error;
  };

  const validateField1 = (field, value) => {
    let error = '';

    if (field === 'position') {
      if (!value || value.trim() === '') error = 'Please enter position';
    } else if (field === 'cName') {
      if (!value || value.trim() === '') error = 'Please enter company name';
    } else if (field === 'todate') {
      if (!value || value.trim() === '') error = 'Please select to date';
    } else if (field === 'fromDate') {
      if (!value || value.trim() === '') error = 'Please select from date';
    } else if (field === 'Location') {
      if (!value || value.trim() === '') error = 'Please enter job location';
    }

    return error;
  };

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      newErrors.profilenameError = validateField(
        'profilename',
        state.profilename,
      );
      newErrors.nationalityError = validateField(
        'nationality',
        state.nationality,
      );
      newErrors.dobError = validateField('dob', state.dob);
      newErrors.genderError = validateField('gender', state.gender);
      newErrors.educationError = validateField('education', state.education);

      // Only validate course, institute, and institute_year if education is not High School
      if (state.education !== 'High School') {
        newErrors.courseError = validateField('course', state.course);
        newErrors.instituteError = validateField('institute', state.institute);
        newErrors.instituteYearError = validateField(
          'institute_year',
          state.institute_year,
        );
      } else {
        // Clear these errors if education is High School
        newErrors.courseError = '';
        newErrors.instituteError = '';
        newErrors.instituteYearError = '';
      }

      newErrors.workExpError = validateField('workExp', state.workExp);
      newErrors.jobTypeError = validateField('job_type', state.job_type);
      newErrors.licenseError = validateField('License', state.License);
      newErrors.visaError = validateField('visa', state.visa);
      newErrors.countryStatusError = validateField(
        'country_status',
        state.country_status,
      );
      newErrors.resumeError = validateField('resume', state.resume);

      setErrors(newErrors);
      return Object.keys(newErrors).every(key => !newErrors[key]);
    };
  }, [state, validateField]);

  const errorCheck1 = useMemo(() => {
    return () => {
      let newErrors = {};
      newErrors.positionError = validateField1('position', Modalstate.position);
      newErrors.cNameError = validateField1('cName', Modalstate.cName);
      newErrors.todateError = validateField1('todate', Modalstate.todate);
      newErrors.fromDateError = validateField1('fromDate', Modalstate.fromDate);
      newErrors.LocationError = validateField1('Location', Modalstate.Location);

      setModalErrors(newErrors);
      return Object.keys(newErrors).every(key => !newErrors[key]);
    };
  }, [Modalstate]);

  const HanderRemovePdf = () => {
    setState(prevState => ({
      ...prevState,
      resume: '', // clear the resume
    }));
  };

  useEffect(() => {
    if (ParsedJobData?.profilename) {
      const dateOfbirth = moment(ParsedJobData?.dob, 'MMM DD, YYYY').format(
        'YYYY-MM-DD',
      );
      const sDate = moment(
        ParsedJobData?.institute_year,
        'MMM DD, YYYY',
      ).format('YYYY-MM-DD');

      setState({
        profilename: ParsedJobData?.profilename,
        nationality: ParsedJobData?.nationality,
        dob: ParsedJobData?.dob,
        gender: ParsedJobData?.gender,
        education: ParsedJobData?.education,
        course: ParsedJobData?.course,
        institute: ParsedJobData?.institute,
        institute_year: ParsedJobData?.institute_year,
        workExp: ParsedJobData?.workExp,
        job_type: ParsedJobData?.job_type,
        License: ParsedJobData?.License,
        visa: ParsedJobData?.visa,
        country_status: ParsedJobData?.country_status,
        resume: ParsedJobData?.resume,
        portfolio: ParsedJobData?.portfolio,
      });

      setCertificates(
        ParsedJobData?.certificates ? ParsedJobData?.certificates : [],
      );
      setUserExpriance(
        ParsedJobData?.useWorkExp ? ParsedJobData?.useWorkExp : [],
      );
      setSkills(ParsedJobData?.skills ? ParsedJobData?.skills : []);
      const updatedPortfolio = Array.isArray(ParsedJobData?.portfolio)
        ? ParsedJobData.portfolio.map(fileName => `${imgUrl}${fileName}`)
        : [];

      setImgDouble(updatedPortfolio);
    }
  }, [ParsedJobData]);

  const EditExp = (item, index) => {
    setSelectedExpIndex(index); // Track which item is being edited

    setisModalVisibleExp(true);
    setMoadlState({
      position: item?.position,
      cName: item?.cName,
      Location: item?.Location,
      fromDate: item?.fromDate,
      todate: item?.todate,
    });
  };

  return (
    <>
      <ScreenWrapper
        scrollEnabled
        headerUnScrollable={() => <Header title={'Job Application'} isjob />}>
        <View style={[styles.row, { marginBottom: 8, marginTop: 20, gap: 10 }]}>
          <ImageFastWrapper
            source={Images.titlename}
            resizeMode={'contain'}
            style={styles.titleIcn}
          />
          <CustomText label={'Full Name'} fontFamily={fonts.semiBold} />
        </View>

        <CustomInput
          value={state.profilename}
          onChangeText={e => handleInputChange('profilename', e)}
          error={errors.profilenameError}
          marginTop={20}
        />

        <View style={[styles.row, { marginBottom: 8, gap: 10 }]}>
          <ImageFastWrapper
            source={Images.nationality}
            resizeMode={'contain'}
            style={styles.titleIcn}
          />
          <CustomText label={'Nationality'} fontFamily={fonts.semiBold} />
        </View>

        <DropDownWithSearch
          data={countryOptions}
          value={state.nationality}
          setValue={e => handleInputChange('nationality', e)}
        />
        {errors.nationalityError && (
          <CustomText
            label={errors.nationalityError}
            color={colors.red}
            marginBottom={10}
            marginTop={-10}
          />
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '48%' }}>
            <View style={[styles.row, { marginBottom: 8, gap: 10 }]}>
              <ImageFastWrapper
                source={Images.birth}
                resizeMode={'contain'}
                style={styles.titleIcn}
              />
              <CustomText
                label={'Date of Birth* '}
                fontFamily={fonts.semiBold}
              />
            </View>

            <DatePicker
              show={modal}
              date={state?.dob}
              placeHolder={'Select date'}
              showDatepicker={() => setModal(true)}
              onChange={(e, date) => handleDateTime(e, date)}
            />
            {errors.dobError && (
              <CustomText
                label={errors.dobError}
                color={colors.red}
                marginBottom={10}
                marginTop={2}
              />
            )}
          </View>
          <View style={{ width: '48%' }}>
            <View style={[styles.row, { marginBottom: 8, gap: 10 }]}>
              <ImageFastWrapper
                source={Images.profileGender}
                resizeMode={'contain'}
                style={styles.titleIcn}
              />
              <CustomText label={'Gender'} fontFamily={fonts.semiBold} />
            </View>
            <CustomDropdown
              data={['Male', 'Female']}
              placeholder={'Select Gender'}
              value={state.gender}
              setValue={e => handleInputChange('gender', e)}
            />
            {errors.genderError && (
              <CustomText
                label={errors.genderError}
                color={colors.red}
                marginBottom={10}
                marginTop={-10}
              />
            )}
          </View>
        </View>

        <View style={[styles.row, { marginBottom: 8, gap: 10 }]}>
          <ImageFastWrapper
            source={Images.education}
            resizeMode={'contain'}
            style={styles.titleIcn}
          />
          <CustomText
            label={'Highest Education Level'}
            fontFamily={fonts.semiBold}
          />
        </View>

        <View style={[styles.row, { flexWrap: 'wrap' }]}>
          {['High School', 'Diploma', 'Bachelors', 'Masters', 'PHD'].map(
            (item, index) => (
              <TouchableOpacity
                style={
                  state.education === item ? styles.active : styles.checkBox
                }
                key={index}
                onPress={() => handleInputChange('education', item)}>
                <CustomText
                  label={item}
                  color={state.education === item ? colors.white : colors.black}
                />
              </TouchableOpacity>
            ),
          )}
        </View>
        {errors.educationError && (
          <CustomText
            label={errors.educationError}
            color={colors.red}
            marginBottom={10}
          />
        )}
        {state.education != 'High School' && (
          <CustomInput
            withLabel={'Name of the course'}
            value={state.course}
            onChangeText={e => handleInputChange('course', e)}
            error={errors.courseError}
          />
        )}

        {state.education != 'High School' && (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '60%' }}>
              <CustomInput
                withLabel={'Institution / University'}
                value={state.institute}
                onChangeText={e => handleInputChange('institute', e)}
                error={errors.instituteError}
              />
            </View>

            <View style={{ width: '35%' }}>
              <CustomText
                label={'Year'}
                marginBottom={8}
                fontFamily={fonts.semiBold}
              />
              <DatePicker
                show={ModalInstittue}
                date={state?.institute_year}
                placeHolder={'Select date'}
                showDatepicker={() => setModalInstittue(true)}
                onChange={(e, date) => handleDateTimeInstitute(e, date)}
              />

              {errors.instituteYearError && (
                <CustomText
                  label={errors.instituteYearError}
                  color={colors.red}
                  marginBottom={10}
                />
              )}
            </View>
          </View>
        )}

        {state.education != 'High School' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <View style={[styles.row, { gap: 10 }]}>
              <ImageFastWrapper
                source={Images.Certificates}
                resizeMode={'contain'}
                style={styles.titleIcn}
              />
              <CustomText
                label={'Additional Certificate'}
                fontFamily={fonts.semiBold}
              />
            </View>
            <TouchableOpacity onPress={addCertificate}>
              <Icons
                name={'add-circle-outline'}
                family={'MaterialIcons'}
                size={25}
              />
            </TouchableOpacity>
          </View>
        )}

        {certificates?.map((item, index) => (
          <>
            {index === 1 && (
              <TouchableOpacity
                onPress={() => removeCertificate(index)}
                style={{
                  paddingLeft: 8,
                  alignSelf: 'flex-end',
                  marginBottom: 10,
                }}>
                <Icons
                  name={'remove-circle-outline'}
                  family={'MaterialIcons'}
                  size={25}
                  color="red"
                />
              </TouchableOpacity>
            )}

            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <View style={{ width: '60%' }}>
                <CustomInput
                  placeholder={'Certificate Name'}
                  value={item.course}
                  onChangeText={e =>
                    handleCertificateChange(index, 'course', e)
                  }
                />
              </View>
              <View
                style={{ width: '35%', marginTop: -10, flexDirection: 'row' }}>
                <DatePicker
                  show={item.modal}
                  date={moment(item.date).format('YYYY-MM-DD')}
                  placeHolder={'Select date'}
                  showDatepicker={() => toggleModal(index, true)}
                  onChange={(e, date) => handleDateChange(index, e, date)}
                />
              </View>
            </View>
          </>
        ))}

        <View style={[styles.row, { gap: 10, marginBottom: 10 }]}>
          <ImageFastWrapper
            source={Images.workExp}
            resizeMode={'contain'}
            style={styles.titleIcn}
          />
          <CustomText label={'Work Experience*'} fontFamily={fonts.semiBold} />
        </View>
        <View style={[styles.row, { flexWrap: 'wrap' }]}>
          {[
            'Fresher',
            'Experienced',
            '1 Year',
            '1-3 Year',
            '3-5 Year',
            '5-10 years',
            '10-15 years',
            '15-20 Years',
            '20+ Years',
          ].map((item, index) => {
            const isFirstTwo = index === 0 || index === 1;
            const isSelected = state.workExp === item;
            if (state.workExp === 'Fresher' && index > 1) {
              return null;
            }

            return (
              <TouchableOpacity
                key={index}
                style={[
                  isSelected ? styles.active : styles.checkBox,
                  isFirstTwo && {
                    // width: '46%',
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
                onPress={() => handleInputChange('workExp', item)}>
                <CustomText
                  label={item}
                  color={isSelected ? colors.white : colors.black}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {errors.workExpError && (
          <CustomText
            label={errors.workExpError}
            color={colors.red}
            marginBottom={10}
          />
        )}
        {state.workExp != 'Fresher' && (
          <>
            {UserExpriance?.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => EditExp(item, index)}
                style={styles.exp}>
                <CustomText
                  label={item?.position}
                  fontFamily={fonts.semiBold}
                />
                <Icons name={'edit'} family={'Feather'} size={20} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.addexp}
              onPress={() => {
                setisModalVisibleExp(true),
                  setMoadlState({
                    position: '',
                    cName: '',
                    Location: '',
                    fromDate: '',
                    todate: '',
                  });
              }}>
              <CustomText
                label={'+ Add your Experience'}
                fontFamily={fonts.semiBold}
              />
            </TouchableOpacity>
          </>
        )}

        <CustomInput
          withLabel={'Skills'}
          value={skillChange}
          onChangeText={e => setskillChange(e)}
          marginTop={20}
          innerIcon
          add={() => onSkillAddPress()}
        />

        <View style={[styles.row, { flexWrap: 'wrap' }]}>
          {skills?.map((item, index) => (
            <>
              <TouchableOpacity
                style={[
                  styles.checkBox,
                  { flexDirection: 'row', alignItems: 'center', gap: 10 },
                ]}
                key={index}>
                <CustomText label={item} color={colors.black} />
                <TouchableOpacity onPress={() => removeSkillByIndex(index)}>
                  <Icons
                    name={'cross'}
                    family={'Entypo'}
                    size={20}
                    color={colors.red}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </>
          ))}
        </View>

        <View style={[styles.row, { gap: 10, marginTop: 10 }]}>
          <ImageFastWrapper
            source={Images.userJobType}
            resizeMode={'contain'}
            style={styles.titleIcn}
          />
          <CustomText label={'Job Type*'} fontFamily={fonts.semiBold} />
        </View>

        <View style={[styles.row, { flexWrap: 'wrap' }]}>
          {[
            'Full-Time',
            'Part-TIme',
            'Contract',
            'Internship',
            'Freelance',
            'Temporary',
          ].map((item, index) => (
            <TouchableOpacity
              style={state.job_type === item ? styles.active : styles.checkBox}
              key={index}
              onPress={() => handleInputChange('job_type', item)}>
              <CustomText
                label={item}
                color={state.job_type === item ? colors.white : colors.black}
              />
            </TouchableOpacity>
          ))}
        </View>
        {errors.jobTypeError && (
          <CustomText
            label={errors.jobTypeError}
            color={colors.red}
            marginBottom={10}
            marginTop={-10}
          />
        )}

        <View style={[styles.row, { gap: 10, marginTop: 10, marginBottom: 5 }]}>
          <ImageFastWrapper
            source={Images.License}
            resizeMode={'contain'}
            style={styles.titleIcn}
          />
          <CustomText
            label={'Qatar Driving License*'}
            fontFamily={fonts.semiBold}
          />
        </View>

        <View style={[styles.row, { flexWrap: 'wrap' }]}>
          {['Yes', 'No'].map((item, index) => (
            <TouchableOpacity
              style={[
                state.License === item ? styles.active : styles.checkBox,
                { paddingHorizontal: 20 },
              ]}
              key={index}
              onPress={() => handleInputChange('License', item)}>
              <CustomText
                label={item}
                color={state.License === item ? colors.white : colors.black}
              />
            </TouchableOpacity>
          ))}
        </View>
        {errors.licenseError && (
          <CustomText
            label={errors.licenseError}
            color={colors.red}
            marginBottom={10}
            marginTop={-10}
          />
        )}

        <View style={[styles.row, { gap: 10, marginTop: 10, marginBottom: 5 }]}>
          <ImageFastWrapper
            source={Images.VisaStatus}
            resizeMode={'contain'}
            style={styles.titleIcn}
          />
          <CustomText label={'Visa Status*'} fontFamily={fonts.semiBold} />
        </View>
        <View style={[styles.row, { flexWrap: 'wrap' }]}>
          {[
            'Visa Available',
            'No Visa',
            'Resident',
            'Visit Visa',
            'Student',
            'Spouse Visa',
          ].map((item, index) => {
            const isFirstTwo = index === 0 || index === 1;
            const isSelected = state.visa === item;

            if (state.visa === 'No Visa' && index > 1) {
              return null;
            }

            return (
              <TouchableOpacity
                key={index}
                style={[
                  isSelected ? styles.active : styles.checkBox,
                  isFirstTwo && {
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
                onPress={() => handleInputChange('visa', item)}>
                <CustomText
                  label={item}
                  color={isSelected ? colors.white : colors.black}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.visaError && (
          <CustomText
            label={errors.visaError}
            color={colors.red}
            marginBottom={10}
          />
        )}

        <View style={[styles.row, { gap: 10, marginTop: 10, marginBottom: 5 }]}>
          <ImageFastWrapper
            source={Images.country}
            resizeMode={'contain'}
            style={styles.titleIcn}
          />
          <CustomText label={'Country Status*'} fontFamily={fonts.semiBold} />
        </View>

        <View style={[styles.row, { flexWrap: 'wrap' }]}>
          {['Inside Qatar', 'Out of Qatar'].map((item, index) => (
            <TouchableOpacity
              style={[
                state.country_status === item ? styles.active : styles.checkBox,
                { paddingHorizontal: 20 },
              ]}
              key={index}
              onPress={() => handleInputChange('country_status', item)}>
              <CustomText
                label={item}
                color={
                  state.country_status === item ? colors.white : colors.black
                }
              />
            </TouchableOpacity>
          ))}
        </View>

        {errors.countryStatusError && (
          <CustomText
            label={errors.countryStatusError}
            color={colors.red}
            marginBottom={10}
          />
        )}

        <View
          style={[styles.row, { gap: 10, marginTop: 10, marginBottom: 10 }]}>
          <ImageFastWrapper
            source={Images.Resume}
            resizeMode={'contain'}
            style={styles.titleIcn}
          />
          <CustomText label={'Resume'} fontFamily={fonts.semiBold} />
        </View>

        <TouchableOpacity
          onPress={onPicker}
          activeOpacity={0.6}
          style={styles.upload}>
          <Icons name={'add'} top={1} left={-5} />
          <CustomText label={'Upload Resume'} />
        </TouchableOpacity>
        <View>
          {fileLoader ? (
            <View style={styles.loadepdf}>
              <ActivityIndicator size={24} color={colors.white} />
            </View>
          ) : (
            <>
              {state.resume && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                  }}>
                  <CustomText
                    label={state.resume}
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
          label={errors.resumeError}
          color={colors.red}
          marginBottom={20}
        />

        <View
          style={[styles.row, { gap: 10, marginTop: 10, marginBottom: 10 }]}>
          <ImageFastWrapper
            source={Images.PortfolioPofile}
            resizeMode={'contain'}
            style={styles.titleIcn}
          />
          <CustomText label={'Portfolio'} fontFamily={fonts.semiBold} />
        </View>

        <UploadImage
          multiple
          handleChange={res => {
            Array.isArray(res) ? getImages(res) : getImages([res]);
          }}
          renderButton={onPress => (
            <>
              <TouchableOpacity
                onPress={() => {
                  if (imgLoading1) {
                    return ToastMessage('Please wait...');
                  }
                  onPress();
                }}
                activeOpacity={0.6}
                style={styles.upload}>
                <Icons name={'add'} top={1} left={-5} />
                <CustomText label={'+ Upload  your Portfolio Images'} />
              </TouchableOpacity>
            </>
          )}
        />
        {errors.portfolioError && state.portfolio.length === 0 && (
          <CustomText label={errors.portfolioError} color={colors.red} />
        )}

        {imgDouble && (
          <View style={styles.imgContainer}>
            {imgDouble?.map((item, index) => {
              return (
                <View style={styles.imgBox} key={index}>
                  {imgLoading1 ? (
                    <View style={styles.imageLoader}>
                      <ActivityIndicator size={25} color={'#fff'} />
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity
                        disabled={imgLoading1}
                        style={styles.crossIcon}
                        onPress={() => handleRemoveImg(index)}>
                        <Icons name={'close'} size={20} color={'black'} />
                      </TouchableOpacity>
                      <Image source={{ uri: item }} style={styles.img} />
                    </>
                  )}
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.footer}>
          <CustomButton
            title={profile_id ? 'Update' : 'Apply'}
            onPress={handlePress}
            disabled={loading}
            loading={loading}
          />
        </View>
      </ScreenWrapper>

      <CustomModal
        isVisible={isModalVisibleExp}
        onDisable={() => setisModalVisibleExp(false)}>
        <View style={styles.modalContainer}>
          <CustomInput
            withLabel={'Position*'}
            value={Modalstate.position}
            onChangeText={e => handleInputChangeModal('position', e)}
            error={modalerrors.positionError}
            marginTop={20}
          />

          <CustomInput
            withLabel={'Company Name*'}
            value={Modalstate.cName}
            onChangeText={e => handleInputChangeModal('cName', e)}
            error={modalerrors.cNameError}
            marginTop={20}
          />

          <CustomInput
            withLabel={'Location*'}
            value={Modalstate.Location}
            onChangeText={e => handleInputChangeModal('Location', e)}
            error={modalerrors.LocationError}
            marginTop={20}
          />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
            <View style={{ width: '50%', height: 80 }}>
              <CustomText
                label={'From*'}
                fontFamily={fonts.semiBold}
                marginBottom={8}
              />
              <DatePicker
                show={ModalViewFrom}
                date={Modalstate?.fromDate}
                showDatepicker={() => setModalViewFrom(true)}
                onChange={(e, date) => FromDate(e, date)}
              />
            </View>

            <View style={{ width: '50%' }}>
              <CustomText
                label={'To*'}
                fontFamily={fonts.semiBold}
                marginBottom={8}
              />
              <DatePicker
                show={ModalViewTo}
                date={Modalstate?.todate}
                placeHolder={'Select date'}
                showDatepicker={() => setModalViewTo(true)}
                onChange={(e, date) => handleDateTimeTo(e, date)}
              />
            </View>
          </View>

          <CustomButton
            title={
              selectedExpIndex !== null ? 'Update Experience' : 'Add Experience'
            }
            marginTop={30}
            onPress={modalSubmit}
          />
        </View>
      </CustomModal>
    </>
  );
};

export default ApplyJob;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  imgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 5,
  },
  checkBox: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.lightGrey,
    padding: 10,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: colors.white,
    marginBottom: 15,
  },
  active: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.lightBlue,
    padding: 10,
    marginRight: 10,
    backgroundColor: colors.lightBlue,
    marginBottom: 15,
  },
  footer: {
    marginVertical: 10,
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
  imageLoader: {
    backgroundColor: '#0000004E',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 5,
  },

  exp: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    height: 50,
    width: '100%',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  addexp: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },

  modalContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    width: '90%',
    marginLeft: '5%',
    borderRadius: 5,
    paddingVertical: 20,
  },

  titleIcn: {
    height: 20,
    width: 20,
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

  img: {
    width: '100%',
    height: 70,
    borderRadius: 10,
  },

  loaderImg: {
    width: '100%',
    height: 70,
    borderRadius: 10,
    backgroundColor: '#0000007E',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadepdf: {
    width: '100%',
    height: 70,
    borderRadius: 10,
    backgroundColor: '#0000007E',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

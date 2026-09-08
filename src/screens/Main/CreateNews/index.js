/* eslint-disable react/no-unstable-nested-components */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  actions,
  RichEditor,
  RichToolbar,
} from 'react-native-pell-rich-editor';

import { useSelector } from 'react-redux';
import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import ScreenWrapper from '../../../components/ScreenWrapper';
import UploadImage from '../../../components/UploadImage';
import { colors } from '../../../utils/colors';
import { imgUrl, uploadAndGetUrl } from '../../../utils/constants';

const CreateNews = ({ navigation, route }) => {
  //

  const catdata = route.params?.catdata;

  const news = route.params?.news;

  const { token, loginUser } = useSelector(store => store.user);

  const richText = useRef(null);

  const init = {
    title: '',
    desc: '',
    slug: '',
    img: '',
    tags: [],
  };
  const inits = {
    titleError: '',
    slugError: '',
    descError: '',
    imgError: '',
    tagsError: '',
  };
  const [state, setState] = useState(init);
  const [tag, setTag] = useState('');
  const [errors, setErrors] = useState(inits);
  const [imageLoading, setImgLoading] = useState(false);

  const handleImage = async res => {
    try {
      setImgLoading(true);

      setState(prevState => ({ ...prevState, img: res.path }));

      const fileName = await uploadAndGetUrl(res);

      if (fileName) {
        setState(prevState => ({ ...prevState, img: fileName }));
      } else {
        setState(prevState => ({ ...prevState, img: '' }));
      }

      setImgLoading(false);
    } catch (error) {
      console.log(error);
      setImgLoading(false);
    }
  };

  const handleTags = () => {
    if (!state.tags.includes(tag)) {
      setState(prevState => ({
        ...prevState,
        tags: [...prevState.tags, tag.trim()],
      }));
      setTag('');
    }
  };

  const handleRemoveTag = item => {
    const updatedTags = state.tags.filter(obj => obj !== item);
    setState({ ...state, tags: updatedTags });
  };

  const onsubmit = () => {
    const tagData = state.tags.join(', ');
    let body = {
      title: state.title.trim(),
      description: state.desc.trim(),
      image: state.img,
      slug: state.slug.trim(),
      cat_id: catdata?.id,
      user_id: token,
      tags: tagData,
    };
    if (errorCheck()) {
      navigation.navigate('NewsLanguage', { item: body, news });
    }
  };

  const handleInputChange = (field, value) => {
    setState(prevState => ({ ...prevState, [field]: value }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [`${field}Error`]: validateField(field, value),
    }));
  };

  const validateField = useCallback((field, value) => {
    let error = '';
    if (field === 'title') {
      if (!value || value.trim() === '') error = 'Please enter news title';
    } else if (field === 'desc') {
      if (!value || value.trim() === '') error = 'Please enter description';
    }
    return error;
  }, []);

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      newErrors.titleError = validateField('title', state.title);
      newErrors.descError = validateField('desc', state.desc);
      newErrors.tagsError = state.tags.length === 0 ? 'Please enter tags' : '';
      newErrors.imgError = state.img === '' ? 'Please select image' : '';

      setErrors(newErrors);
      return Object.keys(newErrors).every(key => !newErrors[key]);
    };
  }, [state, validateField]);

  useEffect(() => {
    if (news) {
      setState(prevState => ({
        ...prevState,
        title: news?.title,
        desc: news?.description,
        img: news?.image,
        tags: news?.tags?.split(', '),
      }));
    }
  }, [news]);

  const isLocal = state.img.includes('file:///storage');
  const path = isLocal ? state.img : imgUrl + state.img;

  const translation = JSON.parse(catdata?.translations) || {};
  const userLang = loginUser?.user_lang;
  const name = translation[userLang] || translation?.en;

  return (
    <ScreenWrapper
      scrollEnabled
      paddingHorizontal={20}
      headerUnScrollable={() => <Header title={'News Details'} />}>
      {news && (
        <CustomText
          label={`Update your news`}
          fontFamily={fonts.bold}
          fontSize={16}
          marginTop={20}
          marginBottom={10}
        />
      )}

      <CustomText
        label={name}
        fontFamily={fonts.bold}
        fontSize={16}
        marginTop={20}
        marginBottom={10}
        color={colors.primaryColor}
      />

      <CustomInput
        withLabel={'Title'}
        value={state.title}
        onChangeText={e => handleInputChange('title', e)}
        error={errors.titleError}
      />

      <CustomInput
        withLabel={'Slug'}
        value={state.slug}
        onChangeText={e => handleInputChange('slug', e)}
        error={errors.slugError}
      />

      <UploadImage
        handleChange={e => handleImage(Array.isArray(e) ? e[0] : e)}
        renderButton={onPress => (
          <>
            <CustomText
              label={'News Image'}
              fontFamily={fonts.semiBold}
              fontSize={14}
            />
            <TouchableOpacity
              onPress={onPress}
              activeOpacity={0.6}
              style={styles.upload}>
              <CustomText
                label={'choose image'}
                fontFamily={fonts.semiBold}
                fontSize={15}
              />
            </TouchableOpacity>
          </>
        )}
      />
      {errors.imgError && state.img === '' && (
        <CustomText label={errors.imgError} color={colors.red} />
      )}
      {state.img && (
        <View style={styles.imgBox}>
          {imageLoading && (
            <View style={styles.loader}>
              <ActivityIndicator size={25} color={'#fff'} />
            </View>
          )}
          <Image source={{ uri: path }} style={styles.img} />
        </View>
      )}
      <CustomText
        label={'Tags'}
        fontFamily={fonts.semiBold}
        marginBottom={8}
        marginTop={10}
      />
      <View style={styles.row}>
        <CustomInput width={'82%'} value={tag} onChangeText={e => setTag(e)} />
        <TouchableOpacity
          style={[
            styles.addBtn,
            {
              backgroundColor: !tag.trim() ? colors.grey : colors.primaryColor,
            },
          ]}
          disabled={!tag.trim()}
          onPress={handleTags}>
          <Icons name={'add'} color={'#fff'} size={25} />
        </TouchableOpacity>
      </View>
      {errors.tagsError && state.tags.length === 0 && (
        <CustomText
          label={errors.tagsError}
          color={colors.red}
          marginBottom={10}
          marginTop={-10}
        />
      )}
      <View style={styles.tagContainer}>
        {state?.tags?.map((item, index) => (
          <View style={styles.tagBox} key={index}>
            <TouchableOpacity
              style={styles.crossIcon}
              onPress={() => handleRemoveTag(item)}>
              <Icons name={'close'} size={12} />
            </TouchableOpacity>
            <CustomText
              label={item}
              fontFamily={fonts.semiBold}
              fontSize={16}
            />
          </View>
        ))}
      </View>
      <CustomText
        label={'Description'}
        marginBottom={8}
        fontSize={14}
        fontFamily={fonts.semiBold}
        color={colors.black}
      />

      <RichEditor
        ref={richText}
        initialHeight={250}
        onChange={e => handleInputChange('desc', e)}
        initialContentHTML={state.desc}
      />

      <RichToolbar
        editor={richText}
        actions={[
          actions.heading1,
          actions.heading2,
          actions.heading3,
          actions.undo,
          actions.redo,
          actions.setStrikethrough,
          actions.insertOrderedList,
          actions.blockquote,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.code,
          actions.line,
          actions.foreColor,
          actions.hiliteColor,
        ]}
        iconMap={{
          [actions.heading1]: () => (
            <CustomText label="H1" fontFamily={fonts.semiBold} />
          ),
          [actions.heading2]: () => (
            <CustomText label="H2" fontFamily={fonts.semiBold} />
          ),
          [actions.heading3]: () => (
            <CustomText label="H3" fontFamily={fonts.semiBold} />
          ),
        }}
      />
      {errors.descError && (
        <CustomText
          label={errors.descError}
          color={colors.red}
          marginBottom={10}
          marginTop={5}
        />
      )}
      <View style={styles.footer}>
        <CustomButton
          title={'Next'}
          onPress={onsubmit}
          disabled={imageLoading}
        />
      </View>
    </ScreenWrapper>
  );
};

export default CreateNews;

const styles = StyleSheet.create({
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
    marginBottom: 5,
  },
  imgBox: {
    width: 70,
    height: 70,
    borderRadius: 10,
    margin: 10,
    backgroundColor: 'white',
    marginLeft: 0,
    marginRight: 20,
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
  footer: {
    marginVertical: 20,
  },
  addBtn: {
    width: 50,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryColor,
    borderRadius: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tagBox: {
    marginRight: 10,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.lightGrey,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginBottom: 10,
  },
  crossIcon: {
    position: 'absolute',
    top: -7,
    right: -7,
    backgroundColor: colors.grey1,
    zIndex: 1,
    padding: 2,
    borderRadius: 10,
    width: 17,
    height: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

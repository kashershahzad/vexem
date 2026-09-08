import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';

import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import CustomText from '../../../components/CustomText';
import LangBox from '../../../components/LangBox';
import Layout from '../../../components/Layout';
import { className } from '../../../global-styles';
import i18n from '../../../Language/i18n';
import ApiRequest from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';

const ChangeLanguage = () => {
  //

  const navigation = useNavigation();

  const { token, loginUser } = useSelector(store => store.user);

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [selected, setSelected] = useState('');
  const [newsLang, setNewsLang] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const fetchData = async () => {
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'languages',
      };

      const res = await ApiRequest(dataToGet);

      if (res.data?.data) {
        const array = res.data.data;
        const languages = array.filter(item => item.type === 'both');
        const languages1 = array.filter(
          item => item.type === 'both' || item.type === 'blog',
        );
        setData(languages);
        setData1(languages1);
      }
      setRefreshing(false);
    } catch (error) {
      console.log(error);
    }
  };
  const toggleLanguage = async () => {
    try {
      if (selected === 'ar') {
        await i18n.changeLanguage('ar');
      } else {
        await i18n.changeLanguage('en');
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const dataToUpdate = {
        type: 'update_data',
        table_name: 'users',
        id: token,
        user_lang: selected,
        news_lang: newsLang,
      };

      setLoading(true);
      const res = await ApiRequest(dataToUpdate);
      if (res.data?.result) {
        toggleLanguage();
        navigation.reset({ index: 0, routes: [{ name: 'MainStack' }] });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(loginUser)?.length > 0) {
      setSelected(loginUser?.user_lang || 'en');
      setNewsLang(loginUser?.news_lang || 'en');
    } else {
      setNewsLang('en');
      setSelected('en');
    }
    fetchData();
  }, [loginUser]);

  return (
    <Layout
      StatusBarBg={colors.white}
      title={'Language'}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      isRefresh
      footerComponent={
        <View style={className('my-4')}>
          <CustomButton
            title={'Done'}
            onPress={handleUpdate}
            loading={loading}
            disabled={loading}
          />
        </View>
      }>
      <View style={className('mt-7 align-center')}>
        <CustomText
          label={'Choose your language'}
          fontFamily={fonts.bold}
          fontSize={17}
        />
        <CustomText label={'lanDes'} textAlign={'center'} />
      </View>
      <CustomText
        label={'Select App Language'}
        fontFamily={fonts.semiBold}
        fontSize={15}
        marginTop={40}
      />
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <LangBox
            item={item}
            selected={item?.lang_code === selected ? true : false}
            onPress={() => setSelected(item?.lang_code)}
          />
        )}
      />
      <CustomText
        label={'Select News Language'}
        fontFamily={fonts.semiBold}
        fontSize={15}
        marginTop={40}
      />
      <FlatList
        data={data1}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <LangBox
            item={item}
            selected={item?.lang_code === newsLang ? true : false}
            onPress={() => setNewsLang(item?.lang_code)}
          />
        )}
      />
    </Layout>
  );
};

export default ChangeLanguage;

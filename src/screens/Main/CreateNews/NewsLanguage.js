import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import CustomText from '../../../components/CustomText';
import LangBox from '../../../components/LangBox';
import Layout from '../../../components/Layout';
import { className } from '../../../global-styles';
import ApiRequest from '../../../services/ApiRequest';

const NewsLanguage = ({ route }) => {
  const paramsData = route.params?.item;
  
  const news = route.params?.news;

  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState('');
  const [refreshing, setRefreshing] = useState(true);
  const [loading, setLoading] = useState(false);

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
        const languages = array.filter(
          item => item?.type === 'blog' || item?.type === 'both',
        );
        setData(languages);
      }
      setRefreshing(false);
    } catch (error) {
      console.log(error);
      setRefreshing(false);
    }
  };

  const handleCreateNews = async () => {
    try {
      let dataToSend = {
        type: news ? 'update_data' : 'add_data',
        table_name: 'blogs',
        lang_id: selected,
        ...paramsData,
      };

      if (news) {
        dataToSend.id = news?.id;
      }

      setLoading(true);
      const res = await ApiRequest(dataToSend);

      if (res?.data?.result) {
        navigation.navigate('SuccessScreen', {
          msg: news
            ? 'Your news updated successfully'
            : 'Your news created successfully',
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error, 'while creating news');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (news) {
      setSelected(news?.lang_id);
    }
  }, [news]);

  return (
    <Layout
      StatusBarBg="#fff"
      title={'Language'}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      isRefresh
      footerComponent={
        <View style={styles.footer}>
          <CustomButton
            title={news ? 'Update News' : 'Create News'}
            onPress={handleCreateNews}
            loading={loading}
            disabled={loading || !selected}
          />
        </View>
      }>
      <View style={className('mt-7 align-center')}>
        <CustomText
          label={'Choose news language'}
          fontFamily={fonts.bold}
          fontSize={17}
        />
      </View>
      <CustomText
        label={'Select Language'}
        fontFamily={fonts.semiBold}
        fontSize={15}
        marginTop={40}
      />
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <LangBox
            item={item}
            selected={item?.id === selected ? true : false}
            onPress={() => setSelected(item?.id)}
          />
        )}
      />
    </Layout>
  );
};

export default NewsLanguage;

const styles = StyleSheet.create({
  footer: {
    marginVertical: 10,
  },
});

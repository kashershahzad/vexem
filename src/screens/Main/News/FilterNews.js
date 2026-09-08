import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import EmptyComponent from '../../../components/EmptyComponent';
import Header from '../../../components/Header';
import ScreenWrapper from '../../../components/ScreenWrapper';
import ApiRequest from '../../../services/ApiRequest';
import NewsCard from './molecules/NewsCard';
import { useSelector } from 'react-redux';
import { colors } from '../../../utils/colors';
import Icons from '../../../components/Icons';
import fonts from '../../../assets/fonts';
import CustomText from '../../../components/CustomText';
import ImageFastWrapper from '../../../components/ImageFast';
import { imgUrl } from '../../../utils/constants';
import Customlistmodal from '../../../components/Customlistmodal';

const FilterNews = ({ navigation, route }) => {
  const { token, loginUser } = useSelector(store => store?.user);
  const cat_id = route.params?.cat_id;
  const focus = useIsFocused();

  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('');

  const onRefresh = () => {
    setRefreshing(false);
    fetchData();
    handleGetData();
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
        const languagesData = array.filter(
          item => item?.type === 'blog' || item?.type === 'both',
        );
        if (!selected) {
          const lang = loginUser?.news_lang || 'en';
          const language = languagesData?.find(
            item => item?.lang_code === lang,
          );
          setSelected(language?.id);
        }
        setLanguages(languagesData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetData = async () => {
    setRefreshing(true);
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'blogs',
        cat_id: cat_id,
        user_id: token,
        lang_id: selected,
      };

      const response = await ApiRequest(dataToGet);
      setData(response.data.data);
      setRefreshing(false);
    } catch (error) {
      console.log(error, 'err in blogs');
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchData();
    if (selected) {
      handleGetData();
    }
  }, [focus, selected]);

  return (
    <ScreenWrapper
      paddingBottom={12}
      scrollEnabled
      refreshControl={
        <RefreshControl
          onRefresh={onRefresh}
          refreshing={refreshing}
          colors={[colors.primaryColor]}
        />
      }
      headerUnScrollable={() => (
        <Header
          title={'News'}
          headerLeftIcon={
            <TouchableOpacity
              style={{ padding: 5, marginRight: 10 }}
              onPress={() => setVisible(true)}>
              <Icons name={'language'} family={'FontAwesome'} />
            </TouchableOpacity>
          }
        />
      )}>
      {data?.length === 0 || (data === undefined && <EmptyComponent />)}
      <View style={{ paddingTop: 20, flex: 1 }}>
        {data?.map(item => (
          <NewsCard
            key={item?.id}
            item={item}
            title={item?.tags}
            source={item?.image}
            onPress={() =>
              navigation.navigate('NewsDetails', {
                blogId: item?.id,
              })
            }
          />
        ))}
      </View>
      <Customlistmodal isVisible={visible} onDisable={() => setVisible(false)}>
        <View style={styles.main_container}>
          <View style={styles.btnClose} />
          <View style={styles.box}>
            <CustomText
              fontSize={16}
              label={'Select Language'}
              fontFamily={fonts.bold}
            />
          </View>
          {languages?.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.box}
              onPress={() => {
                setSelected(item?.id);
                setVisible(false);
              }}
              key={item?.id}>
              <View style={styles.row}>
                <ImageFastWrapper
                  source={{ uri: imgUrl + item?.image }}
                  style={styles.img}
                  svgH={30}
                  svgW={35}
                />
                <CustomText
                  label={item?.language}
                  fontFamily={fonts.semiBold}
                />
              </View>
              {item?.id === selected && (
                <Icons
                  name={'checkcircle'}
                  family={'AntDesign'}
                  color={colors.primaryColor}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Customlistmodal>
    </ScreenWrapper>
  );
};

export default FilterNews;

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: colors.white,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  box: {
    borderBottomWidth: 1,
    borderColor: colors.lightGrey,
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  btnClose: {
    backgroundColor: '#D9D9D9',
    width: 65,
    height: 7,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 10,
  },
  img: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 15,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

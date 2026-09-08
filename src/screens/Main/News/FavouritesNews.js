/* eslint-disable react/no-unstable-nested-components */
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Linking,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import fonts from '../../../assets/fonts';
import CustomText from '../../../components/CustomText';
import Customlistmodal from '../../../components/Customlistmodal';
import EmptyComponent from '../../../components/EmptyComponent';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import ImageFastWrapper from '../../../components/ImageFast';
import ScreenWrapper from '../../../components/ScreenWrapper';
import TopTab from '../../../components/TopTab';
import ApiRequest from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import { imgUrl } from '../../../utils/constants';
import CommunityCard from './molecules/CommunityCard';
import NewsCard from './molecules/NewsCard';
import { ToastMessage } from '../../../utils/ToastMessage';

const tabsData = [
  { name: 'Home', icon: 'home' },
  { name: 'Videos', icon: 'video-library' },
  { name: 'Community', icon: 'group' },
  { name: 'Categories', icon: 'dashboard' },
];

const FavouritesNews = ({ navigation, route }) => {
  const focus = useIsFocused();
  const { token, loginUser } = useSelector(state => state.user);

  const myAd = route.params?.myAd;
  const [tab, setTab] = useState(0);
  const [data, setData] = useState([]);

  
  const [banner, setBanner] = useState({});
  const [selected, setSelected] = useState('');
  const [visible, setVisible] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const onOpenLink = () => {
    try {
      const url = banner?.third_party_link;
      if (!url) {
        return ToastMessage('Unable to open url');
      }

      Linking.openURL(url);
    } catch (error) {
      console.log(error, 'err in open link');
    }
  };



  const handleGetData = async () => {
    try {
      const dataToGetAll = {
        type: 'get_data',
        table_name: 'blog_saves',
        specific_user: token,
        blog_id: 1,
      };
      const response = await ApiRequest(dataToGetAll);
      console.log(JSON.stringify(response?.data));
      

      setData(response?.data?.data);
      setRefreshing(false);
    } catch (error) {
      console.log(error, 'err in news');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    handleGetData();
  }, [focus])
  

  return (
    <ScreenWrapper
      scrollEnabled
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleGetData}
          colors={[colors.primaryColor]}
          tintColor={colors.primaryColor}
        />
      }
      paddingBottom={6}
      paddingHorizontal={0.1}
      headerUnScrollable={() => (
        <>
          <Header title={'Favourite News'} />
        </>
      )}>
      {banner?.image && (
        <TouchableOpacity
          onPress={onOpenLink}
          activeOpacity={0.5}
          disabled={banner?.third_party_link ? false : true}>
          <ImageFastWrapper
            source={{ uri: imgUrl + banner?.image }}
            style={[styles.adImg]}
          />
        </TouchableOpacity>
      )}
      {!refreshing && (
        <>
          {data?.map(item => (
            <View key={item?.id} style={{ paddingHorizontal: 20 }}>
              <NewsCard
                item={item?.blog}
                title={item?.blog?.tags}
                source={item?.blog?.image}
                onPress={() =>
                  navigation.navigate('NewsDetails', { blogId: item?.blog?.id })
                }
              />
            </View>
          ))}
        </>
      )}
      {data?.length === 0 && !refreshing  && <EmptyComponent />}
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

export default FavouritesNews;

const styles = StyleSheet.create({
  mapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },
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
  adImg: {
    height: 104,
    width: 350,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

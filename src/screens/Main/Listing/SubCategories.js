/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import fonts from '../../../assets/fonts';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import ImageFastWrapper from '../../../components/ImageFast';
import ScreenWrapper from '../../../components/ScreenWrapper';
import { colors } from '../../../utils/colors';
import EmptyComponent from '../../../components/EmptyComponent';
import { useSelector } from 'react-redux';
import SearchBar from '../../../components/SearchBar';

const SubCategories = ({ navigation, route }) => {
  const type = route.params?.type;
  const catData = route.params?.catData;
  const tabData = catData?.sub;
  const data1 =
    catData?.name === 'Properties' ? catData?.sub[0]?.sub : catData?.sub;
  const { loginUser } = useSelector(store => store?.user);

  const translation = JSON.parse(catData?.translations) || {};
  const userLang = loginUser?.user_lang;
  const grandParentName = translation[userLang] || translation?.en;

  const [tab, setTab] = useState(0);
  const [data, setData] = useState(data1);
  const [search, setSearch] = useState('');

  const handleSearch = e => {
    setSearch(e);
    const filteredData = data1?.filter(item =>
      item?.name?.toLowerCase()?.includes(e.toLowerCase()),
    );
    setData(filteredData);
  };

  const handlePress = item => {
    const isJobCat = item?.id === '40';

    const itemTranslation = JSON.parse(item?.translations) || {};

    const name = itemTranslation[userLang] || itemTranslation?.en;

    if (item?.sub) {
      navigation.navigate('SubSubCategory', {
        catData: item?.sub,
        type: type,
        grandParentName: grandParentName,
        parentName: name,
        parent: item,
        job: isJobCat ? 'yes' : '',
      });
    } else {
      type?.type === 'view'
        ? navigation.navigate('Result', { subCat: item })
        : navigation.navigate('CreateAd', {
            type,
            parentName: name,
            grandParentName: grandParentName,
            grandChild: '',
            id: item?.id,
            job: isJobCat ? 'yes' : '',
          });
    }
  };

  return (
    <>
      <ScreenWrapper
        paddingHorizontal={0.1}
        scrollEnabled
        statusBarColor="white"
        headerUnScrollable={() => <Header title={'Ad Listing'} />}>
        {type?.type !== 'view' && (
          <View style={{ paddingHorizontal: 22 }}>
            <CustomText
              label={'Select the category'}
              fontFamily={fonts.bold}
              fontSize={16}
              marginTop={20}
            />
            <View style={styles.head}>
              <Icons family={'Entypo'} name={'home'} size={20} />
              <Icons family={'Entypo'} name={'chevron-small-right'} size={16} />
              <CustomText
                label={grandParentName}
                fontFamily={fonts.regular}
                fontSize={13}
                numberOfLines={1}
              />
            </View>
          </View>
        )}
        <View style={styles.searchBox}>
          <SearchBar
            placeHolder={'Search...'}
            value={search}
            onChangeText={e => handleSearch(e)}
          />
        </View>
        {type?.type === 'view' && (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.main_map}
            onPress={() =>
              navigation.navigate('Result', {
                subCat: catData,
              })
            }>
            <View style={styles.box}>
              <CustomText label={`See all in`} />
              <CustomText
                label={` ${grandParentName} `}
                fontFamily={fonts.semiBold}
                fontSize={16}
                numberOfLines={1}
              />
            </View>
            <View style={styles.icn}>
              <Icons family={'AntDesign'} name={'right'} />
            </View>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          {catData?.name === 'Properties' && (
            <View style={styles.tabContainer}>
              {tabData?.map((item, index) => (
                <TouchableOpacity
                  style={[
                    styles.tab,
                    {
                      backgroundColor:
                        tab === index ? colors.lightBlue : '#fff',
                    },
                  ]}
                  activeOpacity={0.5}
                  onPress={() => {
                    setTab(index);
                    setData(item?.sub);
                  }}>
                  <CustomText
                    translation
                    label={item?.translations}
                    fontFamily={fonts.semiBold}
                    fontSize={16}
                    numberOfLines={1}
                    color={tab === index ? '#fff' : '#000'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
          {data?.length > 0 ? (
            data.map((item, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.6}
                  key={index}
                  style={styles.main_map}
                  onPress={() => handlePress(item)}>
                  <View style={styles.box}>
                    <ImageFastWrapper
                      source={{ uri: item?.image }}
                      style={styles.img}
                      svgW={35}
                      svgH={35}
                      marginRight={15}
                    />
                    <CustomText
                      translation
                      label={item?.translations}
                      fontFamily={fonts.regular}
                      fontSize={16}
                      numberOfLines={1}
                    />
                  </View>
                  <View style={styles.icn}>
                    <Icons family={'AntDesign'} name={'right'} />
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={{ flex: 1, marginTop: '-30%' }}>
              <EmptyComponent />
            </View>
          )}
        </View>
      </ScreenWrapper>
    </>
  );
};

export default SubCategories;

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 5,
    flexWrap: 'wrap',
  },
  main_map: {
    backgroundColor: colors.white,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    borderBottomColor: colors?.mainBg,
    borderBottomWidth: 2,
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
  img: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginRight: 15,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 30,
  },
  headerBtn: {
    padding: 5,
    right: 5,
    top: 2,
  },
  searchBox: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 22,
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.white,
  },
  tab: {
    width: '33.3%',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderColor: colors.grey1,
    borderTopWidth: 0.5,
  },
  indicator: {
    height: 3,
    width: '60%',
    marginVertical: 2,
    backgroundColor: colors.primaryColor,
  },
});

/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import fonts from '../../../assets/fonts';
import CustomText from '../../../components/CustomText';
import EmptyComponent from '../../../components/EmptyComponent';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import ImageFastWrapper from '../../../components/ImageFast';
import ScreenWrapper from '../../../components/ScreenWrapper';
import SearchBar from '../../../components/SearchBar';
import { colors } from '../../../utils/colors';

const SubSubCategory = ({ navigation, route }) => {
  const { loginUser } = useSelector(store => store?.user);

  const { parentName, type, parent, job, grandParentName } = route?.params;
  const data1 = route.params?.catData || [];

  const [data, setData] = useState(data1);
  const [search, setSearch] = useState('');

  const handleSearch = e => {
    setSearch(e);
    const filteredData = data1?.filter(item =>
      item?.name?.toLowerCase()?.includes(e.toLowerCase()),
    );
    setData(filteredData);
  };

  const categoryWithSeeAll = [...data];

  if (type.type === 'view') {
    categoryWithSeeAll.unshift({ id: 0.1, name: 'See More' });
  }

  const handleSelect = item => {
    const translation = JSON.parse(item?.translations) || {};
    const userLang = loginUser?.user_lang;
    const name = translation[userLang] || translation?.en;

    if (item?.sub) {
      navigation.navigate('SubSubSubCategory', {
        catData: item?.sub,
        type: type,
        parentName: parentName,
        childName: name,
        parent: item,
        job: job,
        grandParentName,
      });
    } else {
      type?.type === 'view'
        ? navigation.navigate('Result', { subCat: item })
        : navigation.navigate('CreateAd', {
            type,
            parentName,
            childName: name,
            grandChild: '',
            id: item?.id,
            job,
            grandParentName,
          });
    }
  };

  return (
    <>
      <ScreenWrapper
        paddingHorizontal={0.1}
        statusBarColor="white"
        scrollEnabled
        headerUnScrollable={() => <Header title={'Ad Listing'} />}>
        {type.type !== 'view' && (
          <View style={{ paddingHorizontal: 22 }}>
            <CustomText
              label={'Select the category'}
              fontFamily={fonts.bold}
              fontSize={16}
              marginTop={20}
            />

            <View style={styles.head}>
              <Icons family={'Entypo'} name={'home'} size={20} />
              <Icons family={'Entypo'} name={'chevron-small-right'} size={12} />
              <CustomText
                label={grandParentName}
                fontFamily={fonts.regular}
                fontSize={12}
                color={colors.primaryColor}
              />
              <Icons family={'Entypo'} name={'chevron-small-right'} size={12} />
              <CustomText
                label={parentName}
                fontFamily={fonts.regular}
                fontSize={12}
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
        <View style={{ marginTop: 8, flex: 1 }}>
          {categoryWithSeeAll.length > 0 ? (
            categoryWithSeeAll.map((item, index) =>
              item?.id === 0.1 ? (
                <TouchableOpacity
                  activeOpacity={0.6}
                  key={index}
                  style={styles.main_map}
                  onPress={() =>
                    navigation.navigate('Result', {
                      subCat: parent,
                    })
                  }>
                  <View style={styles.box}>
                    <CustomText
                      label={`See all in`}
                      fontFamily={fonts.regular}
                      fontSize={16}
                      numberOfLines={1}
                    />
                    <CustomText
                      label={` ${parentName} `}
                      fontFamily={fonts.regular}
                      fontSize={16}
                      numberOfLines={1}
                    />
                  </View>
                  <View style={styles.icn}>
                    <Icons family={'AntDesign'} name={'right'} />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.6}
                  key={index}
                  style={styles.main_map}
                  onPress={() => handleSelect(item)}>
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
              ),
            )
          ) : (
            <View style={{ marginTop: '-30%', flex: 1 }}>
              <EmptyComponent />
            </View>
          )}
        </View>
      </ScreenWrapper>
    </>
  );
};

export default SubSubCategory;

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
});

/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import fonts from '../../../assets/fonts';
import CustomText from '../../../components/CustomText';
import EmptyComponent from '../../../components/EmptyComponent';
import Header from '../../../components/Header';
import ScreenWrapper from '../../../components/ScreenWrapper';
import ApiRequest from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import CatCard from './molecules/CatCard';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '../../../store/reducer/categorySlice';
import SearchBar from '../../../components/SearchBar';
import Icons from '../../../components/Icons';

const Categories = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const type = route.params;

  const { categories } = useSelector(store => store.category);

  const [search, setSearch] = useState('');
  const [data, setData] = useState(categories);
  const [visible, setVisible] = useState(false);
  const [data1, setData1] = useState(categories);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handlePress = item => {
    navigation.navigate('SubCategories', { catData: item, type: type });
  };

  const handleSearch = e => {
    setSearch(e);
    const filteredData = data1?.filter(item =>
      item?.name?.toLowerCase()?.includes(e.toLowerCase()),
    );
    setData(filteredData);
  };

  const fetchData = async () => {
    try {
      const response = await ApiRequest({ type: 'get_categories' });
      if (response.data.result) {
        setData(response.data.category);
        setData1(response.data.category);
        dispatch(setCategories(response.data.category));
      }
      setRefreshing(false);
    } catch (error) {
      console.log(error, 'err in categories');
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setData(
      categories?.filter(item =>
        type?.type === 'auction'
          ? item?.auction === '1'
          : type?.type === 'ad'
          ? item?.regular === '1'
          : item,
      ),
    );
    setData1(
      categories?.filter(item =>
        type?.type === 'auction'
          ? item?.auction === '1'
          : type?.type === 'ad'
          ? item?.regular === '1'
          : item,
      ),
    );
  }, [type, categories]);

  return (
    <ScreenWrapper
      paddingHorizontal={0.001}
      scrollEnabled
      headerUnScrollable={() => (
        <Header
          title={'Categories'}
          headerLeftIcon={
            <TouchableOpacity
              style={{ padding: 5, marginRight: 10 }}
              onPress={() => setVisible(!visible)}>
              <Icons name={'search'} family={'Feather'} />
            </TouchableOpacity>
          }
        />
      )}>
      {visible && (
        <View style={styles.searchBox}>
          <SearchBar
            placeHolder={'Search...'}
            value={search}
            onChangeText={e => handleSearch(e)}
          />
        </View>
      )}
      <CustomText
        label={'Select the category'}
        marginTop={20}
        fontFamily={fonts.semiBold}
        marginBottom={12}
        marginLeft={20}
      />
      <FlatList
        data={data}
        numColumns={3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primaryColor]}
          />
        }
        columnWrapperStyle={{ flexWrap: 'wrap' }}
        contentContainerStyle={{ paddingHorizontal: 12, flex: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!refreshing && EmptyComponent}
        renderItem={({ item, index }) => (
          <CatCard
            key={item?.id}
            source={item?.image}
            title={item?.translations}
            item={item}
            onPress={() => handlePress(item)}
          />
        )}
      />
    </ScreenWrapper>
  );
};

export default Categories;

const styles = StyleSheet.create({
  searchBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 22,
    marginTop: 20,
  },
});

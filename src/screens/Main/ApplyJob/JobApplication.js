import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../../components/ScreenWrapper';
import Header from '../../../components/Header';
import { colors } from '../../../utils/colors';
import ImageFastWrapper from '../../../components/ImageFast';
import { Images } from '../../../assets/images';
import CustomText from '../../../components/CustomText';
import fonts from '../../../assets/fonts';
import Icons from '../../../components/Icons';
import { useSelector } from 'react-redux';
import ApiRequest from '../../../services/ApiRequest';
import { Image } from 'react-native';
import EmptyComponent from '../../../components/EmptyComponent';
import { useIsFocused } from '@react-navigation/native';
const height = Dimensions.get('screen').height;
const JobApplication = ({ navigation }) => {
  const isfocued = useIsFocused();
  const [ApplicationData, setApplicationData] = useState([]);

  const [refreshing, setrefreshing] = useState(true);
  const { token } = useSelector(store => store.user);

  const getJobAdds = async () => {
    const body = {
      type: 'get_data',
      table_name: 'items',
      job: '1',
      limit: '100',
      specific_user: token,
    };
    const res = await ApiRequest(body);

    setApplicationData(res?.data?.data);
    setrefreshing(false);
  };

  useEffect(() => {
    getJobAdds();
  }, [isfocued]);

  return (
    <ScreenWrapper
      scrollEnabled
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={getJobAdds}
          colors={[colors.primaryColor]}
        />
      }
      headerUnScrollable={() => <Header title={'Job Application'} />}>
      <View>
        <FlatList
          data={ApplicationData}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                height: height - 100,
              }}>
              <EmptyComponent title={'No Job Application Found'} />
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.container}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('JobApplicationList', { ad_Id: item?.id })
              }>
              <ImageFastWrapper
                source={{ uri: item?.image }}
                resizeMode={'cover'}
                style={styles.jobCover}
              />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Detail', { itemId: item?.id })
                }
                style={styles.applicants1}>
                <Icons
                  name={'eye'}
                  family={'Entypo'}
                  size={20}
                  color={colors.white}
                />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: 100,
                }}>
                <CustomText
                  label={item?.name}
                  numberOfLines={2}
                  width={220}
                  fontSize={17}
                  fontFamily={fonts.semiBold}
                />
                <View style={styles.applicants}>
                  <CustomText
                    label={`${item?.job_applications} Applications`}
                    fontSize={14}
                    fontFamily={fonts.semiBold}
                  />
                  <Icons name={'right'} family={'AntDesign'} size={15} />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenWrapper>
  );
};

export default JobApplication;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: 20,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  jobCover: {
    width: 124,
    height: 123,
    borderRadius: 7,
  },

  applicants: {
    backgroundColor: '#D9FFDBDE',
    width: 140,
    height: 31,
    borderRadius: 16,
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 30,
    height: 30,
    marginRight: 15,
  },

  applicants1: {
    backgroundColor: colors.primaryColor,
    padding: 4,
    borderRadius: 100,
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1000,
  },
});

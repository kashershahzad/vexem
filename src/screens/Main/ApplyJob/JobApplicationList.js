import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../../components/ScreenWrapper';
import Header from '../../../components/Header';
import CustomText from '../../../components/CustomText';
import { colors } from '../../../utils/colors';
import ApplicantCard from './Molecules/ApplicantCard';
import ApiRequest from '../../../services/ApiRequest';
import { useIsFocused, useRoute } from '@react-navigation/native';
import EmptyComponent from '../../../components/EmptyComponent';
const height = Dimensions.get('screen').height;
const JobApplicationList = () => {
  const route = useRoute();
  const [Refresh, setRefresh] = useState(true);
  const adId = route.params?.ad_Id;
  const [Slected, setSlected] = useState(1);
  const [ListLength, setListLength] = useState('');
  const [jobAplication, setjobAplication] = useState([]);
  const [ListLengthShot, setListLengthShot] = useState('');
  const isfocus = useIsFocused();

  const getAplicationList = async () => {
    const body = {
      type: 'get_data',
      table_name: 'job_applications',
      ad_id: adId,
      limit: 100,
    };

    const res = await ApiRequest(body);
    const allData = res?.data?.data || [];

    const pendingList = allData.filter(item => item.status === 'pending');
    const waitlist = allData.filter(item => item.status === 'waitlist');

    setListLength(pendingList.length);
    setListLengthShot(waitlist.length);

    const filteredApplications = Slected === 1 ? pendingList : waitlist;
    setjobAplication(filteredApplications);
    setRefresh(false);
  };

  const ChnageStatus = async data => {
    setRefresh(true);
    const body = {
      type: 'update_data',
      table_name: 'job_applications',
      id: data,
      status: 'waitlist',
    };

    const res = await ApiRequest(body)
    if (res?.data?.result) {
      getAplicationList();
    }
  };

  const ChnageStatusGenral = async data => {
    setRefresh(true);
    const body = {
      type: 'update_data',
      table_name: 'job_applications',
      id: data,
      status: 'pending',
    };

    const res = await ApiRequest(body)
    if (res?.data?.result) {
      getAplicationList();
    }
  };


  

  useEffect(() => {
    getAplicationList();
  }, [isfocus, Slected]);

  const tabs = [
    { id: 1, name: `General (${ListLength})` },
    { id: 2, name: `Shortlisted (${ListLengthShot})` },
  ];

  return (
    <ScreenWrapper
      scrollEnabled
      refreshControl={
        <RefreshControl refreshing={Refresh} onRefresh={getAplicationList} />
      }
      headerUnScrollable={() => <Header title={'Job Application'} />}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        {tabs.map((item, index) => (
          <>
            <TouchableOpacity
              onPress={() => setSlected(item?.id)}
              style={[
                styles.tabs,
                { backgroundColor: Slected === item?.id ? '#A38CB6' : '#fff' },
              ]}>
              <CustomText
                label={item?.name}
                fontSize={18}
                color={Slected === item?.id ? '#fff' : colors.black}
              />
            </TouchableOpacity>
          </>
        ))}
      </View>

      <FlatList
        data={jobAplication}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: 'center', height: height / 2 }}>
            <EmptyComponent title={'No Job Application Found'} />
          </View>
        }
        renderItem={({ item }) => {
          let parsedJobData = {};

          try {
            if (item?.job_data) {
              parsedJobData = JSON.parse(item?.profile?.extra_data);
            }
          } catch (e) {
            console.warn('Error parsing job_data:', e);
          }

          return (
            <ApplicantCard
              tab={Slected}
              onChnage={() => ChnageStatus(item?.id)}
              alldata={item}
              onChnageGenral={() => ChnageStatusGenral(item?.id)}
              jobData={parsedJobData}
            />
          );
        }}
      />
    </ScreenWrapper>
  );
};

export default JobApplicationList;

const styles = StyleSheet.create({
  tabs: {
    borderRadius: 7,
    height: 37,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

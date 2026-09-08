import React from 'react';
import { StyleSheet } from 'react-native';
import { Images } from '../../../assets/images';
import Header from '../../../components/Header';
import ScreenWrapper from '../../../components/ScreenWrapper';
import SubCatCard from '../Categories/molecules/SubCatCard';

const JobCategory = ({ navigation, route }) => {
  const data = [
    {
      id: 1,
      name: 'I am a Recruiter',
      source: Images.Job,
      navigation: 'Recruiter',
    },
    {
      id: 2,
      name: 'I am a Job seeker',
      source: Images.seeker,
      navigation: 'Jobs',
    },
  ];
  const router = value => {
    navigation.navigate('JobSubCategory', { jobtype: value });
  };
  return (
    <ScreenWrapper
      statusBarColor="white"
      paddingHorizontal={1}
      headerUnScrollable={() => <Header title={'Job seeking and hiring'} />}>
      {data.map((item, index) => (
        <SubCatCard
          key={index}
          title={item?.name}
          image={item.source}
          marginTop={5}
          onPress={() => router(item?.navigation)}
        />
      ))}
    </ScreenWrapper>
  );
};

export default JobCategory;

const styles = StyleSheet.create({});

/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import CustomButton from '../../../components/CustomButton';
import Layout from '../../../components/Layout';
import { className } from '../../../global-styles';
import { colors } from '../../../utils/colors';
import fonts from '../../../assets/fonts';
import CustomText from '../../../components/CustomText';
import { setUserType } from '../../../store/reducer/usersSlice';

import { Images } from '../../../assets/images';

const GetStarted = () => {
  //

  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <Layout
      showNavBar={false}
      isScroll={false}
      layoutContainer={className('px-0')}
      containerStyle={className('bg-white')}>
      <Image source={Images.logo} style={styles.logo} />
      <View style={className('flex-1')}>
        <Image
          source={Images.getStarted}
          style={styles.img}
          resizeMethod="scale"
        />
      </View>
      <View
        style={[
          className(
            'bg-white mb-6 bor-t-1 pt-5 px-6 border-t-grey1 position-absolute b w-full',
          ),
          { bottom: 0 },
        ]}>
        <CustomText
          label={'Find right people'}
          textAlign={'center'}
          fontSize={20}
          fontFamily={fonts.semiBold}
          marginTop={10}
          marginBottom={10}
          alignSelf={'center'}
        />
        <CustomText
          label={
            'Post job listings to find the perfect technicians for the task.'
          }
          alignSelf={'center'}
          textAlign={'center'}
          fontSize={16}
          fontFamily={fonts.regular}
          marginBottom={10}
          paddingHorizontal={15}
        />
        <CustomButton
          title={'Technician'}
          onPress={() => {
            dispatch(setUserType('technician'));
            navigation.navigate('Login');
          }}
        />
        <CustomButton
          title={'Office'}
          customStyle={[className('bg-white mt-2 bor-1')]}
          btnColor={[colors.white, colors.white]}
          customText={className('text-black')}
          onPress={() => {
            dispatch(setUserType('office'));
            navigation.navigate('Login');
          }}
        />
      </View>
    </Layout>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  logo: {
    width: 60,
    height: 60,
    alignSelf: 'flex-end',
    resizeMode: 'center',
    marginRight: 30,
    marginBottom: 30,
  },
  img: {
    width: '80%',
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'stretch',
  },
});

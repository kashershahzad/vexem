import React from 'react';
import { Image, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import Layout from '../../../components/Layout';
import fonts from '../../../assets/fonts';
import CustomText from '../../../components/CustomText';
import { className } from '../../../global-styles';

import { Images } from '../../../assets/images';
import CustomButton from '../../../components/CustomButton';

const EmailMessage = () => {
  //

  const { params } = useRoute();
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('VerifyUser', {
      email: params?.email,
      id: params?.id,
    });
  };

  return (
    <Layout StatusBarBg="#fff">
      <View style={className('justify-center align-center flex-1')}>
        <Image source={Images.mailIcon} style={className('w-90 h-60')} />
        <CustomText
          label={'Code Sent Successfully!'}
          fontFamily={fonts.semiBold}
          fontSize={18}
          marginTop={20}
        />
        <CustomText label={'We sent a code to your email'} />
        <CustomText label={`${params?.email}`} fontFamily={fonts.semiBold} />
        <CustomButton
          title={'Verify'}
          customStyle={className('my-8')}
          onPress={handlePress}
        />
      </View>
    </Layout>
  );
};

export default EmailMessage;

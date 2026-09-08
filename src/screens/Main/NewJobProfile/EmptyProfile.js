import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ImageFastWrapper from '../../../components/ImageFast';
import { Images } from '../../../assets/images';
import CustomText from '../../../components/CustomText';
import fonts from '../../../assets/fonts';
import CustomButton from '../../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../utils/colors';

const EmptyProfile = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <ImageFastWrapper
        source={Images.NoJobProfile}
        resizeMode="contain"
        style={styles.img}
      />
      <CustomText
        label={'Please create a profile to apply for a job now!'}
        fontFamily={fonts.semiBold}
        color={colors.black}
        fontSize={16}
        marginTop={20}
        marginBottom={20}
      />
      <CustomText
        label={'Apply for jobs next time in just two clicks!!'}
        fontFamily={fonts.semiBold}
        color={colors.grey}
        fontSize={14}
        marginBottom={20}
      />
      <CustomButton
        title={'Add New Job Profile'}
        fontSize={14}
        iconFamily={'Ionicons'}
        onPress={() => navigation.navigate('ProfileIntro')}
        iconName={'add'}
        iconColor={colors.grey}
        backgroundColor={colors.grey3}
        fontFamily={fonts.semiBold}
        width="90%"
        color={colors.grey}
        customStyle={styles.button}
      />
    </View>
  );
};

export default EmptyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: '100%',
    height: 318,
  },
  button: {
    borderColor: colors.grey2,
    borderWidth: 1,
    borderRadius: 7,
  },
});

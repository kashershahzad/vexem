import React, { useEffect } from 'react';
import { BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native';

import fonts from '../../assets/fonts';
import { Images } from '../../assets/images';
import CustomText from '../../components/CustomText';
import ImageFast from '../../components/ImageFast';
import ScreenWrapper from '../../components/ScreenWrapper';
import { colors } from '../../utils/colors';

const SuccessScreen = ({ navigation, route }) => {
  //

  const msg = route.params?.msg;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('TabStack');
        return true;
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <ScreenWrapper statusBarColor={colors.white} backgroundColor="#fff">
      <View style={styles.mainContainer}>
        <ImageFast
          source={Images.successGif}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.box}>
          <CustomText
            label="Congratulation"
            fontFamily={fonts.semiBold}
            fontSize={20}
            color={colors.primaryColor}
            textAlign="center"
          />
          <CustomText
            label={msg || 'Your ad submitted successfully'}
            fontFamily={fonts.regular}
            fontSize={14}
            color={colors.black}
            textAlign="center"
            numberOfLines={2}
            width={200}
            marginTop={10}
            marginBottom={30}
          />
          {/* <TouchableOpacity
            style={styles.btnback}
            onPress={() => navigation.navigate('Home')}>
            <CustomText
              label="View"
              fontFamily={fonts.regular}
              fontSize={16}
              color={colors.primaryColor}
              textAlign="center"
            />
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => navigation.navigate('TabStack')}
            style={styles.home}>
            <CustomText
              label="Back to Home"
              fontFamily={fonts.regular}
              fontSize={14}
              color={colors.black}
              textAlign="center"
              textDecorationLine={'underline'}
              marginTop={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  btnback: {
    backgroundColor: 'white',
    width: '50%',
    height: 40,
    borderWidth: 1,
    borderColor: colors.primaryColor,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  home: {
    textDecorationLine: 'underline',
  },
  box: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

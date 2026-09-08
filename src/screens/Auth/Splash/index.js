import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import { Images } from '../../../assets/images';

const Splash = () => {
  const navigation = useNavigation();

  const logoPosition = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    Animated.timing(logoPosition, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [logoPosition]);

  const handleNavigate = useCallback(async () => {
    if (!navigation.isFocused()) {
      return false;
    }

    navigation.reset({ index: 0, routes: [{ name: 'MainStack' }] });
  }, [navigation]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleNavigate();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [handleNavigate]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <Animated.Image
        source={Images.newLogo}
        style={[styles.logo, { transform: [{ translateX: logoPosition }] }]}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 150,
    resizeMode: 'contain',
    // tintColor: "#21103D"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#E8E0D4"
  },
});

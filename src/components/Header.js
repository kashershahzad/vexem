import { useNavigation, CommonActions } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  BackHandler,
} from 'react-native';
import fonts from '../assets/fonts';
import { className } from '../global-styles';
import { colors } from '../utils/colors';
import CustomText from './CustomText';
import Icons from './Icons';
import { Companybadge, Officalbadge } from '../assets/images';

const Header = ({
  headerLeftIcon,
  title,
  headerColor = colors.white,
  isjob,
  isbadge,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (isjob) {
      Alert.alert(
        'Confirm Navigation',
        'Are you sure you want to go back?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => performNavigation(),
          },
        ],
        { cancelable: false },
      );
    } else {
      performNavigation();
    }
  };
  useEffect(() => {
    const onBackPress = () => {
      if (isjob) {
        Alert.alert(
          'Confirm Navigation',
          'Are you sure you want to go back?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => null,
            },
            {
              text: 'Yes',
              onPress: () => performNavigation(),
            },
          ],
          { cancelable: false },
        );
        return true; // 👈 Prevent default back behavior
      }
      return false; // 👈 Allow default back if not a job screen
    };
  
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
  
    return () => backHandler.remove(); // 👈 Clean up the listener
  }, [isjob]); // 👈 Run when `isjob` changes

  const performNavigation = () => {
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainStack' }],
          }),
        );
  };

  return (
    <View style={[styles.header, { backgroundColor: headerColor }]}>
      <View style={className('flex align-center')}>
        <TouchableOpacity style={styles.arrowBtn} onPress={handleBackPress}>
          <Icons name="arrow-left" size={22} family={'FontAwesome5'} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <CustomText label={title} fontFamily={fonts.semiBold} fontSize={18} />
          {isbadge && (
            <>
              {isbadge === 'company' ? (
                <Companybadge height={25} width={25} />
              ) : isbadge === 'official' ? (
                <Officalbadge height={25} width={25} />
              ) : null}
            </>
          )}
        </View>
      </View>
      {headerLeftIcon}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    zIndex: 1,
    paddingBottom: Platform.OS === 'ios' ? 10 : 5,
  },
  arrowBtn: {
    zIndex: 1,
    padding: 8,
    marginRight: 10,
  },
});

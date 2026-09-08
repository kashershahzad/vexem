import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import { useDispatch } from 'react-redux';
import { className } from '../global-styles';
import { userLogout } from '../store/reducer/usersSlice';
import { colors } from '../utils/colors';
import CustomText from './CustomText';

const LogoutSheet = ({ bottomSheetRef }) => {
  //

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    bottomSheetRef.current.close();
    // await GoogleSignin.signOut();
    setTimeout(() => {
      dispatch(userLogout());
      navigation.reset({ index: 0, routes: [{ name: 'AuthStack' }] });
    }, 200);
  };

  return (
    <RBSheet
      ref={bottomSheetRef}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        draggableIcon: {
          backgroundColor: '#000',
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 20,
          height: 180,
        },
      }}>
      <View style={className('flex-1')}>
        <CustomText
          alignSelf={'center'}
          label={'Hold On!'}
          textStyle={className(
            'text-base text-black text-bold text-center my-5',
          )}
        />
        <CustomText
          textStyle={className('text-15 text-black text-center')}
          alignSelf={'center'}
          label={'logoutDes'}
        />
      </View>
      <View style={className('flex-row justify-between mb-5')}>
        <TouchableOpacity
          onPress={() => bottomSheetRef.current?.close()}
          style={[styles.Btn, className('bg-white bor-1')]}>
          <CustomText
            fontSize={15}
            label={'Cancel'}
            color={colors.primaryColor}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.Btn} onPress={handleLogout}>
          <CustomText fontSize={15} label={'Logout'} color={colors.white} />
        </TouchableOpacity>
      </View>
    </RBSheet>
  );
};

export default LogoutSheet;

const styles = StyleSheet.create({
  Btn: {
    width: '46%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: colors.primaryColor,
    backgroundColor: colors.primaryColor,
  },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';

import CustomButton from '../../../../../components/CustomButton';
import CustomModal from '../../../../../components/CustomModal';
import CustomText from '../../../../../components/CustomText';

import fonts from '../../../../../assets/fonts';
import { className } from '../../../../../global-styles';
import { colors } from '../../../../../utils/colors';

const DeleteAccountModal = ({ isVisible, onPress, StayLoggedIn, loading }) => {
  return (
    <CustomModal isChange isVisible={isVisible} onDisable={StayLoggedIn}>
      <View style={styles.mainContainer}>
        <CustomText
          label="delDes"
          fontFamily={fonts.boldExtra}
          fontSize={16}
          marginTop={12}
          marginBottom={22}
          alignSelf={'center'}
        />

        <CustomButton
          title="No,Stay Logged In"
          marginBottom={10}
          onPress={StayLoggedIn}
        />
        <CustomButton
          title="Yes, Delete My Account"
          marginBottom={10}
          onPress={onPress}
          loading={loading}
          disabled={loading}
          color={colors.red}
          indicatorcolor={colors.red}
          customStyle={className('bg-white bor-1 border-danger')}
          customText={className('text-danger')}
        />
      </View>
    </CustomModal>
  );
};
export default DeleteAccountModal;
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.white,
    padding: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    //alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 25,
    height: 25,
  },
});

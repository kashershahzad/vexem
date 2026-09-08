import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';

import CustomButton from '../../../../components/CustomButton';
import CustomModal from '../../../../components/CustomModal';
import CustomText from '../../../../components/CustomText';

import { ToastMessage } from '../../../../utils/ToastMessage';
import { useNavigation } from '@react-navigation/native';
import ApiRequest from '../../../../services/ApiRequest';
import { colors } from '../../../../utils/colors';
import fonts from '../../../../assets/fonts';
import Icons from '../../../../components/Icons';

const TermsModal = ({
  isVisible,
  onDisable,
  handleDeletePress,
  refreshing,
  Terms,
}) => {
  const navigation = useNavigation();
  return (
    <CustomModal isChange isVisible={isVisible} onDisable={onDisable}>
      <View style={styles.mainContainer}>
        <Icons
          name={'cross'}
          family={'Entypo'}
          onPress={onDisable}
          size={30}
          alignSelf={'flex-end'}
        />
        <CustomText
          label="Terms & Condtions"
          fontFamily={fonts.boldExtra}
          fontSize={16}
          textAlign="center"
          alignSelf={'center'}
          marginBottom={24}
        />

        <CustomButton
          title={`View Terms & Condition`}
          marginBottom={10}
          onPress={Terms}
          backgroundColor={'transparent'}
          customStyle={{
            borderColor: colors.primaryColor,
            borderWidth: 1,
          }}
          color={colors.primaryColor}
        />

        <CustomButton
          title={`I agree biding terms and condition`}
          marginBottom={10}
          onPress={handleDeletePress}
          disabled={refreshing}
          loading={refreshing}
        />
      </View>
    </CustomModal>
  );
};

export default TermsModal;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.white,
    padding: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 20,
  },
  image: {
    width: 25,
    height: 25,
  },
});

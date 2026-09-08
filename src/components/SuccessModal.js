import React from 'react';
import Modal from 'react-native-modal';
import fonts from '../assets/fonts';
import CustomButton from './CustomButton';
import CustomText from './CustomText';
import { Image, StyleSheet, View } from 'react-native';
import { Images } from '../assets/images';
import { className } from '../global-styles';

const SuccessModal = ({
  isVisible,
  transparent = true,
  onDisable,
  onPress,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      transparent={transparent}
      onBackdropPress={onDisable}
      onBackButtonPress={onDisable}
      onDismiss={onDisable}>
      <View style={styles.container}>
        <Image source={Images.mapPin} style={styles.icon} />
        <CustomText
          label={'Job Create Successfully'}
          fontFamily={fonts.semiBold}
          fontSize={18}
          marginBottom={20}
          marginTop={20}
        />
        <CustomButton
          title={'Close'}
          customStyle={className('w-70')}
          onPress={onPress}
        />
      </View>
    </Modal>
  );
};

export default SuccessModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  icon: {
    width: 70,
    height: 70,
  },
});

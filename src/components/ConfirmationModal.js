/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../utils/colors';
import CustomButton from './CustomButton';
import CustomText from './CustomText';
import Icons from './Icons';
import fonts from '../assets/fonts';

const ConfirmationModal = ({
  visible,
  hideModal,
  onPress,
  message,
  loading,
}) => {
  return (
    <Modal
      visible={visible}
      onBackdropPress={hideModal}
      onBackButtonPress={hideModal}
      style={{ margin: 0 }}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.btn} onPress={hideModal}>
            <Icons
              name="closecircle"
              color={colors.black}
              size={25}
              family={'AntDesign'}
            />
          </TouchableOpacity>
          <CustomText
            label={'Attention'}
            alignSelf={'center'}
            fontFamily={fonts.bold}
            fontSize={17}
            marginBottom={10}
          />
          <CustomText
            label={message}
            alignSelf={'center'}
            textAlign={'center'}
            fontSize={16}
            marginBottom={30}
          />
          <View style={styles.row}>
            <CustomButton
              title={'Cancel'}
              customStyle={{
                width: '47%',
                backgroundColor: colors.white,
                borderWidth: 1,
                borderColor: colors.gray2,
              }}
              customText={{ color: colors.black }}
              onPress={hideModal}
            />
            <CustomButton
              title={'Sure'}
              customStyle={{ width: '47%' }}
              onPress={onPress}
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000009E',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  contentContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
  },
  btn: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 30,
    height: 30,
    borderWidth: 1,
  },
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

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

const DeleteModal = ({ isVisible, item, goBack, type }) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const handleDeletePress = async () => {
    setRefreshing(true);
    try {
      const dataToGet = {
        type: 'update_data',
        table_name: 'items',
        status: 'deleted',
        id: item,
      };
      const response = await ApiRequest(dataToGet);
      console.log('res', response.data);
      if (response.data.result) {
        goBack();
        ToastMessage('Item deleted');
        setTimeout(() => {
          navigation.goBack();
        }, 800);
      }
    } catch (error) {
      console.log(error, 'err in deleting ad');
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <CustomModal isChange isVisible={isVisible} onDisable={goBack}>
      <View style={styles.mainContainer}>
        <CustomText
          label="delAdDes"
          fontFamily={fonts.boldExtra}
          fontSize={16}
          textAlign="center"
          alignSelf={'center'}
          marginBottom={24}
        />

        <CustomButton title="No, Go Back" marginBottom={10} onPress={goBack} />
        <CustomButton
          title={`Yes, Delete this ${type}`}
          marginBottom={10}
          onPress={handleDeletePress}
          disabled={refreshing}
          loading={refreshing}
        />
      </View>
    </CustomModal>
  );
};

export default DeleteModal;

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

import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';

import CustomButton from '../../../../components/CustomButton';
import CustomModal from '../../../../components/CustomModal';
import CustomText from '../../../../components/CustomText';

import CustomDropdown from '../../../../components/CustomDropDown';
import { ToastMessage } from '../../../../utils/ToastMessage';
import { useNavigation } from '@react-navigation/native';
import ApiRequest from '../../../../services/ApiRequest';
import { colors } from '../../../../utils/colors';
import fonts from '../../../../assets/fonts';
import { useSelector } from 'react-redux';

const FeatureModal = ({ isVisible, item, goBack }) => {
  const navigation = useNavigation();

  const [value, setValue] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { token } = useSelector(state => state.user);

  const handleDeletePress = async () => {
    setRefreshing(true);
    try {
      const dataToGet = {
        type: 'add_data',
        table_name: 'feature_ads',
        user_id: token,
        item_id: item,
        days: value,
      };
      const response = await ApiRequest(dataToGet);

      if (response.data.result) {
        goBack();
        ToastMessage('Ad Featured Successfully');
        setTimeout(() => {
          navigation.goBack();
        }, 800);
      } else {
        ToastMessage(response.data.message);
        goBack();
      }
    } catch (error) {
      console.log(error, 'err in feature ads');
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <CustomModal isVisible={isVisible} onDisable={goBack}>
      <View style={styles.mainContainer}>
        <CustomText
          label="Please select the days"
          fontFamily={fonts.boldExtra}
          fontSize={16}
          textAlign="center"
          alignSelf={'center'}
          marginBottom={24}
        />
        <CustomDropdown
          placeholder={'Select number of Days'}
          data={['7', '14', '30']}
          value={value}
          setValue={setValue}
        />

        <CustomButton
          title="Make ad Feature"
          marginBottom={10}
          onPress={handleDeletePress}
          disabled={refreshing || !value}
          loading={refreshing}
          marginTop={16}
        />
      </View>
    </CustomModal>
  );
};

export default FeatureModal;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.white,
    padding: 10,
    width: '90%',
    paddingHorizontal: 20,
    alignSelf: 'center',
    borderRadius: 12,
  },
  image: {
    width: 25,
    height: 25,
  },
});

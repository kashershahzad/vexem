import { StyleSheet, Text, View, Switch } from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '../../../components/ScreenWrapper';
import Header from '../../../components/Header';
import CustomText from '../../../components/CustomText';
import { colors } from '../../../utils/colors';
import fonts from '../../../assets/fonts';
import { useSelector } from 'react-redux';
import CustomButton from '../../../components/CustomButton';
import ApiRequest from '../../../services/ApiRequest';
import { ToastMessage } from '../../../utils/ToastMessage';

const Setting = ({ navigation }) => {
  const { loginUser, token } = useSelector(state => state.user);

  let data = {};
  try {
    data = loginUser?.notification_settings
      ? JSON.parse(loginUser.notification_settings)
      : {};
  } catch (error) {
    console.error('Failed to parse notification_settings:', error);
    data = {};
  }

  const [isEnabled, setIsEnabled] = useState(data?.chat_notification || false);
  const [isEnabled1, setIsEnabled1] = useState(
    data?.general_notification || false,
  );
  const [isEnabled2, setIsEnabled2] = useState(
    data?.promotional_notification || false,
  );
  const [Loading, setLoading] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const toggleSwitch1 = () => setIsEnabled1(previousState => !previousState);
  const toggleSwitch2 = () => setIsEnabled2(previousState => !previousState);

  const UpdateSetings = async () => {
    setLoading(true);
    let notifications = {
      chat_notification: isEnabled,
      general_notification: isEnabled1,
      promotional_notification: isEnabled2,
    };
    try {
      const dataSend = {
        type: 'update_data',
        table_name: 'users',
        id: token,
        notification_settings: JSON.stringify(notifications),
      };
      const res = await ApiRequest(dataSend);
      if (res.data?.result) {
        setLoading(false);
        ToastMessage('Settings Updated Successfully');
        navigation.navigate('Home');
      }
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };

  return (
    <ScreenWrapper
      headerUnScrollable={() => <Header title={'Settings'} />}
      footerUnScrollable={() => (
        <CustomButton
          title={'Update'}
          width="90%"
          disabled={Loading}
          loading={Loading}
          onPress={UpdateSetings}
        />
      )}>
      <View style={styles.row}>
        <CustomText
          label={'Chat Notifications'}
          fontFamily={fonts.bold}
          fontSize={16}
          color={colors.black}
        />
        <Switch
          trackColor={{ false: '#767577', true: colors.primaryColor }}
          thumbColor={isEnabled ? colors.primaryColor : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <View style={styles.row}>
        <CustomText
          label={'General Notification'}
          fontFamily={fonts.bold}
          fontSize={16}
        />
        <Switch
          trackColor={{ false: '#767577', true: colors.primaryColor }}
          thumbColor={isEnabled1 ? colors.primaryColor : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch1}
          value={isEnabled1}
        />
      </View>

      <View style={styles.row}>
        <CustomText
          label={'Promotional Notifications'}
          fontFamily={fonts.bold}
          fontSize={16}
        />
        <Switch
          trackColor={{ false: '#767577', true: colors.primaryColor }}
          thumbColor={isEnabled2 ? colors.primaryColor : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch2}
          value={isEnabled2}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Setting;

const styles = StyleSheet.create({
  row: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

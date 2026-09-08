import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

//screens
import ChangeLanguage from '../screens/Auth/ChangeLanguage';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import NewPassword from '../screens/Auth/ForgotPassword/NewPassword';
import VerifyOtp from '../screens/Auth/ForgotPassword/VerifyOtp';
import LocationAccess from '../screens/Auth/LocationAccess';
import Login from '../screens/Auth/Login';
import Signup from '../screens/Auth/Signup';
import EmailMessage from '../screens/Auth/Signup/EmailMessage';
import VerifyUser from '../screens/Auth/Signup/VerifyUser';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  //

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="EmailMessage" component={EmailMessage} />
      <Stack.Screen name="VerifyUser" component={VerifyUser} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="NewPassword" component={NewPassword} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
      <Stack.Screen name="ChangeLanguage" component={ChangeLanguage} />
      <Stack.Screen name="LocationAccess" component={LocationAccess} />
    </Stack.Navigator>
  );
};

export default AuthStack;

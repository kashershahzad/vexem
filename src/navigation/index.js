import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useSelector } from 'react-redux';

//screens
import AuthStack from './AuthStack';
import MainStack from './MainStack';
// import Intro from '../screens/Auth/Intro';
import Splash from '../screens/Auth/Splash';

const Stack = createNativeStackNavigator();

const RootNavigation = () => {


  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
     
      <>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="MainStack" component={MainStack} />
        <Stack.Screen name="AuthStack" component={AuthStack} />
      </>
    </Stack.Navigator>
  );
};

export default RootNavigation;

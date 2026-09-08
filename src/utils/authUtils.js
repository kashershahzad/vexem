import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { post } from '../services/ApiRequest';
import { setToken } from '../store/reducer/AuthConfig';
import { ToastMessage } from '../utils/ToastMessage';

GoogleSignin.configure({
  webClientId:
    '907212820942-7kpulvvgg3c5m6s1k39gj5s5ue2pv67t.apps.googleusercontent.com',
});

export const signInWithGoogle = async (navigation, dispatch) => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(
      userInfo.idToken,
    );
    const userCredential = await auth().signInWithCredential(googleCredential);

    const email = userCredential.user.email;
    const reqData = {
      email: email,
      fcmtoken: '',
    };
    try {
      const response = await post('auth/social-login', reqData);
      if (response.data?.token && response.data.user.type === 'owner') {
        dispatch(setToken(response.data?.token));

        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'MainStack',
            },
          ],
        });
      } else {
        ToastMessage('Invalid credentials');
        await GoogleSignin.signOut();
      }
    } catch (err) {
      await GoogleSignin.signOut();
      ToastMessage('User has not registered with this account');
    }
  } catch (error) {
    await GoogleSignin.signOut();
    handleSignInError(error);
  }
};

const handleSignInError = error => {
  if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    console.log('User cancelled the login flow');
  } else if (error.code === statusCodes.IN_PROGRESS) {
    console.log('Sign in operation is in progress');
  } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    console.log('Google Play services are not available');
  } else {
    console.log('An error occurred during Google sign in', error);
  }
};

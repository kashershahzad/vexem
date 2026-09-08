/* eslint-disable prettier/prettier */
import analytics from '@react-native-firebase/analytics';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Alert, Linking, Platform, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import SplashScreen from 'react-native-splash-screen';
import VersionCheck from 'react-native-version-check';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AmirBox from './src/Language/AmirBox';
import i18n from './src/Language/i18n';
import RootNavigation from './src/navigation';
import { persistor, store } from './src/store';
import { getToken } from './src/utils/constants';


const App = () => {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  useEffect(() => {
    getToken();
  }, []);

  const linking = {
    prefixes: [
      'https://halooq.com', 
      'halooq://',
    ],
    config: {
      screens: {
        MainStack: {
          screens: {
            Detail: 'item/Detail/:itemTitle/:itemId',
            NewsDetails: 'item/NewsDetails/:newsTitle/:blogId',
            ApplicantProfile: 'profile/:userName/:userId',
            OfferAdDetails: "offer/:itemTitle/:itemId"
          },
        },
      },
    },
  };


  const handleUpdate = async () => {
    try {
      const url =
        Platform.OS === 'ios'
          ? 'https://apps.apple.com/us/app/habeebi/id6723891896'
          : await VersionCheck.getPlayStoreUrl({
              packageName: 'com.vexem.app',
            });

      Linking.openURL(url);
    } catch (error) {
      console.log(error, 'in open link');
    }
  };

  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const latestVersion =
          Platform.OS === 'ios'
            ? await fetch(
                `https://itunes.apple.com/in/lookup?bundleId=com.vexem.app`,
              )
                .then(r => r.json())
                .then(res => {
                  return res?.results[0]?.version;
                })
            : await VersionCheck.getLatestVersion({
                provider: 'playStore',
                packageName: 'com.vexem.app',
                ignoreErrors: true,
              });

        const currentVersion = VersionCheck.getCurrentVersion();

        if (latestVersion > currentVersion) {
          Alert.alert(
            'Update Required',
            'A new version of the app is available. Please update to continue using the app.',
            [
              {
                text: 'Update Now',
                onPress: handleUpdate,
              },
            ],
            { cancelable: false },
          );
        } else {
          // App is up-to-date; proceed with the app
        }
      } catch (error) {
        // Handle error while checking app version
        console.error('Error checking app version:', error);
      }
    };

    checkAppVersion();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <GestureHandlerRootView>
              <NavigationContainer
                ref={navigationRef}
                linking={linking}
                onReady={() => {
                  routeNameRef.current =
                    navigationRef.current.getCurrentRoute().name;
                  SplashScreen.hide();
                }}
                onStateChange={async () => {
                  const previousRouteName = routeNameRef.current;
                  const currentRouteName =
                    navigationRef.current.getCurrentRoute().name;

                  if (previousRouteName !== currentRouteName) {
                    await analytics().logScreenView({
                      screen_name: currentRouteName,
                      screen_class: currentRouteName,
                    });
                  }
                  routeNameRef.current = currentRouteName;
                }}
                fallback={<Text>Loading...</Text>}>
                <AmirBox>
                  <RootNavigation />
                </AmirBox>
              </NavigationContainer>
            </GestureHandlerRootView>
          </PersistGate>
        </Provider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
};

export default App;

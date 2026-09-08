/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  Dimensions,
  StatusBar,
  StyleSheet,
  View,
  Platform,
} from 'react-native';

import ImageFast from './ImageFast';
import Icons from './Icons';
import { colors } from '../utils/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const FocusAwareStatusBar = props => {
  const isFocused = useIsFocused();
  return isFocused ? (
    <StatusBar
      barStyle="dark-content"
      backgroundColor={colors.mainBg}
      {...props}
    />
  ) : null;
};

const ScreenWrapper = ({
  children,
  statusBarColor = colors.white,
  translucent = false,
  scrollEnabled = false,
  backgroundImage,
  backgroundColor = colors.mainBg,
  headerUnScrollable = () => null,
  footerUnScrollable = () => null,
  barStyle = 'dark-content',
  refreshControl,
  paddingBottom,
  nestedScrollEnabled,
  paddingHorizontal,
  isAuth,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const content = () => {
    return (
      <View
        style={[
          styles.container,
          {
            paddingBottom: paddingBottom || 8,
            backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
            paddingTop: translucent ? 0 : insets.top,
          },
        ]}>
        <FocusAwareStatusBar
          barStyle={barStyle}
          backgroundColor={statusBarColor}
          translucent={translucent}
        />
        {!translucent && (
          <SafeAreaView
            style={(styles.container, { backgroundColor: statusBarColor })}
          />
        )}
        {headerUnScrollable()}
        {isAuth && (
          <View style={{ padding: 15 }}>
            <Icons
              name="chevron-left"
              family="Entypo"
              color={colors.black}
              size={28}
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.navigate('AuthStack', { screen: 'OptionScreen' });
                }
              }}
            />
          </View>
        )}

        {scrollEnabled ? (
          <KeyboardAwareScrollView
            nestedScrollEnabled={nestedScrollEnabled}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={refreshControl}
            style={[
              styles.container,
              { backgroundColor, paddingHorizontal: paddingHorizontal || 20 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {children}
          </KeyboardAwareScrollView>
        ) : (
          <View style={{ paddingHorizontal: paddingHorizontal || 20, flex: 1 }}>
            {children}
          </View>
        )}
        <View style={{ paddingBottom: insets.bottom }}>
          {footerUnScrollable()}
        </View>
      </View>
    );
  };
  return backgroundImage ? (
    <View style={{ width, height, zIndex: 999 }}>
      {content()}
      <ImageFast
        source={backgroundImage}
        style={{ width, height, position: 'absolute', zIndex: -1 }}
        resizeMode="cover"
      />
    </View>
  ) : (
    content()
  );
};

export default ScreenWrapper;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

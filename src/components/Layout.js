/* eslint-disable react-native/no-inline-styles */
import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { RefreshControl, SafeAreaView, StatusBar, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { className } from '../global-styles';
import Header from './Header';
import { colors } from '../utils/colors';

const FocusAwareStatusBar = props => {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
};

export const Layout = ({
  children,
  title,
  translucent = false,
  StatusBarBg = colors.mainBg,
  showNavBar = true,
  isSafeAreaView = true,
  containerStyle = {},
  barStyle = 'dark-content',
  animated = false,
  hideBar = false,
  layoutContainer,
  isScroll = true,
  footerComponent,
  headerLeftIcon,
  refreshing,
  onRefresh,
  isRefresh,
}) => {
  //

  const LayoutWrapper = isScroll ? KeyboardAwareScrollView : View;

  return (
    <View style={[className('flex-1 bg-mainBg'), containerStyle]}>
      {isSafeAreaView && (
        <SafeAreaView style={{ backgroundColor: colors.white }} />
      )}
      <FocusAwareStatusBar
        translucent={translucent}
        backgroundColor={StatusBarBg}
        barStyle={barStyle}
        animated={animated}
        hidden={hideBar}
      />
      {showNavBar && (
        <Header
          headerColor={colors.white}
          headerLeftIcon={headerLeftIcon}
          title={title}
        />
      )}

      <LayoutWrapper
        style={[{ flex: 1, paddingHorizontal: 22 }, layoutContainer]}
        refreshControl={
          isRefresh && (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primaryColor]}
            />
          )
        }
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1 }}>{children}</View>
        {footerComponent}
      </LayoutWrapper>
    </View>
  );
};
export default Layout;

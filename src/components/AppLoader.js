import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

export const AppLoader = ({ show }) => {
  return (
    show && (
      <View style={styles.container}>
        <ActivityIndicator size={40} color={colors.white} />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000008E',
    zIndex: 11,
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
});

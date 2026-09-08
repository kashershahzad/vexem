import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

export default function Error({error, visible}) {
  if (!visible || !error) {
    return null;
  }
  return (
    <View>
      <Text style={styles.error}>{error}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  error: {color: 'red', marginBottom: 10},
});

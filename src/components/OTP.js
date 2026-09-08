import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import fonts from '../assets/fonts';
import { colors } from '../utils/colors';

const CELL_COUNT = 4;

const OTPComponent = ({ value, setValue }) => {
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <CodeField
      ref={ref}
      {...props}
      value={value}
      onChangeText={setValue}
      cellCount={CELL_COUNT}
      rootStyle={styles.codeFieldRoot}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={({ index, symbol, isFocused }) => (
        <View
          onLayout={getCellOnLayoutHandler(index)}
          key={index}
          style={[styles.cellRoot, isFocused && styles.focusCell]}>
          <Text style={styles.cellText}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        </View>
      )}
    />
  );
};

export default OTPComponent;

const styles = StyleSheet.create({
  codeFieldRoot: {
    width: '98%',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  cellRoot: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    width: 55,
  },
  cellText: {
    color: colors.primaryColor,
    fontSize: 30,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: colors.primaryColor,
    borderWidth: 1,
  },
});

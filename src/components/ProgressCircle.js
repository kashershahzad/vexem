import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Circle, Svg} from 'react-native-svg';
import {colors} from '../utils/colors';

const TOTAL_STEPS = 2;

const ProgressCircle = ({progress}) => {
  const radius = 30;
  const strokeWidth = 2.5;
  const circumference = radius * 2 * Math.PI;
  const progressValue = progress / TOTAL_STEPS;
  const strokeDashoffset = circumference * (1 - progressValue);

  return (
    <View style={styles.circle}>
      <Svg width={radius * 2} height={radius * 2} style={styles.svg}>
        <Circle
          stroke={colors.black}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius - strokeWidth / 2}
          cx={radius}
          cy={radius}
          strokeDasharray={`${circumference}, ${circumference}`}
        />
        <Circle
          stroke={colors.primaryColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}, ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={radius - strokeWidth / 2}
          cx={radius}
          cy={radius}
        />
      </Svg>
    </View>
  );
};
export default ProgressCircle;

const styles = StyleSheet.create({
  circle: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  svg: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

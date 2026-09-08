import { Skeleton } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../utils/colors';

const CardSkeleton = ({ isStore }) => {
  const skeletonStyle = {
    backgroundColor: '#EBEBEB',
  };
  const renderGrade = () => {
    return (
      <LinearGradient
        colors={['#EBEBEB', '#EBEBEB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    );
  };
  return (
    <View style={[styles.mainCard]}>
      <Skeleton
        animation="pulse"
        LinearGradientComponent={renderGrade}
        style={[styles.content, { height: isStore ? 60 : 80 }]}
        skeletonStyle={skeletonStyle}
      />
      {!isStore && (
        <View style={styles.textBox}>
          <Skeleton
            animation="pulse"
            LinearGradientComponent={renderGrade}
            width={40}
            height={12}
            borderRadius={50}
          />
        </View>
      )}
    </View>
  );
};
export default CardSkeleton;

const styles = StyleSheet.create({
  mainCard: {
    width: '25%',
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  content: {
    width: '100%',
    height: 80,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 8,
  },
  textBox: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});

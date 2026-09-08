import { Skeleton } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SwiperSkeleton = () => {
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
    <View style={styles.mainCard}>
      <Skeleton
        animation="pulse"
        LinearGradientComponent={renderGrade}
        style={styles.cardImg}
        skeletonStyle={skeletonStyle}
      />
    </View>
  );
};
export default SwiperSkeleton;

const styles = StyleSheet.create({
  mainCard: {
    borderRadius: 10,
    marginVertical: 8,
    height: 130,
    marginBottom: 20,
  },

  cardImg: {
    width: '100%',
    height: 130,
    borderRadius: 10,
  },
  dotContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

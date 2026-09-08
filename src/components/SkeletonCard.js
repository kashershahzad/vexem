/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Skeleton } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../utils/colors';

const { width } = Dimensions.get('window');

const SkeletonCard = () => {
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
      <View style={styles.main_container}>
        <View style={styles.skeletonHeader}>
          <Skeleton
            LinearGradientComponent={renderGrade}
            animation="pulse"
            width={70}
            height={25}
            borderRadius={50}
            style={styles.customSkeleton}
          />
          <Skeleton
            animation="pulse"
            LinearGradientComponent={renderGrade}
            width={20}
            height={20}
            borderRadius={50}
          />
        </View>
        <Skeleton
          animation="pulse"
          LinearGradientComponent={renderGrade}
          style={styles.cardImg}
          skeletonStyle={skeletonStyle}
        />
        <View style={styles.skeletonContent}>
          <Skeleton
            animation="pulse"
            LinearGradientComponent={renderGrade}
            skeletonStyle={skeletonStyle}
            width={120}
            height={20}
          />
          <View style={styles.skeletonTextRow}>
            <Skeleton
              animation="pulse"
              LinearGradientComponent={renderGrade}
              skeletonStyle={skeletonStyle}
              width={30}
              height={15}
            />
            <View style={styles.dot} />
            <Skeleton
              animation="pulse"
              LinearGradientComponent={renderGrade}
              skeletonStyle={skeletonStyle}
              width={30}
              height={15}
            />
            <View style={styles.dot} />
            <Skeleton
              animation="pulse"
              LinearGradientComponent={renderGrade}
              skeletonStyle={skeletonStyle}
              width={30}
              height={15}
            />
          </View>
          <Skeleton
            animation="pulse"
            width={100}
            height={20}
            style={{ marginTop: 10 }}
            LinearGradientComponent={renderGrade}
            skeletonStyle={skeletonStyle}
          />
        </View>
      </View>
    </View>
  );
};
export default SkeletonCard;

const styles = StyleSheet.create({
  mainCard: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    margin: 8,
  },
  customSkeleton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  main_container: {
    width: (width - 15 * 4) / 1.9,
    height: 'auto',
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    position: 'absolute',
    zIndex: 99999,
    width: '95%',
    top: 10,
    left: 5,
  },
  cardImg: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 100,
    marginBottom: 10,
  },
  skeletonContent: {
    padding: 10,
  },
  skeletonTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 5,
  },
  dot: {
    backgroundColor: colors.gray2,
    width: 7,
    height: 7,
    borderRadius: 50,
    marginTop: 2,
  },
  skeletonIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 10,
    right: 15,
    gap: 10,
  },
});

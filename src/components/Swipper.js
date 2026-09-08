import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { colors } from '../utils/colors';
import { imgUrl } from '../utils/constants';
import ImageFastWrapper from './ImageFast';

const { width } = Dimensions.get('window');

const Swiper = ({
  images,
  resizeMode = 'cover',
  marginTop,
  containerHeight = 250,
  borderRadius,
  overflow,
  isView,
  url,
}) => {
  const flatListRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images?.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: currentIndex,
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    if (isView) return;
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [images.length, isView]);

  return (
    <View style={{ marginTop: marginTop }}>
      <Animated.FlatList
        data={images}
        showsHorizontalScrollIndicator={false}
        horizontal
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScrollToIndexFailed={info => {
          console.error('Failed to scroll to index:', info.index);
          flatListRef.current.scrollToIndex({
            index: info.index,
            animated: true,
          });
        }}
        ref={flatListRef}
        onMomentumScrollEnd={e => {
          const x = e.nativeEvent.contentOffset.x;
          setCurrentIndex(Math.round(x / width));
        }}
        initialScrollIndex={currentIndex}
        pagingEnabled
        renderItem={({ item }) => {
          return (
            <View
              style={[
                styles.sliderItem,
                {
                  height: containerHeight,
                  borderRadius: borderRadius,
                  overflow: overflow,
                },
              ]}>
              <ImageFastWrapper
                isView={isView}
                style={styles.image}
                source={{
                  uri: url ? imgUrl + item : item,
                }}
                resizeMode={resizeMode}
              />
            </View>
          );
        }}
      />
      <View style={styles.dotContainer}>
        {images?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex
                    ? colors.primaryColor
                    : colors.lightGrey,
                width: index === currentIndex ? 15 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderItem: {
    width: width,
    height: 200,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  dot: {
    height: 8,
    marginHorizontal: 3,
    borderRadius: 100,
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});

export default Swiper;

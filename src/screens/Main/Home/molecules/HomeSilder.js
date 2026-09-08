import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors } from '../../../../utils/colors';

const { width } = Dimensions.get('window');

const HomeSlider = ({ images, onPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (images?.length > 0) {
        const nextIndex = (activeIndex + 1) % images.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setActiveIndex(nextIndex);
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [activeIndex, images?.length]);
  
  

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };
  
  const onScrollToIndexFailed = (info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({
        index: info.index,
        animated: true,
      });
    });
  };
  
  // Render image item
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(item)}
        activeOpacity={0.5}
        style={styles.imgBox}>
        <FastImage
          style={styles.image}
          source={{
            uri: item?.image,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
          resizeMode={FastImage.resizeMode.stretch}
        />
      </TouchableOpacity>
    );
  };
  
  // Custom pagination dots
  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {images?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    );
  };
  
  return (
    <View style={styles.main}>
      <FlatList
        ref={flatListRef}
        data={images || []}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        onScrollToIndexFailed={onScrollToIndexFailed}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '90%',
    height: '90%',
    marginHorizontal: 10,
    alignItems: 'center',
  },
  imgBox: {
    width: width,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    marginHorizontal: 3,
    borderRadius: 100,
    width: 8,
    backgroundColor: colors.lightGrey,
  },
  activeDot: {
    height: 8,
    marginHorizontal: 3,
    borderRadius: 100,
    backgroundColor: colors.white,
    width: 20,
  },
  main: {
    height: 150,
    marginBottom: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});

export default HomeSlider;
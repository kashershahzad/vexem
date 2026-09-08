/* eslint-disable prettier/prettier */
import React, { useRef, useState, useEffect } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import Swiper from 'react-native-swiper';
import ImageZoom from 'react-native-image-pan-zoom';
import { colors } from '../utils/colors';
import { imgUrl } from '../utils/constants';
import Icons from './Icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomText from './CustomText';

const { width, height } = Dimensions.get('window');

// FIXED: Added initialIndex prop to start at the clicked image
const SliderModal = ({ images, url, onDisable, isVisible, data, initialIndex = 0 }) => {
  const swiperRef = useRef(null);
  const [imageIndex, setImageIndex] = useState(initialIndex);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // FIXED: Set initial index when modal opens
  useEffect(() => {
    if (isVisible) {
      setImageIndex(initialIndex);
      setCurrentZoom(1);
      setScrollEnabled(true);
    } else {
      // Reset states when modal closes
      setCurrentZoom(1);
      setScrollEnabled(true);
    }
  }, [isVisible, initialIndex]);

  const goToNextSlide = () => {
    if (swiperRef.current && imageIndex < images.length - 1) {
      swiperRef.current.scrollBy(1);
    }
  };

  const goToPrevSlide = () => {
    if (swiperRef.current && imageIndex > 0) {
      swiperRef.current.scrollBy(-1);
    }
  };

  const handleZoomChange = (scale) => {
    // Disable swiper scrolling when zoomed in
    setCurrentZoom(scale);
    setScrollEnabled(scale <= 1.01);
  };

  const resetZoom = () => {
    setCurrentZoom(1);
    setScrollEnabled(true);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, position: 'absolute' }}>
      <Modal
        isVisible={isVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onBackdropPress={onDisable}
        onBackButtonPress={onDisable}
        onDismiss={onDisable}
        style={{ margin: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        
        <Icons
          family="Entypo"
          name="circle-with-cross"
          color={colors.white}
          size={30}
          onPress={onDisable}
          style={styles.icon}
        />

        {/* Show zoom indicator when zoomed */}
        {currentZoom > 1 && (
          <View style={styles.zoomIndicator}>
            <Icons
              family="MaterialIcons"
              name="zoom-in"
              color={colors.white}
              size={16}
            />
            <CustomText style={styles.zoomText}>
              {Math.round(currentZoom * 100)}%
            </CustomText>
          </View>
        )}

        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.arrowButton, styles.leftArrow]}
            onPress={goToPrevSlide}
            disabled={imageIndex === 0 || currentZoom > 1}>
            <Icons
              family="AntDesign"
              name="left"
              color={imageIndex === 0 || currentZoom > 1 ? colors.lightGrey : colors.white}
              size={24}
            />
          </TouchableOpacity>

          <Swiper
            ref={swiperRef}
            showsPagination
            dotStyle={styles.dot}
            activeDotStyle={styles.activeDot}
            loop={false}
            index={imageIndex} // FIXED: Use the current imageIndex (which is set from initialIndex)
            scrollEnabled={scrollEnabled}
            paginationStyle={{ bottom: 20, height: 50 }}
            onIndexChanged={(i) => {
              setImageIndex(i);
              resetZoom();
            }}>
            {images?.map((item, i) => (
              <View key={i} style={styles.slideContainer}>
                <ImageZoom
                  cropWidth={width}
                  cropHeight={height - 70}
                  imageWidth={width * 0.9}
                  imageHeight={height * 0.8}
                  enableSwipeDown={false}
                  minScale={1}
                  maxScale={5}
                  onMove={({ scale }) => handleZoomChange(scale)}
                  onDoubleClick={() => {
                    // Double tap to zoom logic
                    if (currentZoom > 1) {
                      resetZoom();
                    }
                  }}
                  style={styles.imgBox}>
                  <FastImage
                    style={styles.image}
                    source={{ uri: url ? imgUrl + item : item }}
                    resizeMode="contain"
                  />
                </ImageZoom>
              </View>
            ))}
          </Swiper>

          <TouchableOpacity
            style={[styles.arrowButton, styles.rightArrow]}
            onPress={goToNextSlide}
            disabled={imageIndex === images?.length - 1 || currentZoom > 1}>
            <Icons
              family="AntDesign"
              name="right"
              color={
                imageIndex === images?.length - 1 || currentZoom > 1
                  ? colors.lightGrey
                  : colors.white
              }
              size={24}
            />
          </TouchableOpacity>
        </View>

        {/* Zoom instructions */}
        {imageIndex === 0 && currentZoom === 1 && (
          <View style={styles.instructionContainer}>
            <CustomText style={styles.instructionText}>
              Pinch to zoom • Double tap to zoom
            </CustomText>
          </View>
        )}
      </Modal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.9,
    height: height * 0.8,
  },
  imgBox: {
    width: width,
    height: height - 70,
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
    backgroundColor: colors.primaryColor,
    width: 15,
  },
  icon: {
    alignSelf: 'flex-end',
    top: Platform.OS === 'ios' ? 70 : 20,
    zIndex: 999,
    right: 15,
  },
  icon2: {
    alignSelf: 'flex-end',
    zIndex: 999999,
    position: 'absolute',
    bottom: 20,
    right: 15,
  },
  resetButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 70 : 20,
    left: 15,
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    position: 'absolute',
    top: '45%',
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  zoomIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 70,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
  },
  zoomText: {
    color: colors.white,
    fontSize: 12,
    marginLeft: 6,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  instructionText: {
    color: colors.white,
    fontSize: 12,
  },
});

export default SliderModal;
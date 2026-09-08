import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
  PanResponder,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import CustomModal from './CustomModal';
import Icons from './Icons';
import { colors } from '../utils/colors';

const getFileExtension = uri => {
  return uri.split('.').pop().toLowerCase();
};

const ImageFastWrapper = ({ source, svgW, svgH, marginRight, ...rest }) => {
  const uri = source?.uri || '';
  const extension = getFileExtension(uri);

  if (extension === 'svg') {
    return (
      <View style={{ width: svgW, height: svgH, marginRight: marginRight }}>
        <SvgUri width={svgW} height={svgH} uri={uri} />
      </View>
    );
  }
  return <ImageFast source={source} {...rest} />;
};

const SkeletonLoader = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animatedValue]);

  const interpolatedBackground = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0e0e0', '#c0c0e0'],
  });

  return (
    <View style={styles.skeletonContainer}>
      <Animated.View
        style={[styles.skeleton, { backgroundColor: interpolatedBackground }]}
      />
      <Animated.View
        style={[
          styles.skeleton,
          styles.skeletonShort,
          { backgroundColor: interpolatedBackground },
        ]}
      />
      <Animated.View
        style={[styles.skeleton, { backgroundColor: interpolatedBackground }]}
      />
    </View>
  );
};

const ImageFast = ({
  source,
  style,
  resizeMode,
  isView,
  loading,
  children,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);
  const { width, height } = Dimensions.get('window');

  const scale = useRef(new Animated.Value(1)).current;
  const lastScale = useRef(1);
  const pan = useRef(new Animated.ValueXY()).current;
  const lastPan = useRef({ x: 0, y: 0 });
  const doubleTapRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(doubleTapRef.current);
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 2) {
          let currentScale = lastScale.current * gestureState.scale;
          if (currentScale < 1) currentScale = 1;
          scale.setValue(currentScale);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 2) {
          lastScale.current = scale._value;
        }
      },
    }),
  ).current;

  const handleDoubleTap = () => {
    // Double-tap zoom logic
    const DOUBLE_TAP_DELAY = 300;
    if (doubleTapRef.current) {
      // Double tap detected
      if (lastScale.current === 1) {
        Animated.spring(scale, { toValue: 2, useNativeDriver: false }).start();
        lastScale.current = 2;
      } else {
        Animated.spring(scale, { toValue: 1, useNativeDriver: false }).start();
        lastScale.current = 1;
        pan.setValue({ x: 0, y: 0 });
        lastPan.current = { x: 0, y: 0 };
      }
      clearTimeout(doubleTapRef.current);
      doubleTapRef.current = null;
    } else {
      // First tap detected, set a timer for detecting the second tap
      doubleTapRef.current = setTimeout(() => {
        clearTimeout(doubleTapRef.current);
        doubleTapRef.current = null;
      }, DOUBLE_TAP_DELAY);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => setIsViewModal(true)}
      activeOpacity={0.6}
      disabled={!isView}
      style={[
        style,
        { overflow: 'hidden' },
        (loading || isImageLoading) && styles.centered,
      ]}>
      {isViewModal && (
        <CustomModal
          isVisible={isViewModal}
          onDisable={() => setIsViewModal(false)}>
          <Icons
            family="Entypo"
            name="circle-with-cross"
            color={colors.white}
            size={30}
            onPress={() => setIsViewModal(false)}
            style={styles.icon}
          />
          <Animated.View
            style={[
              {
                transform: [
                  { scale: scale },
                  { translateX: pan.x },
                  { translateY: pan.y },
                ],
              },
              { width: width, height: height - 70 },
            ]}
            {...panResponder.panHandlers}>
            <FastImage
              onLoadStart={() => setIsImageLoading(true)}
              onLoadEnd={() => setIsImageLoading(false)}
              source={source}
              resizeMode="contain"
              style={{ width: '100%', height: '100%' }}
              onTouchEnd={handleDoubleTap}
            />
          </Animated.View>
        </CustomModal>
      )}
      <FastImage
        onLoadStart={() => setIsImageLoading(true)}
        onLoadEnd={() => setIsImageLoading(false)}
        source={source}
        resizeMode={resizeMode}
        style={{ width: '100%', height: '100%' }}>
        <View style={styles.absoluteFill}>{children}</View>
      </FastImage>
      {loading || isImageLoading ? (
        <View style={styles.absoluteFill}>
          <SkeletonLoader />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  absoluteFill: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  icon: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginRight: 10,
    top: Platform.OS === 'ios' ? 50 : 0,
    zIndex: 999,
  },
  skeletonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  skeleton: {
    width: '100%',
    height: '100%',
  },
  skeletonShort: {
    width: '100%',
    height: '100%',
  },
});

export default ImageFastWrapper;

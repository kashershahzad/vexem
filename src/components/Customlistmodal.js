import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';

const Customlistmodal = ({
  isVisible,
  transparent = true,
  onDisable,
  backdropOpacity,
  mainMargin,
  marginTop,
  marginBottom,
  marginVertical,
  marginHorizontal,
  borderRadius,
  overflow,
  children,
}) => {
  const translateY = useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, translateY]);

  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      transparent={transparent}
      onBackdropPress={onDisable}
      onBackButtonPress={onDisable}
      swipeDirection={['down']}
      onSwipeComplete={onDisable}
      backdropOpacity={backdropOpacity}
      style={[
        {
          margin: mainMargin,
          marginTop,
          marginBottom,
          marginVertical,
          marginHorizontal,
          borderRadius,
          overflow,
        },
      ]}>
      <TouchableOpacity
        style={styles.mainContainer1}
        activeOpacity={1}
        onPress={onDisable}>
        <TouchableOpacity style={styles.container} activeOpacity={1}>
          <Animated.View
            style={[styles.animatedContainer, { transform: [{ translateY }] }]}>
            {children}
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default Customlistmodal;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer1: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    width: '100%',
  },
  animatedContainer: {
    width: '100%',
    // Add any additional styles you want here
  },
});

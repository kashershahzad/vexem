import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';

import fonts from '../../../assets/fonts';
import { Images } from '../../../assets/images';
import CustomText from '../../../components/CustomText';
import Icons from '../../../components/Icons';
import ImageFast from '../../../components/ImageFast';
import ScreenWrapper from '../../../components/ScreenWrapper';
import { setIntroSeen } from '../../../store/reducer/usersSlice';
import { colors } from '../../../utils/colors';

const { width, height } = Dimensions.get('window');

const Intro = () => {
  //

  const flatListRef = useRef();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  const array = [
    {
      id: 1,
      img: Images.intro1,
      title: 'Click Photo',
      subTitle: 'Take a photo of the product youwant to let go of',
    },
    {
      id: 2,
      img: Images.intro2,
      title: 'Publish your ads',
      subTitle: 'Enter a description, price and category of your ad',
    },
    {
      id: 3,
      img: Images.intro3,
      title: 'Get money',
      subTitle:
        'Now relax and enjoy the money you made on the product you let go of',
    },
  ];

  const handleSkip = () => {
    dispatch(setIntroSeen(true));
  };

  const handlePress = () => {
    if (currentIndex == 2) {
      dispatch(setIntroSeen(true));
    } else {
      setCurrentIndex(pre => parseInt(pre, 10) + 1);
    }
  };

  useEffect(() => {
    flatListRef.current.scrollToIndex({ animated: true, index: currentIndex });
  }, [currentIndex]);

  return (
    <ScreenWrapper paddingHorizontal={0.1}>
      <ImageFast
        source={Images.introBg}
        style={styles.bgImg}
        resizeMode="cover">
        <CustomText
          containerStyle={styles.skiper}
          label={'Skip'}
          fontFamily={fonts.semiBold}
          color={colors.orange}
          onPress={handleSkip}
        />

        <Animated.FlatList
          data={array}
          showsHorizontalScrollIndicator={false}
          horizontal
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScrollToIndexFailed={info => {
            console.error('Failed to scroll to index:', info.index);
          }}
          ref={flatListRef}
          onMomentumScrollEnd={e => {
            const x = e.nativeEvent.contentOffset.x;
            setCurrentIndex((x / width)?.toFixed(0));
          }}
          initialScrollIndex={currentIndex}
          pagingEnabled
          renderItem={({ item }) => (
            <Animated.View style={styles.sliderItem}>
              <Animated.Image style={styles.img} source={item.img} />
              <CustomText
                label={item.title}
                fontSize={27}
                marginBottom={15}
                textAlign="center"
                lineHeight={40}
                fontFamily={fonts.bold}
              />
              <CustomText
                label={item.subTitle}
                fontSize={15}
                marginBottom={20}
                textAlign="center"
                lineHeight={28}
                fontFamily={fonts.semiBold}
                paddingHorizontal={40}
              />
            </Animated.View>
          )}
        />

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.btnContainer}
          onPress={handlePress}>
          <Icons
            name={'arrow-right'}
            family={'Feather'}
            size={30}
            color={colors.white}
          />
        </TouchableOpacity>

        <Animated.View style={styles.dotContainer}>
          {array?.map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i == currentIndex ? colors.primaryColor : colors.lightGrey,
                  width: i == currentIndex ? 40 : 25,
                },
              ]}
            />
          ))}
        </Animated.View>
      </ImageFast>
    </ScreenWrapper>
  );
};

export default Intro;

const styles = StyleSheet.create({
  bgImg: {
    width: '100%',
    heigh: '100%',
  },
  sliderItem: {
    width: width,
    height: height - 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    height: '50%',
    width: '90%',
    resizeMode: 'contain',
  },
  dot: {
    height: 8,
    marginHorizontal: 3,
    borderRadius: 100,
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    bottom: 20,
    alignSelf: 'center',
  },
  btnContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orange,
    borderRadius: 100,
    position: 'absolute',
    bottom: height / 8,
  },
  skiper: {
    backgroundColor: colors.lightOrange,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 50,
    top: 20,
  },
});

import React, { useState } from 'react';
import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import fonts from '../assets/fonts';
import { colors } from '../utils/colors';
import CustomText from './CustomText';
import Icons from './Icons';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const CustomDropdown = ({
  data,
  value,
  setValue,
  placeholder,
  marginBottom,
  transparent,
  width,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  const selectOption = option => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (option?._id) {
      setValue(option?._id);
      setText(option.title);
    } else {
      setValue(option);
    }
    setIsOpen(false);
  };

  return (
    <>
      <View
        style={[
          styles.dropdownMainContainer,
          {
            marginBottom: marginBottom || 15,
            backgroundColor: transparent ? 'transparent' : colors.white,
            borderColor: transparent ? 'transparent' : colors.lightGrey,
            width: width || '100%',
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={[
            styles.container,
            {
              backgroundColor: transparent ? 'transparent' : colors.white,
            },
          ]}
          onPress={toggleDropdown}>
          <CustomText
            label={text || value || placeholder}
            fontSize={15}
            fontFamily={fonts.semiBold}
            numberOfLines={1}
            width={150}
            color={transparent ? colors.white : colors.black}
            paddingHorizontal={10}
          />

          <Icons
            style={{ color: transparent ? colors.white : colors.black }}
            family="AntDesign"
            size={15}
            name={isOpen ? 'up' : 'down'}
          />
        </TouchableOpacity>
        {isOpen && data?.length > 0 && (
          <ScrollView
            scrollEnabled
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}>
            {data?.map((option, i) => (
              <TouchableOpacity
                style={styles.list}
                key={i}
                onPress={() => selectOption(option)}>
                <CustomText
                  label={option?._id ? option?.title : option}
                  fontSize={13}
                  color={colors.black}
                  fontFamily={fonts.semiBold}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </>
  );
};

export default CustomDropdown;
const styles = StyleSheet.create({
  dropdownMainContainer: {
    borderRadius: 10,
    backgroundColor: colors.white,
    maxHeight: 200,
    overflow: 'scroll',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 10,
    width: '100%',
    height: 49,
    backgroundColor: colors.white,
    overflow: 'scroll',
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontFamily: fonts.semiBold,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

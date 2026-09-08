import React, { useState } from 'react';
import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  TextInput,
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

const MutileDropDown = ({
  data,
  value = [],
  setValue,
  placeholder,
  marginBottom,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
    setSearchTerm(''); // Reset search when opening/closing
  };

  const isSelected = (option) => {
    return value.includes(option?._id || option);
  };

  const selectOption = (option) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const optionId = option?._id || option;
    if (isSelected(option)) {
      setValue(value.filter(val => val !== optionId));
    } else {
      setValue([...value, optionId]);
    }
  };

  const selectedLabels = data
    .filter(item => value.includes(item?._id || item))
    .map(item => item?.title || item)
    .join(', ');

  // Filter data based on search term
  const filteredData = data.filter(item => {
    const label = item?.title || item;
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <View
      style={[
        styles.dropdownMainContainer,
        { marginBottom: marginBottom || 15 },
      ]}>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.container}
        onPress={toggleDropdown}>
        <View style={{ flex: 1 }}>
          <CustomText
            label={selectedLabels || placeholder}
            fontSize={15}
            fontFamily={fonts.semiBold}
            color={value?.length ? colors.black : colors.authText}
            paddingHorizontal={10}
          />
        </View>
        <Icons
          style={{ color: colors.black }}
          family="AntDesign"
          size={15}
          name={isOpen ? 'caretup' : 'caretdown'}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          {/* Search Input */}
          <TextInput
            placeholder="Search..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
            placeholderTextColor={colors.authText}
          />

          <ScrollView
            scrollEnabled
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}>
            {filteredData.map((option, i) => {
              const optionId = option?._id || option;
              const label = option?.title || option;
              return (
                <TouchableOpacity
                  style={styles.list}
                  key={optionId.toString()}
                  onPress={() => selectOption(option)}>
                  <CustomText
                    label={label}
                    fontSize={13}
                    color={colors.black}
                    numberOfLines={2}
                    fontFamily={fonts.semiBold}
                  />
                  {isSelected(option) && (
                    <Icons
                      family="AntDesign"
                      name="check"
                      size={16}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default MutileDropDown;

const styles = StyleSheet.create({
  dropdownMainContainer: {
    borderRadius: 10,
    backgroundColor: colors.white,
    width: '100%',
    maxHeight: 300,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    width: '100%',
    height: 49,
    backgroundColor: colors.white,
  },
  dropdown: {
    maxHeight: 200,
  },
  searchInput: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: colors.lightGrey,
    paddingHorizontal: 10,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.black,
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import fonts from '../assets/fonts';
import { Images } from '../assets/images';
import { colors } from '../utils/colors';
import Icons from './Icons';
import ImageFast from '../components/ImageFast';

const SearchBar = ({
  placeHolder,
  value,
  onChangeText,
  onEndEditing,
  editable = true,
  onFocus,
  disabled,
  autoFocus,
  home,
  isStore,
  onSearchPress = () => '',
}) => {
  const { t } = useTranslation();

  // If the TextInput is not editable, make the entire container clickable
  const isClickableContainer = !editable || disabled;

  const renderContent = () => (
    <>
      {home && (
        <Image
          source={Images.newLogo}
          style={{ height: 50, width: 65, marginRight: 4 }}
          resizeMode="contain"
        />
      )}
      {isStore && (
        <Image
          source={Images.newLogo}
          style={{ height: 50, width: 65, marginRight: 4 }}
          resizeMode="contain"
        />
      )}

      <TextInput
        autoFocus={autoFocus}
        editable={editable && !disabled}
        onFocus={onFocus}
        placeholder={t(placeHolder)}
        placeholderTextColor={isStore ? colors.white : colors.grey}
        style={[styles.input, { color: isStore ? colors.white : colors.black }]}
        value={value}
        cursorColor={isStore ? colors.white : colors.grey}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
        returnKeyType="search"
        pointerEvents={isClickableContainer ? 'none' : 'auto'}
      />

      <TouchableOpacity
        onPress={onSearchPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.searchIconContainer}>
        <Icons
          name="search"
          type="feather"
          size={22}
          color={colors.primaryColor}
        />
      </TouchableOpacity>
    </>
  );

  if (isClickableContainer) {
    // When TextInput is disabled or not editable, make entire container clickable
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onSearchPress}
        style={[styles.container]}>
        {renderContent()}
      </TouchableOpacity>
    );
  }

  // When TextInput is editable, use a regular View container
  return <View style={[styles.container]}>{renderContent()}</View>;
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 47,
    borderRadius: 10,
    borderWidth: 0.9,
    borderColor: colors.lightGrey,
    flex: 1,
  },
  input: {
    fontSize: 15,
    fontFamily: fonts.regular,
    flex: 1,
    height: 47,
  },
  searchIconContainer: {
    padding: 5, // Add some padding for better touch area
  },
});

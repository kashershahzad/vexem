import React, { useState, useEffect } from 'react';
import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
  TextInput,
} from 'react-native';
import fonts from '../assets/fonts';
import { colors } from '../utils/colors';
import CustomText from './CustomText';
import Icons from './Icons';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const DropDownWithSearch = ({
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(data || []);
  }, [data]);

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
      setFilteredData(data || []);
    }
  };

  const selectOption = option => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (option?._id) {
      setValue(option?._id);
      setText(option.title);
    } else {
      setValue(option);
      setText(option);
    }
    setIsOpen(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredData(data || []);
    } else {
      const filtered = data.filter(item => {
        const itemText = item?._id ? item?.title : item;
        return itemText.toLowerCase().includes(query.toLowerCase());
      });
      setFilteredData(filtered);
    }
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
        {isOpen && (
          <View>
            <View style={styles.searchContainer}>
              <Icons
                family="AntDesign"
                name="search1"
                size={16}
                style={{ marginRight: 8, color: colors.grey }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchQuery}
                onChangeText={handleSearch}
                placeholderTextColor={colors.grey}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => handleSearch('')}>
                  <Icons
                    family="AntDesign"
                    name="close"
                    size={16}
                    style={{ color: colors.grey }}
                  />
                </TouchableOpacity>
              )}
            </View>
            
            {filteredData?.length > 0 ? (
              <ScrollView
                scrollEnabled
                nestedScrollEnabled
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}>
                {filteredData?.map((option, i) => (
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
            ) : (
              <View style={styles.noResultContainer}>
                <CustomText
                  label="No results found"
                  fontSize={13}
                  color={colors.grey}
                  fontFamily={fonts.regular}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </>
  );
};

export default DropDownWithSearch;
const styles = StyleSheet.create({
  dropdownMainContainer: {
    borderRadius: 10,
    backgroundColor: colors.white,
    maxHeight: 300,
    overflow: 'scroll',
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
    overflow: 'scroll',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.black,
  },
  scrollContainer: {
    maxHeight: 200,
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
  noResultContainer: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
  },
});
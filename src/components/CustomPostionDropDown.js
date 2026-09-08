import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  LayoutAnimation,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import CustomText from './CustomText';
import Icons from './Icons';
import fonts from '../assets/fonts';
import { colors } from '../utils/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CustomPositionDropdown = ({
  data = [],
  value,
  setValue,
  placeholder = 'Select',
  width = 200,
  transparent = false,
  useModal = false, // New prop to use modal approach
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const buttonRef = useRef(null);

  const toggleDropdown = () => {
    // Measure button position when opening modal dropdown
    if (useModal && buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setButtonLayout({ x, y, width, height });
      });
    }
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setText(option?.title || option);
    setValue(option?._id || option);
    setIsOpen(false);
  };

  const getDropdownPosition = () => {
    const dropdownHeight = Math.min(data.length * 44, 200);
    const spaceBelow = screenHeight - (buttonLayout.y + buttonLayout.height);
    const spaceAbove = buttonLayout.y;
    
    // Determine if dropdown should appear above or below
    const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
    
    const top = showAbove 
      ? buttonLayout.y - dropdownHeight - 5  // Above button
      : buttonLayout.y + buttonLayout.height + 5; // Below button
    
    // Ensure dropdown stays within screen horizontally
    const left = Math.max(10, Math.min(
      buttonLayout.x, 
      screenWidth - width - 10
    ));
    
    return { top, left };
  };

  const handleButtonLayout = (event) => {
    if (useModal) {
      // measureInWindow gives position relative to screen, not parent
      event.target.measureInWindow((x, y, width, height) => {
        setButtonLayout({ x, y, width, height });
      });
    }
  };

  const renderDropdown = () => {
    if (!isOpen || data.length === 0) return null;

    const dropdownContent = (
      <ScrollView 
        nestedScrollEnabled
        showsVerticalScrollIndicator={true}
        style={{ height: Math.min(data.length * 44, 200) }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => selectOption(item)}
            style={[
              styles.option,
              index === data.length - 1 && styles.lastOption
            ]}>
            <CustomText
              label={item?.title || item}
              fontSize={14}
              fontFamily={fonts.semiBold}
              color={colors.black}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );

    if (useModal) {
      return (
        <Modal
          transparent
          visible={isOpen}
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View 
                  style={[
                    styles.modalDropdown,
                    {
                      width,
                      top: buttonLayout.y + buttonLayout.height + 5,
                      left: Math.min(buttonLayout.x, screenWidth - width - 10),
                    }
                  ]}
                >
                  {dropdownContent}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }

    return (
      <View style={[styles.dropdown, { width }]}>
        {dropdownContent}
      </View>
    );
  };

  return (
    <View style={{ position: 'relative', width }}>
      <TouchableOpacity
        ref={buttonRef}
        onPress={toggleDropdown}
        onLayout={handleButtonLayout}
        activeOpacity={0.6}
        style={[
          styles.button,
          {
            backgroundColor: transparent ? 'transparent' : colors.white,
            borderColor: transparent ? 'transparent' : colors.lightGrey,
          },
        ]}>
        <CustomText
          label={text || value || placeholder}
          fontSize={15}
          fontFamily={fonts.semiBold}
          width={100}
          color={transparent ? colors.white : colors.black}
          numberOfLines={1}
        />
        <Icons
          family="AntDesign"
          name={isOpen ? 'up' : 'down'}
          size={15}
          style={{ color: transparent ? colors.white : colors.black }}
        />
      </TouchableOpacity>

      {renderDropdown()}

      {/* No data message */}
      {isOpen && data.length === 0 && !useModal && (
        <View style={[styles.dropdown, { width }]}>
          <View style={styles.noDataContainer}>
            <CustomText
              label="No options available"
              fontSize={14}
              fontFamily={fonts.semiBold}
              color={colors.grey}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default CustomPositionDropdown;

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 8,
    zIndex: 9999,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalDropdown: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    backgroundColor: colors.white,
    activeOpacity: 0.7,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  noDataContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
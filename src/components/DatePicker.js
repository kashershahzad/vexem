/* eslint-disable prettier/prettier */
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import fonts from '../assets/fonts';
import { colors } from '../utils/colors';
import CustomText from './CustomText';
import Icons from './Icons';

export const DatePicker = ({
  date,
  placeHolder,
  onChange,
  maxDate,
  minDate,
  disable,
  customeStyle,
  isTime,
  error,
}) => {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isError = ![undefined, null, true, ''].includes(error);

  const showDatepicker = () => {
    if (!disable) {
      setShow(true);
    }
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      // For Android, handle date selection directly
      setShow(false);
      if (date) {
        onChange(event, date);
      }
    } else {
      // For iOS, update selected date but don't confirm yet
      if (date) {
        setSelectedDate(date);
      }
    }
  };

  const handleConfirm = () => {
    onChange(null, selectedDate);
    setShow(false);
  };

  const handleCancel = () => {
    setShow(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={showDatepicker}
        style={[styles.box, customeStyle]}
        disabled={disable}>
        <Text style={styles.date}>
          {date || placeHolder || (isTime ? 'Select Time' : 'Select Date')}
        </Text>
        <Icons
          name={isTime ? 'clock' : 'calendar-outline'}
          family={isTime ? 'Feather' : 'IonIcons'}
          size={20}
          color={colors.black}
        />
      </TouchableOpacity>
      {isError && <CustomText label={error} color={colors.red} />}

      {/* Android: Default system picker */}
      {Platform.OS === 'android' && show && (
        <DateTimePicker
          mode={isTime ? 'time' : 'date'}
          value={selectedDate}
          is24Hour={true}
          onChange={handleDateChange}
          minimumDate={minDate ? minDate : null}
          maximumDate={maxDate ? maxDate : null}
          themeVariant="light"
        />
      )}

      {/* iOS: Modal picker */}
      {Platform.OS === 'ios' && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={show}
          onRequestClose={handleCancel}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isTime ? 'Select Time' : 'Select Date'}
                </Text>
              </View>

              <DateTimePicker
                display="spinner"
                mode={isTime ? 'time' : 'date'}
                value={selectedDate}
                is24Hour={true}
                onChange={handleDateChange}
                minimumDate={minDate ? minDate : null}
                maximumDate={maxDate ? maxDate : null}
                style={styles.datePicker}
                themeVariant="light"
              />

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleConfirm}>
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  date: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.black,
    top: Platform.OS === 'android' ? -4 : 0,
  },
  box: {
    borderColor: '#D0D5DD',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 2,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'space-between',
    height: 52,
    maxHeight: 52,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    minWidth: 300,
    maxWidth: '90%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  datePicker: {
    alignSelf: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: colors.primary || '#007AFF',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: 'white',
  },
});
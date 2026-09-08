import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import ApiRequest from '../services/ApiRequest';
import { ToastMessage } from './ToastMessage';
export const regEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// export const passwordRegex =
//   /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
export const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;

export const imgUrl = 'https://habeebi.com/api/images/';
export const GOOGLE_API_KEY = 'AIzaSyB30IDHxRCBwsaiocbWMGCgS0f4Go3FPew';


export const uploadAndGetUrl = async (file, isNotImage) => {
  const body = new FormData();
  body.append('type', 'upload_data');

  if (!isNotImage) {
    const imageName = file.path.split('/');
    const imageData = {
      fileCopyUri: null,
      name:
        Platform.OS === 'ios'
          ? file?.filename
          : imageName[imageName?.length - 1],
      size: file?.size,
      type: file?.mime,
      uri: file?.path,
    };
    body.append('file', imageData);
  } else {
    body.append('file', file);
  }

  try {
    const res = await ApiRequest(body);
    if (res.data.result) {
      return res.data?.file_name;
    } else {
      ToastMessage('Upload Again');
      return '';
    }
  } catch (err) {
    console.log(err);
    ToastMessage('Upload Again');
  }
};

export const getToken = async () => {
  if (Platform.OS === 'android') {
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
  const fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    const token = await messaging().getToken();
    await AsyncStorage.setItem('fcmToken', token);
  } else {
    return;
  }
};
export function _formatDate(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  if (now - date < 604800000) {
    if (now.toDateString() === date.toDateString()) {
      return 'Today';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      });
    }
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
export function processArray(arr) {
  const groupedData = {};
  arr.forEach(item => {
    const day = _formatDate(item.createdAt);
    if (!groupedData[day]) {
      groupedData[day] = [item];
    } else {
      groupedData[day].push(item);
    }
  });
  Object.keys(groupedData).forEach(day => {
    const items = groupedData[day];
    const lastIndex = items.length - 1;
    items.forEach((item, index) => {
      item.day = day;
      item.show = index === lastIndex;
    });
  });
  const result = arr.map(item => ({ ...item }));
  return result;
}
var SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
export const formatPrice = number => {
  var tier = Math.log10(Math.abs(number)) / 3 || 0;
  if (tier === 0) return number;
  var suffix = SI_SYMBOL[tier];
  var scale = Math.pow(10, tier * 3);
  var scaled = number / scale;
  var formattedNumber =
    scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1);
  return formattedNumber + suffix;
};

export const validatePhone = phoneNumber => {
  const digits = String(phoneNumber || '').replace(/\D/g, '');

  let national = digits;
  if (national.startsWith('92') && national.length >= 12) {
    national = national.slice(2);
  }
  if (national.startsWith('0')) {
    national = national.slice(1);
  }

  // Pakistan format: +92 followed by exactly 10 digits
  return /^\d{10}$/.test(national);
};

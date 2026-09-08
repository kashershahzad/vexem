import Toast from 'react-native-simple-toast';
export const ToastMessage = message => {
  if (typeof message === 'string') {
    Toast.show(message);
  } else return;
};

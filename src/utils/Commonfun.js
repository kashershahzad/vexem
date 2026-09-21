import Share from 'react-native-share';
export const regEmail = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/;
// export const passwordRegex =
//   /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
export const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;

export const numberRegex = /^\d*$/;

const hasCityLabel = value => /\bcit(y|ies)\b/.test(String(value || '').toLowerCase());

export const isCityCustomField = field => {
  if (hasCityLabel(field?.name)) {
    return true;
  }

  try {
    const translations =
      typeof field?.translations === 'string'
        ? JSON.parse(field.translations)
        : field?.translations;
    return hasCityLabel(translations?.en);
  } catch {
    return false;
  }
};
export const dummyArray = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
];
export const onSharePress = async () => {
  try {
    const url = 'https://app.vexem.co/';
    const msg =
      'Download Vexem today and experience a smarter, more convenient way to buy and sell!!';

    const shareOptions = {
      message: `${msg}\n${url}`,
      title: 'Vexem',
    };

    await Share.open(shareOptions);
  } catch (error) {
    console.log(error, 'in share');
  }
};

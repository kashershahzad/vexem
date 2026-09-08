import Share from 'react-native-share';
export const regEmail = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/;
// export const passwordRegex =
//   /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
export const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;

export const numberRegex = /^\d*$/;
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
      'Download Vexem today and experience the most convenient way to buy and sell in Qatar!';
    const shareOptions = {
      message: msg,
      url: url,
    };

    await Share.open(shareOptions);
  } catch (error) {
    console.log(error, 'in share');
  }
};

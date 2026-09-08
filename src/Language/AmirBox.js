import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { View } from 'react-native';

import i18n from './i18n';

const AmirBox = ({ children }) => {
  const { loginUser } = useSelector(state => state.user);

  useEffect(() => {
    const checkLanguage = async () => {
      try {
        if (loginUser?.user_lang === 'ar') {
          await i18n.changeLanguage('ar');
        } else {
          await i18n.changeLanguage('en');
        }
      } catch (error) {
        console.log('Error', error);
      }
    };
    checkLanguage();
  }, [loginUser]);

  return <View style={{ flex: 1 }}>{children}</View>;
};

export default AmirBox;

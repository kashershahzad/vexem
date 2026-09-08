import React, { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import EmptyComponent from '../../../../components/EmptyComponent';
import Header from '../../../../components/Header';
import ScreenWrapper from '../../../../components/ScreenWrapper';
import ApiRequest from '../../../../services/ApiRequest';
import { colors } from '../../../../utils/colors';
import { useSelector } from 'react-redux';

const AboutUs = () => {
  const [content, setContent] = useState('');
  const [refreshing, setRefreshing] = useState(true);
  const { loginUser } = useSelector(store => store.user);

  const onRefresh = () => {
    setRefreshing(true);
    fetchContent();
  };

  const fetchContent = async () => {
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'content',
        id: 1,
      };
      const res = await ApiRequest(dataToGet);
      if (res.data?.data) {
        const data = JSON.parse(res.data.data[0]?.translations) || {};
        const userLang = loginUser?.user_lang;
        const contentForLang = data[userLang] || data?.en;
        setContent(contentForLang);
      }
      setRefreshing(false);
    } catch (error) {
      console.log(error);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <ScreenWrapper
      scrollEnabled
      statusBarColor={colors.white}
      backgroundColor="#fff"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primaryColor]}
        />
      }
      headerUnScrollable={() => <Header title={'About Us'} />}>
      {content ? (
        <WebView
          style={styles.container}
          originWhitelist={['*']}
          javaScriptEnabled
          scalesPageToFit={false}
          injectedJavaScript={`
              const meta = document.createElement('meta'); 
              meta.setAttribute('name', 'viewport'); 
              meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'); 
              document.getElementsByTagName('head')[0].appendChild(meta);
              document.body.style.margin = '0';
              document.body.style.padding = '0';
            `}
          source={{
            html: `
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
                  </head>
                  <body style="margin:0; padding:0;">
                    ${content}
                  </body>
                </html>
              `,
          }}
          showsVerticalScrollIndicator={false}
          scrollEnabled
        />
      ) : (
        !refreshing && <EmptyComponent />
      )}
    </ScreenWrapper>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBg,
    marginTop: 20,
  },
});

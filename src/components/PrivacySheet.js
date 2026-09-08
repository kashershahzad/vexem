import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import WebView from 'react-native-webview';
import EmptyComponent from './EmptyComponent';

const PrivacySheet = ({ bottomSheetRef, content, loading, setContent }) => {
  //

  return (
    <RBSheet
      ref={bottomSheetRef}
      closeOnDragDown
      closeOnPressMask
      closeOnPressBack
      openDuration={250}
      draggable
      onClose={() => setContent('')}
      customStyles={{ container: styles.modalContainer }}>
      <View style={{ flex: 1 }}>
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
        ) : loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size={'large'} color={'#000'} />
          </View>
        ) : (
          <EmptyComponent />
        )}
      </View>
    </RBSheet>
  );
};

export default PrivacySheet;

const styles = StyleSheet.create({
  modalContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: '85%',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

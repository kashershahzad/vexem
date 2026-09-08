/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../utils/colors';
import Icons from './Icons';
import fonts from '../assets/fonts';

const MessageBox = ({ item, user_id, onImgPress, onDownload, time }) => {
  //

  return (
    <View style={styles.container}>
      {user_id !== item?.sender ? (
        <View style={styles.rightContainer}>
          {item?.type === 'text' ? (
            <View style={styles.textRightContainer}>
              <Text style={styles.rightmsg}>{item?.message}</Text>
              <Text style={styles.timeText}>{time}</Text>
            </View>
          ) : (
            <View style={{ alignItems: 'flex-end' }}>
              {item?.loader && (
                <View style={styles.loaderBox}>
                  <ActivityIndicator size={30} color={colors.white} />
                </View>
              )}
              {item?.type === 'doc' ? (
                <View style={[styles.fileBox, { borderBottomRightRadius: 0 }]}>
                  <Text style={styles.rightmsg}>{item?.message}</Text>
                  <View style={styles.justifyBtwRow}>
                    <TouchableOpacity style={styles.btn} onPress={onDownload}>
                      <Icons name="download" color={colors.white} size={18} />
                    </TouchableOpacity>
                    <Text style={[styles.timeText]}>{time}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.textRightContainer}>
                  <TouchableOpacity onPress={onImgPress}>
                    <Image source={{ uri: item?.message }} style={styles.img} />
                  </TouchableOpacity>
                  <Text style={[styles.timeText]}>{time}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.leftContainer}>
          {item?.type === 'text' ? (
            <View style={styles.textLeftContainer}>
              <Text style={styles.leftmsg}>{item?.message}</Text>
              <Text style={[styles.timeText, { color: 'black' }]}>{time}</Text>
            </View>
          ) : (
            <View style={{ alignItems: 'flex-start' }}>
              {item?.loader && (
                <View style={styles.loaderBox}>
                  <ActivityIndicator size={30} color={colors.white} />
                </View>
              )}
              {item?.type === 'doc' ? (
                <View
                  style={[
                    styles.fileBox,
                    {
                      backgroundColor: colors.grey3,
                      borderBottomLeftRadius: 0,
                    },
                  ]}>
                  <Text style={styles.leftmsg}>{item?.message}</Text>
                  <View style={styles.justifyBtwRow}>
                    <TouchableOpacity style={styles.btn} onPress={onDownload}>
                      <Icons name="download" color={colors.black} />
                    </TouchableOpacity>
                    <Text style={[styles.timeText, { color: 'black' }]}>
                      {time}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.textLeftContainer}>
                  <TouchableOpacity onPress={onImgPress}>
                    <Image source={{ uri: item?.message }} style={styles.img} />
                  </TouchableOpacity>
                  <Text style={[styles.timeText, { color: 'black' }]}>
                    {time}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 15,
  },
  img: {
    width: 200,
    borderRadius: 8,
    height: 150,
  },
  loaderBox: {
    width: 220,
    height: '100%',
    backgroundColor: '#0000009E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2,
  },
  fileBox: {
    borderColor: colors.grey2,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.primaryColor,
  },
  textLeftContainer: {
    alignItems: 'flex-start',
    maxWidth: '80%',
    backgroundColor: colors.grey3,
    overflow: 'hidden',
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    padding: 10,
    alignSelf: 'flex-start',
  },
  leftContainer: {
    alignItems: 'flex-start',
    maxWidth: '80%',
    backgroundColor: colors.grey3,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderBottomLeftRadius: 0,
  },

  rightContainer: {
    alignItems: 'flex-end',
    maxWidth: '80%',
    backgroundColor: colors.primaryColor,
    overflow: 'hidden',
    alignSelf: 'flex-end',
    borderRadius: 8,
    borderBottomRightRadius: 0,
  },
  textRightContainer: {
    alignItems: 'flex-end',
    maxWidth: '80%',
    backgroundColor: colors.primaryColor,
    overflow: 'hidden',
    borderRadius: 8,
    borderBottomRightRadius: 0,
    padding: 10,
    alignSelf: 'flex-end',
  },
  leftmsg: {
    color: colors.black,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  rightmsg: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  timeText: {
    color: colors.white,
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 5,
  },
  btn: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  justifyBtwRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default MessageBox;

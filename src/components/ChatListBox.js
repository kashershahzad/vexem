import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Images } from '../assets/images';
import CustomText from './CustomText';
import { colors } from '../utils/colors';
import fonts from '../assets/fonts';
import moment from 'moment';
import { imgUrl } from '../utils/constants';

const ChatListBox = ({ item, onPress }) => {
  const time = moment(item?.updatedAt).format('HH:mm A');
  return (
    <Pressable style={styles.listBox} onPress={onPress}>
      <Image
        source={
          item?.otherUser?.profileImage
            ? { uri: imgUrl + item?.otherUser?.profileImage }
            : Images.user
        }
        style={styles.avatar}
      />
      <View style={styles.innerBox}>
        <View style={styles.txtBox}>
          <CustomText
            label={item?.otherUser?.firstName}
            fontFamily={fonts.semiBold}
            fontSize={16}
            numberOfLines={1}
          />
          <CustomText
            label={item?.lastMsg?.message}
            fontFamily={fonts.semiBold}
            marginTop={2}
            color={colors.grey}
            numberOfLines={1}
          />
        </View>
        <View style={styles.rightBox}>
          <CustomText label={time} fontSize={12} />
          {item?.unseen > 0 && (
            <View style={styles.circle}>
              <CustomText label={item?.unseen} color={colors.white} />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default ChatListBox;

const styles = StyleSheet.create({
  listBox: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
  },
  innerBox: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    resizeMode: 'center',
    marginRight: 10,
  },
  circle: {
    backgroundColor: '#fa4d1e',
    width: 25,
    height: 25,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    maxWidth: 30,
  },
  rightBox: {
    alignItems: 'center',
  },
  txtBox: {
    flex: 1,
  },
});

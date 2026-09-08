import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import fonts from '../../../../assets/fonts';
import CustomText from '../../../../components/CustomText';
import Icons from '../../../../components/Icons';
import ImageFast from '../../../../components/ImageFast';
import { colors } from '../../../../utils/colors';
import { imgUrl } from '../../../../utils/constants';
import { Images } from '../../../../assets/images';

const UserCard = ({ name, source, onPress }) => {
  return (
    <View style={styles.card}>
      <ImageFast
        source={source ? { uri: imgUrl + source } : Images.user}
        style={styles.avatar}
      />
      <View style={{ flex: 1 }}>
        <CustomText label={name} fontSize={16} fontFamily={fonts.bold} />
      </View>
      <TouchableOpacity
        style={styles.chat}
        activeOpacity={0.5}
        onPress={onPress}>
        <Icons
          family={'Feather'}
          name={'message-square'}
          size={20}
          color={colors.black}
        />
      </TouchableOpacity>
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 12,
  },
  avatar: {
    height: 42,
    width: 42,
    borderRadius: 99,
    marginRight: 10,
  },
  chat: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Images } from '../../../../assets/images';
import CustomText from '../../../../components/CustomText';
import { colors } from '../../../../utils/colors';
import Icons from '../../../../components/Icons';

const SocialContainer = ({
  customStyle,
  onCommentPress,
  onLike,
  isLike,
  canDelete,
  onDelete,
  onShare,
  onSave,
  isSave,
  likeCount,
  disableShare,
}) => {
  return (
    <View style={[customStyle, styles.container]}>
      <TouchableOpacity
        style={styles.likeBtn}
        activeOpacity={0.6}
        onPress={onLike}>
        <Icons
          name={'like1'}
          color={isLike ? colors.red : colors.black}
          family={'AntDesign'}
        />
        <CustomText
          label={likeCount || 0}
          fontSize={10}
          width={30}
          alignSelf={'center'}
          textAlign={'center'}
          numberOfLines={1}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onCommentPress}
        style={{ alignItems: 'center', marginRight: 20 }}>
        <Image
          source={Images.comment}
          style={{ height: 24, width: 24, alignItems: 'center' }}
        />
        <CustomText label={'Comment'} fontSize={8} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onShare}
        disabled={disableShare}
        style={{ alignItems: 'center', marginRight: 4 }}>
        <Image source={Images.share} style={styles.icon} />
        <CustomText label={'Share'} fontSize={8} />
      </TouchableOpacity>
      <TouchableOpacity style={{ marginLeft: 18 }} onPress={onSave}>
        <Icons
          name={ isSave ? 'heart' : 'hearto'}
          family={'AntDesign'}
          size={25}
          color={isSave ? 'red' : colors.black}
        />
       
        <CustomText
          label={'Save'}
          fontSize={8}
          alignSelf={'center'}
          color={isSave ? colors.primaryColor : colors.black}
        />
      </TouchableOpacity>
      {canDelete && (
        <TouchableOpacity
          style={{ marginLeft: 18, alignItems: 'center' }}
          onPress={onDelete}>
          <Icons name={'delete'} family={'AntDesign'} color={colors.red} />
          <CustomText label={'Delete'} fontSize={8} marginTop={4} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SocialContainer;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: colors.white,
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 24,
    padding: 12,
  },
  likeBtn: {
    borderRadius: 99,
    backgroundColor: '#f6f5fa',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
    top: -18,
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

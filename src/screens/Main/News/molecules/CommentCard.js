/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Images } from '../../../../assets/images';
import CustomText from '../../../../components/CustomText';
import ImageFast from '../../../../components/ImageFast';
import { colors } from '../../../../utils/colors';
import Icons from '../../../../components/Icons';
import fonts from '../../../../assets/fonts';
import { imgUrl } from '../../../../utils/constants';

const CommentCard = ({ item, onLike, onDelete, canDelete }) => {
  return (
    <View style={styles.box}>
      <ImageFast
        source={
          item?.user?.image ? { uri: imgUrl + item?.user?.image } : Images.user
        }
        style={styles.img}
      />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <CustomText
          label={item?.user?.name}
          fontSize={12}
          color={colors.black}
        />

        <CustomText
          label={item?.comment}
          fontSize={15}
          marginTop={2}
          fontFamily={fonts.semiBold}
        />
        <CustomText label={item?.date} fontSize={10} color={colors.grey} />

        <View style={styles.row}>
          <TouchableOpacity style={{ padding: 5 }} onPress={onLike}>
            <Icons
              name={'like1'}
              color={item?.like === 'like' ? colors.primaryColor : colors.black}
              family={'AntDesign'}
              size={17}
            />
          </TouchableOpacity>
          {canDelete && (
            <TouchableOpacity
              style={{ padding: 5, marginLeft: 5 }}
              onPress={onDelete}>
              <Icons
                name={'delete'}
                color={colors.red}
                family={'AntDesign'}
                size={17}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default CommentCard;

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 14,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  img: {
    height: 32,
    width: 32,
    borderRadius: 99,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
});

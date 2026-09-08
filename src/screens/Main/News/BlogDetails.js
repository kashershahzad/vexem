import { StyleSheet } from 'react-native';
import React from 'react';
import ScreenWrapper from '../../../components/ScreenWrapper';
import Header from '../../../components/Header';
import ImageFast from '../../../components/ImageFast';
import { Images } from '../../../assets/images';
import CustomText from '../../../components/CustomText';
import fonts from '../../../assets/fonts';
import { imgUrl } from '../../../utils/constants';

const BlogDetails = ({ route }) => {
  const item = route.params.item;

  const stripHtmlTags = html => {
    return html.replace(/<[^>]+>/g, '');
  };

  const plainTextDescription = stripHtmlTags(item?.description);

  return (
    <ScreenWrapper
      scrollEnabled
      paddingBottom={12}
      headerUnScrollable={() => <Header title={'Blogs'} />}>
      <ImageFast
        source={item?.image ? { uri: imgUrl + item?.image } : Images.events}
        style={{ width: '100%', height: 250, borderRadius: 12, marginTop: 12 }}
      />
      <CustomText
        fontSize={16}
        fontFamily={fonts.bold}
        label={item?.title}
        marginTop={8}
      />
      <CustomText label={plainTextDescription} />
    </ScreenWrapper>
  );
};

export default BlogDetails;

const styles = StyleSheet.create({});

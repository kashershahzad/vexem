/* eslint-disable react-native/no-inline-styles */
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  BackHandler,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import RenderHtml from 'react-native-render-html';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';
import fonts from '../../../assets/fonts';
import { Images } from '../../../assets/images';
import { AppLoader } from '../../../components/AppLoader';
import ConfirmationModal from '../../../components/ConfirmationModal';
import CustomInput from '../../../components/CustomInput';
import CustomText from '../../../components/CustomText';
import EmptyComponent from '../../../components/EmptyComponent';
import Icons from '../../../components/Icons';
import ImageFast from '../../../components/ImageFast';
import ApiRequest from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import { imgUrl } from '../../../utils/constants';
import { ToastMessage } from '../../../utils/ToastMessage';
import CommentCard from './molecules/CommentCard';
import SocialContainer from './molecules/SocialContainer';

const NewsDetails = ({ route }) => {
  //

  const blogId = route.params?.blogId;

  const navigation = useNavigation();
  const insets =useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const { token, loginUser } = useSelector(store => store.user);

  const [blog, setBlog] = useState({});

  const [data, setData] = useState([]);

  const [save, setSave] = useState(false);
  const [show, setShow] = useState(false);
  const [banner, setBanner] = useState({});
  const [comment, setComment] = useState('');
  const [commentId, setCommentId] = useState('');
  const [loader, setLoader] = useState(false);
  const [like, setLike] = useState(blog?.like);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageLoader, setPageLoader] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentloader, setCommentLoader] = useState(false);

  const isOwner = loginUser?.id === blog?.user_id;

  const handleAddComment = async () => {
    try {
      const now = new Date();

      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };

      const formattedDate = now.toLocaleDateString('en-US', options);

      const newComment = {
        comment,
        date: formattedDate,
      };

      setData([newComment, ...data]);

      const dataToAdd = {
        type: 'add_data',
        table_name: 'blog_comments',
        user_id: token,
        comment: comment.trim(),
        blog_id: blog?.id,
      };

      setComment('');

      const res = await ApiRequest(dataToAdd);

      setComment('');
      // fetchComments();
    } catch (error) {
      console.log(error, 'err in add comment');
    }
  };

  const handleDelete = async () => {
    try {
      setCommentLoader(true);
      const dataToDelete = {
        type: 'delete_data',
        table_name: 'blog_comments',
        user_id: token,
        id: commentId,
      };
      await ApiRequest(dataToDelete);
      setCommentId('');
      setShow(false);
      setCommentLoader(false);
      fetchComments();
    } catch (error) {
      console.log(error, 'err in delete comment');
      setCommentId('');
      setShow(false);
      setCommentLoader(false);
    }
  };

  const handleDeleteNews = async () => {
    setLoading(true);
    try {
      const dataToGet = {
        type: 'delete_data',
        table_name: 'blogs',
        user_id: token,
        id: blog?.id,
      };
      const response = await ApiRequest(dataToGet);

      if (response.data?.result) {
        setVisible(false);
        navigation.goBack();
      }
      setLoading(false);
    } catch (error) {
      console.log(error, 'err in deleting news');
      setLoading(false);
    }
  };

  const handleLikeDislike = async (id, index) => {
    try {
      let commentLike = '';
      let newsLike = '';

      newsLike = like === 'like' ? 'dislike' : 'like';

      let updatedData = [...data];

      if (id) {
        commentLike = updatedData[index].like === 'like' ? 'dislike' : 'like';
        updatedData[index].like = commentLike;
        setData(updatedData);
      } else {
        setLike(newsLike);
      }

      const dataToSend = {
        type: 'add_data',
        table_name: 'blog_likes',
        user_id: token,
        comment_id: id || 0,
        blog_id: blog?.id,
        like_type: id ? commentLike : newsLike,
      };

      await ApiRequest(dataToSend);

      if (id) {
        fetchComments();
      }
    } catch (error) {
      console.log(error, 'err in like dislike');
    }
  };

  const onGetBanner = async () => {
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'slider',
        limit: 1,
        slider_type: 'ad',
      };
      const res = await ApiRequest(dataToGet);

      if (res.data?.data?.length > 0) {
        setBanner(res.data.data[0]);
      }
    } catch (error) {
      console.log(error, 'err in getting banner');
    }
  };

  const onOpenLink = () => {
    try {
      const url = banner?.third_party_link;
      if (!url) {
        return ToastMessage('Unable to open url');
      }

      Linking.openURL(url);
    } catch (error) {
      console.log(error, 'err in open link');
    }
  };

  const blogImg = blog?.image;
  const isOnlyUrl = blogImg === imgUrl;
  const url =
    blogImg && !isOnlyUrl && blogImg?.includes(imgUrl)
      ? blogImg
      : imgUrl + blogImg;

  const onGetUrl = title => {
    return title.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
  };

  // const onShareNews = async () => {
  //   try {
  //     setLoader(true);

  //     const title = onGetUrl(blog?.slug ? blog?.slug : blog?.title);
  //     const adUrl = `https://halooq.com/item/NewsDetails/${title}/${blog?.id}`;
  //     const imageUrl = blogImg?.includes(imgUrl) ? blogImg : imgUrl + blogImg;

  //     const localImagePath = `${RNFS.DocumentDirectoryPath}/image.jpg`;

  //     const downloadResponse = await RNFS.downloadFile({
  //       fromUrl: imageUrl,
  //       toFile: localImagePath,
  //     }).promise;

  //     if (downloadResponse.statusCode === 200) {
  //       const path =
  //         Platform.OS === 'android'
  //           ? `file://${localImagePath}`
  //           : localImagePath;

  //       const shareOptions = {
  //         message: `${blog?.title}\n${adUrl}`,
  //         url: path,
  //         type: 'image/jpeg',
  //       };
  //       setLoader(false);
  //       await Share.open(shareOptions);
  //     } else {
  //       console.log('Error downloading the image');
  //       setLoader(false);
  //     }
  //   } catch (error) {
  //     console.log('Error sharing the ad:', error);
  //     setLoader(false);
  //   }
  // };



  const onShareNews = async () => {
  const imageUrl = blogImg?.includes(imgUrl) ? blogImg : imgUrl + blogImg;
  console.log(imageUrl);
  
  
  if (!imageUrl || !blogImg) {
    console.log("No image URL available for sharing");
    return;
  }

  setLoader(true);
  let downloadedFilePath = null;
  try {
    // Create a unique filename for the downloaded image
    const timestamp = Date.now();
    const fileExtension = imageUrl.split(".").pop() || "jpg";
    const fileName = `news_image_${timestamp}.${fileExtension}`;
    const downloadPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
    
    // Generate the news URL
    const title = onGetUrl(blog?.slug ? blog?.slug : blog?.title);
    const adUrl = `https://vexem.co/item/NewsDetails/${title}/${blog?.id}`;

    const downloadResult = await RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: downloadPath,
      background: false,
      discretionary: false,
    }).promise;

    if (downloadResult.statusCode === 200) {
      downloadedFilePath = downloadPath;

      // Share the downloaded image file
      const shareOptions = {
        title: blog?.title,
        message: `${blog?.title}\n${adUrl}`,
        url: `file://${downloadedFilePath}`,
        type: "image/jpeg",
      };

      await Share.open(shareOptions);
    } else {
      throw new Error(
        `Download failed with status code: ${downloadResult.statusCode}`
      );
    }
  } catch (error) {
    if (error.message !== "User did not share") {
      console.log("Error sharing the news:", error);
    }
  } finally {
    // Clean up the downloaded file
    if (downloadedFilePath) {
      try {
        const fileExists = await RNFS.exists(downloadedFilePath);
        if (fileExists) {
          await RNFS.unlink(downloadedFilePath);
          console.log("Temporary file cleaned up:", downloadedFilePath);
        }
      } catch (cleanupError) {
        console.log("Error cleaning up temporary file:", cleanupError);
      }
    }
    setLoader(false);
  }
};
  const handleEdit = () => {
    navigation.navigate('CreateNews', { news: blog, catdata: blog?.category });
  };

  const fetchComments = async () => {
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'blog_comments',
        blog_id: blogId,
        user_id: token,
      };

      const response = await ApiRequest(dataToGet);

      if (response.data.data) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error, 'err in getting comments');
    }
  };

  const saveNews = async () => {
    try {
      const dataToPost = {
        type: 'add_data',
        table_name: 'blog_saves',
        user_id: token,
        blog_id: blog?.id,
        like_type: blog?.save === 'save' ? 'unsave' : 'save',
      };

      const res = await ApiRequest(dataToPost);

      fetchNews();
    } catch (error) {
      console.log(error, 'err in getting comments');
    }
  };

  const fetchNews = async () => {
    try {
      setPageLoader(true);
      const dataToPost = {
        type: 'get_data',
        table_name: 'blogs',
        id: blogId,
        user_id: token,
      };

      const res = await ApiRequest(dataToPost);
      const news = res.data?.data?.[0];

      setBlog(news);
      setPageLoader(false);
    } catch (error) {
      console.log(error, 'err in news fetch');
      setPageLoader(false);
    }
  };
  useEffect(() => {
    fetchNews();
  }, [blogId]);

  useEffect(() => {
    // handleView();
    fetchComments();
    onGetBanner();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'MainStack' }],
              }),
            );
        return true;
      },
    );

    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  const description = blog?.description || '';

  return pageLoader ? (
    <View style={styles.container}>
      <CustomText
        fontSize={18}
        label={'Loading...'}
        fontFamily={fonts.semiBold}
      />
    </View>
  ) : !blog ? (
    <View style={styles.container}>
      <EmptyComponent title={'No News found'} />
    </View>
  ) : (
    <>
      <View style={styles.mainContainer}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
        <View style={{ zIndex: 1, height: 300 }}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.goBack()}
              style={[styles.headerIcon, {marginTop: insets.top}]}>
              <Icons name={'arrowleft'} family={'AntDesign'} size={14} />
            </TouchableOpacity>
            {isOwner && (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={handleEdit}
                style={styles.rightIcon}>
                <CustomText label={'Edit'} fontFamily={fonts.semiBold} />
              </TouchableOpacity>
            )}
          </View>
          <ImageFast
            source={blogImg ? { uri: url } : Images.news}
            style={styles.img}
          />
          {token && (
            <View style={styles.box}>
              <SocialContainer
                onCommentPress={() => setShowComments(true)}
                isLike={like === 'like' ? true : false}
                onLike={() => handleLikeDislike(null)}
                onDelete={() => setVisible(true)}
                onSave={saveNews}
                likeCount={blog?.likes}
                disableShare={loader}
                onShare={onShareNews}
                canDelete={isOwner}
                isSave={blog?.save === 'save' ? true : false}
              />
            </View>
          )}
        </View>
        <KeyboardAvoidingView
          style={{ flexGrow: 1, flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
            {banner?.image && (
              <TouchableOpacity
                onPress={onOpenLink}
                activeOpacity={0.5}
                disabled={banner?.third_party_link ? false : true}>
                <ImageFast
                  source={{ uri: imgUrl + banner?.image }}
                  style={[styles.adImg]}
                />
              </TouchableOpacity>
            )}
            <View style={{ paddingHorizontal: 16, flex: 1 }}>
              {!showComments ? (
                <>
                  <View style={[styles.row, { marginTop: 10 }]}>
                    <CustomText label={blog?.created_at} fontSize={10} />
                    <View style={[styles.row, { marginLeft: 20 }]}>
                      <Icons name={'eye'} family={'AntDesign'} />
                      <CustomText
                        label={blog?.views}
                        fontSize={10}
                        marginLeft={3}
                      />
                    </View>
                  </View>
                  <CustomText
                    label={blog?.title}
                    fontSize={19}
                    fontFamily={fonts.semiBold}
                  />
                  <RenderHtml
                    contentWidth={width}
                    source={{ html: description }}
                  />
                  <CustomText
                    label={`tags: ${blog?.tags}`}
                    fontSize={12}
                    fontFamily={fonts.semiBold}
                    marginBottom={8}
                    marginTop={5}
                    color={colors.primaryColor}
                  />
                </>
              ) : (
                <>
                  <View
                    style={[styles.row, { justifyContent: 'space-between' }]}>
                    <CustomText
                      label={`Total comments: ${data.length}`}
                      marginTop={15}
                      marginBottom={15}
                    />
                    <TouchableOpacity
                      activeOpacity={0.5}
                      style={{ padding: 5 }}
                      onPress={() => setShowComments(false)}>
                      <Icons name={'close'} />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={data}
                    ListEmptyComponent={
                      <EmptyComponent
                        imgStyle={{
                          width: 120,
                          height: 120,
                          resizeMode: 'center',
                        }}
                        title={'No comments addded yet'}
                      />
                    }
                    renderItem={({ item, index }) => (
                      <CommentCard
                        item={item}
                        onLike={() => handleLikeDislike(item.id, index)}
                        onDelete={() => {
                          setCommentId(item.id);
                          setShow(true);
                        }}
                        canDelete={item?.user?.id === loginUser?.id}
                      />
                    )}
                  />
                </>
              )}
            </View>
          </ScrollView>
          {showComments && (
            <View style={styles.inputContainer}>
              <CustomInput
                width={'80%'}
                placeholder={'Add comment here...'}
                value={comment}
                onChangeText={e => setComment(e)}
                containerStyle={{ marginBottom: 0 }}
              />
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    backgroundColor:
                      comment?.trim() === ''
                        ? colors.grey
                        : colors.primaryColor,
                  },
                ]}
                activeOpacity={0.5}
                disabled={comment?.trim() === ''}
                onPress={handleAddComment}>
                <Icons name={'send'} color={'#fff'} />
              </TouchableOpacity>
            </View>
          )}
          <ConfirmationModal
            visible={visible}
            hideModal={() => setVisible(false)}
            onPress={handleDeleteNews}
            loading={loading}
            message={'Are you sure you want to delete this news?'}
          />
          <ConfirmationModal
            visible={show}
            onPress={handleDelete}
            loading={commentloader}
            hideModal={() => setShow(false)}
            message={'Do you want to delete this comment?'}
          />
        </KeyboardAvoidingView>
      </View>

      <AppLoader show={loader} />
    </>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f6f5fa',
    flexGrow: 1,
  },
  commentsContainer: {
    flex: 1,
    backgroundColor: '#f6f5fa',
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
  },
  headerIcon: {
    borderRadius: 99,
    backgroundColor: colors.white,
    padding: 10,
  },
  rightIcon: {
    borderRadius: 5,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  img: {
    height: 270,
    width: '100%',
    zIndex: -1,
  },
  box: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    bottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adImg: {
    height: 104,
    width: 350,
    alignSelf: 'center',
    marginTop: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: colors.white,
    elevation: 10,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: colors.primaryColor,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    top: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import { useSelector } from "react-redux";
import { AppLoader } from "../../../components/AppLoader";
import ConfirmationModal from "../../../components/ConfirmationModal";
import CustomButton from "../../../components/CustomButton";
import Header from "../../../components/Header";
import Icons from "../../../components/Icons";
import ImageFastWrapper from "../../../components/ImageFast";
import SliderModal from "../../../components/ModaISlider";
import ScreenWrapper from "../../../components/ScreenWrapper";
import ApiRequest from "../../../services/ApiRequest";
import { colors } from "../../../utils/colors";
import { imgUrl } from "../../../utils/constants";
import { ToastMessage } from "../../../utils/ToastMessage";

const OfferAdDetails = ({ route, navigation }) => {
  const { ad: paramAd } = route.params;
  const itemId = route.params.itemId;

  const { token, loginUser } = useSelector((store) => store.user);

  const [currentAd, setCurrentAd] = useState(paramAd || {});
  const [like, setLike] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [Loader1, setLoader1] = useState(false);
  const [appLoading, setappLoading] = useState(false);
  const [FeatureLodaing, setFeatureLodaing] = useState(false);
  const [selectedAd, setSelectedAd] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  // ADD: State to track the initial image index for modal
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  // FIXED: Create a single source of truth for processed images
  const processedImages = useMemo(() => {
    const images = JSON.parse(currentAd?.other_images || "[]");

    if (!Array.isArray(images)) return [];

    return images.map((image, index) => {
      const isFullUrl =
        image.startsWith("http://") || image.startsWith("https://");
      // Use the same URL format for both grid and modal
      const baseUrl = isFullUrl ? image : `${imgUrl}${image}`;

      return {
        uri: `${baseUrl}?w=400&q=80&f=webp`, // Consistent format
        originalUri: baseUrl, // Keep original for modal if needed
        id: index,
      };
    });
  }, [currentAd?.other_images]);

  // FIXED: Use the same processed images for grid display
  const preparedImages = processedImages;

  // FIXED: Extract just the URIs for modal (same as prepared images)
  const modalImageUris = useMemo(() => {
    return processedImages.map((img) => img.uri);
  }, [processedImages]);

  const preloadImages = useCallback(async () => {
    if (preparedImages.length > 0 && !imagesPreloaded) {
      try {
        const imagesToPreload = preparedImages.slice(0, 6).map((img) => ({
          uri: img.uri,
          priority: FastImage.priority.high,
        }));

        FastImage.preload(imagesToPreload);

        if (preparedImages.length > 6) {
          const remainingImages = preparedImages.slice(6).map((img) => ({
            uri: img.uri,
            priority: FastImage.priority.normal,
          }));

          setTimeout(() => {
            FastImage.preload(remainingImages);
          }, 500);
        }

        setImagesPreloaded(true);
      } catch (error) {
        console.log("Error preloading images:", error);
      }
    }
  }, [preparedImages, imagesPreloaded]);

  useEffect(() => {
    if (preparedImages.length > 0) {
      preloadImages();
    }
  }, [preparedImages, preloadImages]);

  useEffect(() => {
    return () => {
      if (preparedImages.length > 20) {
        FastImage.clearMemoryCache();
      }
    };
  }, [preparedImages.length]);

  useEffect(() => {
    setLike(currentAd?.like === "like" ? true : false);
  }, [currentAd]);

  const myAd = loginUser?.id === currentAd?.user_id;

  const handleDelete = async () => {
    try {
      setLoading(true);
      const dataToDelete = {
        type: "delete_data",
        table_name: "items",
        id: currentAd?.id,
        user_id: token,
      };

      const res = await ApiRequest(dataToDelete);
      if (res.data?.result) {
        setVisible(false);
        navigation.goBack();
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "err in deleting offer");
      setLoading(false);
    }
  };

  const handleGetData = async () => {
    try {
      setLoader(true);
      const dataToGet = {
        type: "get_data",
        table_name: "items",
        item_type: "offer",
        id: itemId,
        user_id: token,
      };
      const res = await ApiRequest(dataToGet);

      if (res?.data?.data && res.data.data.length > 0) {
        const apiAdData = res.data.data[0];
        setCurrentAd(apiAdData);
      } else {
        if (!paramAd) {
          ToastMessage("Unable to load ad details");
          navigation.goBack();
        }
      }
      setLoader(false);
    } catch (error) {
      console.log(error, "err in getting offer data");
      setLoader(false);

      if (!paramAd) {
        ToastMessage("Failed to load ad details");
        navigation.goBack();
      }
    }
  };

  useEffect(() => {
    if (itemId) {
      handleGetData();
    } else if (paramAd) {
      setCurrentAd(paramAd);
    }
  }, [itemId]);

  const handlePress = async () => {
    const url = currentAd?.offer_link?.includes("https://")
      ? currentAd?.offer_link
      : "https://" + currentAd?.offer_link;

    Linking.canOpenURL(url)
      .then((res) => {
        if (res) {
          Linking.openURL(url);
        }
      })
      .catch((err) => {
        console.error("Failed to open URL:", err);
      });
  };

  const handlefeatureAdd = async () => {
    setFeatureLodaing(true);
    const dataToGet = {
      type: "add_data",
      table_name: "feature_ads",
      user_id: token,
      item_id: currentAd?.id,
    };
    const res = await ApiRequest(dataToGet);
    if (res?.data?.result) {
      navigation.navigate("Offers");
      ToastMessage("Your ad featured successfully");
      setFeatureLodaing(false);
    } else {
      setFeatureLodaing(false);
      ToastMessage(res?.data?.message);
    }
    setFeatureLodaing(false);
  };

  const handlefeatureRemove = async () => {
    setFeatureLodaing(true);
    const dataToGet = {
      type: "update_data",
      table_name: "items",
      featured: 0,
      user_id: token,
      id: currentAd?.id,
    };

    const res = await ApiRequest(dataToGet);

    if (res?.data?.result) {
      ToastMessage("Your ad removed from feature successfully");
      navigation.navigate("Offers");
    }

    setFeatureLodaing(false);
  };

  const onGetUrl = (title) => {
    return title.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
  };

  const onShareAd = async () => {
    // Check if currentAd.images exists first
    if (!currentAd?.images) {
      console.log("No currentAd.images available for sharing");
      return;
    }

    // Check if image URL is available and construct it properly
    const imageUrl = currentAd?.images?.includes(imgUrl)
      ? currentAd?.images
      : `${imgUrl}${currentAd?.images}`;

    console.log("currentAd.images:", currentAd?.images);
    console.log("imgUrl:", imgUrl);
    console.log("constructed imageUrl:", imageUrl);

    if (
      !imageUrl ||
      imageUrl === imgUrl ||
      imageUrl.includes("undefined") ||
      imageUrl.includes("null")
    ) {
      console.log("Invalid image URL constructed for sharing:", imageUrl);
      return;
    }

    setLoader(true);
    let downloadedFilePath = null;

    try {
      // Create a unique filename for the downloaded image
      const timestamp = Date.now();
      const fileExtension = imageUrl.split(".").pop() || "jpg";
      const fileName = `offer_image_${timestamp}.${fileExtension}`;
      const downloadPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      // Generate the offer URL and message content
      const name = onGetUrl(currentAd?.name);
      const cleanDesc = onGetUrl(currentAd?.description);
      const adUrl = `https://vexem.co/offer/${name}/${currentAd?.id}`;

      // Validate the constructed URL before downloading
      if (!downloadPath || !imageUrl.startsWith("http")) {
        throw new Error(`Invalid image URL: ${imageUrl}`);
      }

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
          title: currentAd?.name,
          message: `${name}\n${cleanDesc}\n${
            currentAd?.price > 0 ? `Price: QR ${currentAd.price}\n` : ""
          }${adUrl}`,
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
        console.log("Error sharing the offer:", error);
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

  // FIXED: Store the clicked image index and show modal
  const handleImagePress = useCallback(
    (imageIndex) => {
      setSelectedAd(currentAd);
      setInitialImageIndex(imageIndex); // Set the initial index
      setShowImageModal(true);
    },
    [currentAd]
  );

  const downloadFile = async () => {
    const path = imgUrl + currentAd?.pdf_file;
    const fileName = path?.split("/").pop();
    const destination =
      Platform.OS === "ios"
        ? `${RNFS.DocumentDirectoryPath}/${fileName}`
        : `${RNFS.DownloadDirectoryPath}/${fileName}`;
    setLoader1(true);
    try {
      const download = RNFS.downloadFile({
        fromUrl: path,
        toFile: destination,
      });

      const result = await download.promise;

      if (result.statusCode === 200) {
        ToastMessage("File downloaded successfully");
        FileViewer.open(destination, { showOpenWithDialog: true });
      } else {
        console.log("Failed to download file:", result);
      }
      setLoader1(false);
    } catch (err) {
      console.log("Error downloading file:", err);
      setLoader1(false);
    }
  };

  const handleLikeDislike = async () => {
    try {
      setLike(!like);
      const dataToSend = {
        type: "add_data",
        table_name: "blog_likes",
        user_id: token,
        item_id: currentAd?.id,
        like_type: like ? "dislike" : "like",
      };

      await ApiRequest(dataToSend);
    } catch (error) {
      console.log(error, "err in like dislike");
    }
  };

  const renderImageItem = useCallback(
    ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleImagePress(index)}
          style={styles.imageContainer}
        >
          <ImageFastWrapper
            source={{ uri: item.uri }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      );
    },
    [handleImagePress]
  );

  return (
    <>
      <ScreenWrapper
        scrollEnabled
        headerUnScrollable={() => (
          <Header
            title={"Ad Details"}
            headerLeftIcon={
              <View style={styles.headerContainer}>
                <>
                  {!myAd && (
                    <>
                      {token && (
                        <TouchableOpacity
                          activeOpacity={1}
                          style={styles.heartBox}
                          onPress={handleLikeDislike}
                        >
                          <Icons
                            name={like ? "heart" : "hearto"}
                            family={"AntDesign"}
                            size={20}
                            color={like ? colors.red : colors.black}
                          />
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </>

                <TouchableOpacity
                  style={{ marginRight: 15 }}
                  onPress={onShareAd}
                >
                  <Icons name={"share"} family={"Entypo"} size={23} />
                </TouchableOpacity>

                {myAd && (
                  <>
                    <TouchableOpacity
                      style={[styles.deleteIcon, { marginRight: 15 }]}
                      onPress={() =>
                        navigation.navigate("CreateOfferAd", { ad: currentAd })
                      }
                    >
                      <Icons name={"edit"} family={"Feather"} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.deleteIcon, { marginRight: 5 }]}
                      onPress={() => setVisible(true)}
                    >
                      <Icons
                        name={"delete"}
                        family={"MaterialCommunityIcons"}
                        color={colors.red}
                        size={23}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            }
          />
        )}
        footerUnScrollable={() => (
          <>
            <View style={styles.btnBox}>
              {currentAd?.pdf_file && (
                <CustomButton
                  loading={Loader1}
                  onPress={downloadFile}
                  title={"Download Brochure"}
                />
              )}
            </View>
            <View style={styles.btnBox}>
              <>
                {myAd && (
                  <CustomButton
                    loading={FeatureLodaing}
                    onPress={
                      currentAd?.featured === "1"
                        ? handlefeatureRemove
                        : handlefeatureAdd
                    }
                    title={
                      currentAd?.featured === "1"
                        ? "Remove Feature Add "
                        : "Feature this Add "
                    }
                    width={currentAd?.offer_link ? "48%" : "100%"}
                  />
                )}
              </>

              {currentAd?.offer_link && (
                <CustomButton
                  loading={FeatureLodaing}
                  onPress={handlePress}
                  width={myAd ? "48%" : "100%"}
                  title={"Visit Now"}
                />
              )}
            </View>
          </>
        )}
      >
        <FlatList
          data={preparedImages}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => `image-${index}`}
          numColumns={2}
          contentContainerStyle={styles.imageGrid}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={10}
          initialNumToRender={6}
        />

        <ConfirmationModal
          visible={visible}
          hideModal={() => setVisible(false)}
          onPress={handleDelete}
          loading={loading}
          message={"Are you sure you want to delete this offer ad?"}
        />

        {/* FIXED: Pass the initial image index to modal */}
        <SliderModal
          data={currentAd}
          images={modalImageUris}
          isVisible={showImageModal}
          onDisable={() => setShowImageModal(false)}
          initialIndex={initialImageIndex} // Pass the clicked image index
        />
      </ScreenWrapper>
      <AppLoader show={loader} />
    </>
  );
};

export default OfferAdDetails;

const styles = StyleSheet.create({
  btnBox: {
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
  },
  container: {
    flex: 1,
  },
  imageGrid: {
    padding: 4,
  },
  imageContainer: {
    width: "48%",
    margin: "1%",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
  heartBox: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 50,
    marginRight: 5,
  },
});

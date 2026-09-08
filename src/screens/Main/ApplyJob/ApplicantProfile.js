import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import fonts from "../../../assets/fonts";
import { Images } from "../../../assets/images";
import { AppLoader } from "../../../components/AppLoader";
import CustomText from "../../../components/CustomText";
import Header from "../../../components/Header";
import Icons from "../../../components/Icons";
import ImageFastWrapper from "../../../components/ImageFast";
import ScreenWrapper from "../../../components/ScreenWrapper";
import ApiRequest from "../../../services/ApiRequest";
import { colors } from "../../../utils/colors";
import { imgUrl } from "../../../utils/constants";
import { ToastMessage } from "../../../utils/ToastMessage";
import EducationCard from "./Molecules/EducationCard";
import ExperienceCard from "./Molecules/ExperienceCard";
import PersonalnformationCard from "./Molecules/PersonalnformationCard";
import Portfolio from "./Molecules/Portfolio";
import SkillCard from "./Molecules/SkillCard";

const ApplicantProfile = ({ navigation }) => {
  const [profileData, setProfileData] = useState({});
  const [AplicatProfile, setAplicatProfile] = useState({});

  const [loader, setLoader] = useState(false);
  const route = useRoute();
  const routeProfileData = route.params?.profiledata;
  const userId = route.params?.userId;

  const getJobProfile = async () => {
    setLoader(true);
    try {
      const dataToGet = {
        type: "get_data",
        table_name: "job_description",
        id: userId,
      };
      const response = await ApiRequest(dataToGet);

      if (response.data) {
        const array = response.data?.data[0];
        setProfileData(array);
        setLoader(false);
      } else {
        setProfileData({});
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      setProfileData({});
      console.log(error, "err in getting job profile");
    }
  };

  useEffect(() => {
    if (userId) {
      // If userId exists, get data from API
      getJobProfile();
    } else {
      // If no userId, use profiledata from route params
      setProfileData(routeProfileData || {});
    }
  }, [userId]);

  // Parse extra_data when profileData changes
  useEffect(() => {
    try {
      if (profileData?.profile?.extra_data || profileData?.extra_data) {
        const parsedJobData = JSON.parse(
          profileData?.profile?.extra_data || profileData?.extra_data
        );
        setAplicatProfile(parsedJobData);
      }
    } catch (e) {
      console.warn("Error parsing job_data:", e);
    }
  }, [profileData]);

  const handleEmailPress = async () => {
    const url = `mailto:${
      profileData?.email ? profileData?.email : profileData?.profile?.email
    }`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "No email app available to send the message.");
    }
  };

  const handlePhonePress = async () => {
    let phone = profileData?.phone
      ? profileData?.phone
      : profileData?.profile?.phone;

    // Add "+" only if it's not already present
    if (phone && !phone.startsWith("+")) {
      phone = `+${phone}`;
    }
    console.log(phone);

    const url = `tel:${phone}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Phone call not supported on this device.");
    }
  };

  const handleWhatsAppPress = async () => {
    let phone = profileData?.phone
      ? profileData?.phone
      : profileData?.profile?.phone;

    if (phone && !phone.startsWith("+")) {
      phone = `+${phone}`;
    }

    console.log(phone);

    const url = `whatsapp://send?phone=${phone}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "WhatsApp is not installed on this device.");
    }
  };

  const onGetUrl = (title) => {
    return title.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
  };

  const handleDownload = async () => {
    let url = imgUrl + AplicatProfile?.resume;

    const fileName = url.split("/").pop();
    console.log(fileName);

    const destination =
      Platform.OS === "ios"
        ? `${RNFS.DocumentDirectoryPath}/${fileName}`
        : `${RNFS.DownloadDirectoryPath}/${fileName}`;
    setLoader(true);
    try {
      const download = RNFS.downloadFile({
        fromUrl: url,
        toFile: destination,
      });

      const result = await download.promise;

      if (result.statusCode === 200) {
        ToastMessage("File downloaded successfully");
        FileViewer.open(destination, { showOpenWithDialog: true });
      } else {
        console.log("Failed to download file:", result);
      }
      setLoader(false);
    } catch (err) {
      console.log("Error downloading file:", err);
      setLoader(false);
    }
  };

  const onShareAd = async () => {
    // Check if image URL is available
    const imageUrl = AplicatProfile?.image?.startsWith("http")
      ? AplicatProfile.image
      : `${imgUrl}${AplicatProfile.image}`;

    if (!imageUrl || !AplicatProfile?.image) {
      console.log("No image URL available for sharing");
      return;
    }

    

    setLoader(true);
    let downloadedFilePath = null;

    try {
      // Create a unique filename for the downloaded image
      const timestamp = Date.now();
      const fileExtension = imageUrl.split(".").pop() || "jpg";
      const fileName = `profile_image_${timestamp}.${fileExtension}`;
      const downloadPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
      
      // Generate the profile URL
      const name = onGetUrl(AplicatProfile?.fullname);
      
      const adUrl = `https://vexem.co/profile/${name}/${profileData?.id}`;

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
          title: AplicatProfile?.fullname,
          message: `${AplicatProfile?.fullname}\n${adUrl}`,
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
        console.log("Error sharing the profile:", error);
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

  return (
    <>
      <ScreenWrapper
        scrollEnabled={true}
        paddingHorizontal={0.1}
        headerUnScrollable={() => <Header title={"Profile Details"} />}
      >
        <Image
          source={
            AplicatProfile.cover?.startsWith("http")
              ? { uri: AplicatProfile.cover }
              : AplicatProfile?.cover
              ? { uri: `${imgUrl}${AplicatProfile.cover}` }
              : Images.profileCover
          }
          style={styles.cover}
        />

        <Image
          source={
            AplicatProfile.image?.startsWith("http")
              ? { uri: AplicatProfile.image }
              : AplicatProfile?.image
              ? { uri: `${imgUrl}${AplicatProfile.image}` }
              : Images.profileUser
          }
          style={styles.userImage}
          resizeMode="contain"
        />

        <View style={{ paddingHorizontal: 20 }}>
          <CustomText
            label={profileData?.profile?.fullname || profileData?.fullname}
            fontFamily={fonts.bold}
            alignSelf={"center"}
            marginTop={10}
            fontSize={16}
          />

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
              gap: 8,
            }}
          >
            <TouchableOpacity style={styles.btn} onPress={handleEmailPress}>
              <Icons
                name={"email"}
                family={"MaterialCommunityIcons"}
                size={20}
                color={colors.white}
              />
              <CustomText
                label={"Email"}
                fontFamily={fonts.semiBold}
                color={colors.white}
                fontSize={16}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handlePhonePress}>
              <Icons
                name={"call"}
                family={"Ionicons"}
                size={20}
                color={colors.white}
              />
              <CustomText
                label={"Call"}
                fontFamily={fonts.semiBold}
                color={colors.white}
                fontSize={16}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleWhatsAppPress}>
              <Icons
                name={"whatsapp"}
                family={"FontAwesome"}
                size={20}
                color={colors.white}
              />
              <CustomText
                label={"Whatsapp"}
                fontFamily={fonts.semiBold}
                color={colors.white}
                fontSize={16}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={handleDownload}>
              <ImageFastWrapper
                source={Images.downloadPorifle}
                resizeMode={"contain"}
                style={{ height: 20, width: 20 }}
              />
              <CustomText
                label={"View CV"}
                fontFamily={fonts.semiBold}
                color={colors.white}
                fontSize={16}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={onShareAd}>
              <Icons
                name={"sharealt"}
                family={"AntDesign"}
                size={20}
                color={colors.white}
              />

              <CustomText
                label={"Share"}
                fontFamily={fonts.semiBold}
                color={colors.white}
                fontSize={16}
              />
            </TouchableOpacity>
          </View>
          <PersonalnformationCard personalInformation={AplicatProfile} />

          <EducationCard education={AplicatProfile} />

          {AplicatProfile?.useWorkExp?.length > 0 && (
            <ExperienceCard exp={AplicatProfile} />
          )}

          {AplicatProfile?.skills?.length > 0 && (
            <SkillCard skills={AplicatProfile} />
          )}

          <Portfolio portfolio={AplicatProfile} />
        </View>
      </ScreenWrapper>
      <AppLoader show={loader} />
    </>
  );
};

export default ApplicantProfile;

const styles = StyleSheet.create({
  cover: {
    width: "100%",
    height: 200,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: -50,
    backgroundColor: "red",
    resizeMode: "contain",
    borderWidth: 4,
    borderColor: "#fff",
  },
  btn: {
    backgroundColor: "#A38CB6",
    height: 30,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 8,
    gap: 5,
  },
});

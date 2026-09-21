/* eslint-disable react-native/no-inline-styles */
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import jwt_decode from "jwt-decode";
import { useEffect, useMemo, useRef, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import DeviceInfo from "react-native-device-info";

import fonts from "../../../assets/fonts";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import CustomText from "../../../components/CustomText";
import Layout from "../../../components/Layout";
import { className } from "../../../global-styles";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { AppleIcon, GoogleIcon } from "../../../assets/images";
import { AppLoader } from "../../../components/AppLoader";
import CustomPhone from "../../../components/CustomPhone";
import Icons from "../../../components/Icons";
import PrivacySheet from "../../../components/PrivacySheet";
import Tab from "../../../components/TabBar";
import ApiRequest, { post } from "../../../services/ApiRequest";
import { setUserToken } from "../../../store/reducer/usersSlice";
import { colors } from "../../../utils/colors";
import { regEmail } from "../../../utils/Commonfun";
import { ToastMessage } from "../../../utils/ToastMessage";
import { validatePhone } from "../../../utils/constants";

const Login = () => {
  //

  const sheetRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();

  const init = {
    email: "",
    password: "",
    phone: "",
  };
  const inits = {
    emailError: "",
    passwordError: "",
    phoneError: "",
  };

  const [state, setState] = useState(init);
  const [agree, setAgree] = useState(true);
  const [content, setContent] = useState("");
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState(inits);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [contentLoader, setContentLoader] = useState(false);

  const validateField = (field, value) => {
    let error = "";

    if (field === "email") {
      if (!value) error = "Please enter email address";
      else if (!regEmail.test(value)) error = "Please enter valid email";
    } else if (field === "phone") {
      const valid = validatePhone(value);
      if (!value) error = "Please enter phone number";
      else if (!valid)
        error = "Please enter a valid 10-digit Pakistan phone number";
    } else if (field === "password") {
      if (!value) error = "Please enter password";
    }

    return error;
  };

  const handleInputChange = (field, value) => {
    setState((prevState) => ({ ...prevState, [field]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${field}Error`]: validateField(field, value),
    }));
  };

  const handleDeviceRegistration = async (id) => {
    try {
      let model = DeviceInfo.getModel();
      let fcmToken = await AsyncStorage.getItem("fcmToken");

      const _data = {
        type: "add_data",
        table_name: "devices",
        user_id: id,
        devicePlatform: Platform.OS,
        deviceRid: fcmToken,
        deviceModel: model,
      };
      console.log(_data);

      await ApiRequest(_data);
    } catch (error) {
      console.log(error, "err in login device");
    }
  };

  const fetchContent = async (id) => {
    try {
      setContentLoader(true);

      const dataToGet = {
        type: "get_data",
        table_name: "content",
        id: id,
      };
      sheetRef.current?.open();
      const res = await ApiRequest(dataToGet);
      if (res.data?.data) {
        const data = JSON.parse(res.data.data[0]?.translations) || {};
        const contentForLang = data?.en;
        setContent(contentForLang);
      }
      setContentLoader(false);
    } catch (error) {
      console.log(error);
      setContentLoader(false);
    }
  };

  const handleSubLogin = async (email) => {
    try {
      const res = await post("auth/login/user", { email });
      console.log(res?.data);

      if (res.data?.success) {
        return res.data?.token;
      }
    } catch (error) {
      console.log(error?.response?.data, "err in sub login");
    }
  };

  const handleSubSignup = async (name, email, id) => {
    try {
      const dataToPost = {
        firstName: "Habeebi User",
        email: email,
        user_id: String(id),
      };
      console.log(dataToPost, "dataToPost");

      const res = await post("users/signup/user", dataToPost);
      if (res.data?.success) {
        return res.data?.token;
      }
    } catch (error) {
      console.log(error);

      console.log(error?.response?.data, "sub signup in login");
    }
  };

  const handleAppleLogin = async () => {
    try {
      if (!appleAuth.isSupported) {
        return ToastMessage(
          "Signin with apple is not supported on this device"
        );
      }

      if (!agree) {
        return ToastMessage(
          "Please agree to our Terms of services and Privacy policy"
        );
      }

      const appleData = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleData.identityToken) {
        return ToastMessage("An error occurred during Apple sign in");
      }

      let appleRes;
      if (appleData.email == null || appleData.email === undefined) {
        appleRes = await jwt_decode(appleData.identityToken);
      } else {
        appleRes = appleData;
      }

      const email = appleRes?.email;
      const name =
        appleRes?.fullName?.familyName + " " + appleRes?.fullName?.givenName ||
        "";

      const dataToPost = {
        type: "social_login",
        provider: "apple",
        oauth_id: appleRes?.user || appleRes?.sub,
        email: email,
        name: name,
      };

      setLoader(true);
      const res = await ApiRequest(dataToPost);
      let chatToken = "";

      if (res.data?.result) {
        chatToken = await handleSubSignup(name, email, res?.data?.user_id_int);

        if (!chatToken) {
          chatToken = await handleSubLogin(email);
        }

        if (chatToken) {
          await AsyncStorage.setItem("chatToken", chatToken);
        } else {
          console.log("chatToken missing after apple login");
        }
        await handleDeviceRegistration(res.data?.user_id);
        dispatch(setUserToken(res.data?.user_id));
        navigation.reset({ index: 0, routes: [{ name: "MainStack" }] });
      }
      setLoader(false);
    } catch (error) {
      console.log(error, "err in apple auth");
      setLoader(false);
    }
  };

  const hangleGoogleLogin = async () => {
    try {
      if (!agree) {
        return ToastMessage(
          "Please agree to our Terms of services and Privacy policy"
        );
      }

      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const googleData = await GoogleSignin.signIn();

      const userInfo = googleData?.data ? googleData.data : googleData;

      const dataToPost = {
        type: "social_login",
        provider: "google",
        oauth_id: userInfo?.user?.id,
        email: userInfo?.user?.email,
        name: userInfo?.user?.name,
      };

      setLoader(true);
      const res = await ApiRequest(dataToPost);

      console.log(res?.data);
      

      let chatToken = "";

      if (res.data?.result) {
        chatToken = await handleSubSignup(userInfo?.user?.name, userInfo?.user?.email, res?.data?.user_id_int);

        if (!chatToken) {
          chatToken = await handleSubLogin(userInfo?.user?.email);
        }

        if (chatToken) {
          await AsyncStorage.setItem("chatToken", chatToken);
        } else {
          console.log("chatToken missing after google login");
        }
        await handleDeviceRegistration(res.data?.user_id);
        dispatch(setUserToken(res.data?.user_id));
        navigation.reset({ index: 0, routes: [{ name: "MainStack" }] });
      }
      setLoader(false);
    } catch (error) {
      console.log(error, "err in google auth");
      setLoader(false);
    }
  };

  const handlePress = async () => {
    try {
      const dataToPost = {
        type: "login",
        email: activeTab === 0 ? state.email : "92" + state.phone,
        password: state.password,
      };

      if (errorCheck()) {
        if (!agree) {
          return ToastMessage(
            "Please agree to our Terms of services and Privacy policy"
          );
        }

        setLoading(true);
        const res = await ApiRequest(dataToPost);
        let chatToken = "";

        if (res.data?.result) {
          chatToken = await handleSubSignup(
            res.data?.name,
            res.data?.email,
            res?.data?.user_id_int
          );
          if (!chatToken) {
            chatToken = await handleSubLogin(res.data?.email);
          }

          if (chatToken) {
            await AsyncStorage.setItem("chatToken", chatToken);
          } else {
            console.log("chatToken missing after email/phone login", {
              email: res.data?.email,
              user_id_int: res?.data?.user_id_int,
            });
          }
          await handleDeviceRegistration(res.data?.user_id);
          dispatch(setUserToken(res.data?.user_id));
          navigation.reset({ index: 0, routes: [{ name: "MainStack" }] });
        } else {
          ToastMessage(res.data?.message);
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error);

      console.log(error, "err in login");
      setLoading(false);
    }
  };

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      if (activeTab === 0) {
        newErrors.emailError = validateField("email", state.email);
      } else if (activeTab === 1) {
        newErrors.phoneError = validateField("phone", state.phone);
      }

      newErrors.passwordError = validateField("password", state.password);

      setErrors(newErrors);
      return Object.keys(newErrors).every((key) => !newErrors[key]);
    };
  }, [state, activeTab]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "907212820942-7kpulvvgg3c5m6s1k39gj5s5ue2pv67t.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  return (
    <>
      <Layout showNavBar={false}>
        <View style={{ marginTop: inset.top }}>
          <CustomText
            containerStyle={className(
              "bg-lightOrange px-6 py-2 align-self-end mt-4 rounded-4 "
            )}
            label={"Skip"}
            fontFamily={fonts.semiBold}
            color={colors.orange}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "MainStack",
                  },
                ],
              })
            }
          />
        </View>
        <CustomText
          label={"Welcome Back"}
          fontFamily={fonts.semiBold}
          fontSize={22}
          marginTop={30}
        />
        <CustomText
          label={"Login to Vexem"}
          marginTop={5}
          marginBottom={35}
          fontSize={16}
        />
        <Tab tab={activeTab} setTab={setActiveTab} />

        {activeTab === 0 ? (
          <CustomInput
            placeholder="Enter email here"
            value={state.email}
            onChangeText={(text) => handleInputChange("email", text)}
            error={errors?.emailError}
            keyboardType="email-address"
          />
        ) : (
          <CustomPhone
            placeholder="Enter phone number here"
            value={state.phone}
            onChangeText={(text) => handleInputChange("phone", text)}
            error={errors?.phoneError}
          />
        )}
        <CustomInput
          placeholder="Enter your password"
          value={state.password}
          onChangeText={(text) => handleInputChange("password", text)}
          error={errors?.passwordError}
          secureTextEntry
        />
        <CustomText
          label={"Forgot Password?"}
          fontSize={15}
          onPress={() => navigation.navigate("ForgotPassword")}
          alignSelf={"flex-end"}
          marginBottom={5}
          containerStyle={{ alignSelf: "flex-end" }}
        />
        <View style={className("flex mb-4")}>
          <TouchableOpacity
            style={styles.checkBox}
            onPress={() => setAgree(!agree)}
          >
            {agree && <Icons name={"check"} family={"Feather"} />}
          </TouchableOpacity>
          <View style={[className("flex align-center"), { flexWrap: "wrap" }]}>
            <CustomText
              label={"By Signing in you agree to our "}
              color={colors.grey2}
              fontSize={16}
            />
            <CustomText
              label={"Terms of services      "}
              fontFamily={fonts.semiBold}
              onPress={() => fetchContent(1)}
              textDecorationLine={"underline"}
              color={colors.primaryColor}
            />
            <CustomText label={" and  "} color={colors.grey2} fontSize={16} />
            <CustomText
              label={"privacy"}
              fontFamily={fonts.semiBold}
              onPress={() => fetchContent(2)}
              textDecorationLine={"underline"}
              color={colors.primaryColor}
            />
          </View>
        </View>
        <CustomButton
          title={"signIn"}
          onPress={handlePress}
          disabled={loading}
          loading={loading}
        />
        <CustomButton
          title={"signUp"}
          marginTop={10}
          onPress={() => navigation.navigate("Signup")}
        />
        {/* <View style={className('justify-center align-center flex mb-5 mt-3')}>
          <CustomText
            label={"Don't have an account?"}
            fontSize={15}
            marginRight={5}
          />
          <CustomText
            label={'signUp'}
            fontFamily={fonts.semiBold}
            fontSize={15}
            color={colors.primaryColor}
            onPress={() => navigation.navigate('Signup')}
          />
        </View> */}
        <CustomText
          label={"Or Sign in with"}
          fontFamily={fonts.semiBold}
          alignSelf={"center"}
          marginTop={10}
        />
        <View style={className("mt-2 mb-5")}>
          {Platform.OS === "android" ? (
            <TouchableOpacity
              style={className(
                "bg-white justify-center align-center flex mb-3 flex-1 rounded-2 h-13"
              )}
              onPress={hangleGoogleLogin}
            >
              <GoogleIcon />
              <CustomText
                label={"authGoogle"}
                marginLeft={8}
                fontSize={16}
                fontFamily={fonts.semiBold}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={className(
                "bg-white justify-center align-center flex mb-3 flex-1 rounded-2 h-13"
              )}
              onPress={handleAppleLogin}
            >
              <AppleIcon />
              <CustomText
                label={"authApple"}
                marginLeft={8}
                fontSize={16}
                fontFamily={fonts.semiBold}
              />
            </TouchableOpacity>
          )}
        </View>
      </Layout>
      <AppLoader show={loader} />
      <PrivacySheet
        content={content}
        loading={contentLoader}
        setContent={setContent}
        bottomSheetRef={sheetRef}
      />
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  checkBox: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 4,
    marginRight: 10,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
});

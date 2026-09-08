import { useEffect, useRef, useState } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useSelector } from "react-redux";
import { Images } from "../../../assets/images";
import CustomButton from "../../../components/CustomButton";
import GooglePlaces from "../../../components/GooglePlaces";
import Header from "../../../components/Header";
import ScreenWrapper from "../../../components/ScreenWrapper";
import ApiRequest from "../../../services/ApiRequest";
import { colors } from "../../../utils/colors";
import { GOOGLE_API_KEY } from "../../../utils/constants";

const AdsLocation = ({ route, navigation }) => {
  const mapViewRef = useRef(null);
  const { data, customField, ad } = route.params;
  const { loginUser, token } = useSelector((store) => store.user);

  const lat = Number(loginUser?.lat) || 25.2854;
  const long = Number(loginUser?.lng) || 51.531;

  const [loading, setLoading] = useState(false);
  const [addressData, setAddressData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    lat: lat,
    lng: long,
  });
  console.log(addressData);

  const fetchPlaceName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );
      const locationData = await response.json();

      if (locationData.results.length > 0) {
        return locationData.results[0].formatted_address;
      }
    } catch (error) {
      console.error("Error fetching place name:", error);
    }
  };

  const handlePress = async () => {
    try {
      setLoading(true);
      const dataToPost = {
        type: ad ? "update_data" : "add_data",
        table_name: "items",
        area: addressData.address,
        city: "",
        state: "",
        country: "",
        lat: addressData.lat,
        lng: addressData.lng,
        custom_fileds_data: customField,
        user_id: token,
        ...data,
      };

      if (ad) {
        dataToPost.id = ad?.id;
      }

      const response = await ApiRequest(dataToPost);
      console.log(response?.data, "response");
      setLoading(false);

      if (response.data?.result) {
        navigation.navigate("SuccessScreen", {
          msg: ad ? "Your ad updated successfully" : "",
        });
      }
    } catch (error) {
      console.log(error, "errr in create ad");
      setLoading(false);
    }
  };

  const handleAddressChange = (address) => {
    setAddressData({
      address: address.address,
      lat: address.lat,
      lng: address.lng,
    });

    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion({
        latitude: address.lat,
        longitude: address.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const handleRegionChangeComplete = async (region) => {
    const name = await fetchPlaceName(region.latitude, region.longitude);
    setAddressData({
      address: name,
      lat: region.latitude,
      lng: region.longitude,
    });
  };

  useEffect(() => {
    const onGetPlaceName = async () => {
      const placeName = await fetchPlaceName(lat, long);
      setAddressData({ ...addressData, address: placeName });
    };
    onGetPlaceName();
  }, [lat, long]);

  useEffect(() => {
    if (ad) {
      setAddressData((prevState) => ({
        ...prevState,
        address: ad?.area,
        lat: Number(ad?.lat),
        lng: Number(ad?.lng),
      }));

      if (mapViewRef.current) {
        mapViewRef.current.animateToRegion({
          latitude: Number(ad?.lat),
          longitude: Number(ad?.lng),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    }
  }, [ad]);

  return (
    <ScreenWrapper
      paddingHorizontal={0.1}
      statusBarColor="white"
      headerUnScrollable={() => <Header title={"Ads Location"} />}
      footerUnScrollable={() => (
        <View style={styles.btnBox}>
          <CustomButton
            onPress={handlePress}
            title={ad ? "Update Ad" : "Create Ad"}
            disabled={!addressData.address || loading}
            loading={loading}
          />
        </View>
      )}
    >
      <View style={styles.topBox}>
        <GooglePlaces
          placeholder="Choose Location"
          value={addressData.address}
          setValue={(address) => {
            setAddressData((prev) => ({
              ...prev,
              address: address,
            }));
          }}
          setState={(state) => {
            setAddressData((prev) => ({
              ...prev,
              state: state,
            }));
          }}
          setLatLong={(latLong) => {
            setAddressData((prev) => ({
              ...prev,
              lat: latLong?.latitude,
              lng: latLong?.longitude,
            }));

            // Animate map to the new location
            if (mapViewRef.current && latLong?.latitude && latLong?.longitude) {
              mapViewRef.current.animateToRegion({
                latitude: latLong.latitude,
                longitude: latLong.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              });
            }
          }}
        />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.mapStyle}
          ref={mapViewRef}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: addressData.lat,
            longitude: addressData.lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          loadingEnabled={true}
          showsUserLocation={true}
          onRegionChangeComplete={handleRegionChangeComplete}
        />
        <View style={styles.markerFixed}>
          <Image source={Images.mapPin} style={styles.marker} />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AdsLocation;

const styles = StyleSheet.create({
  btnBox: {
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 10 : 0,
  },
  mapContainer: {
    flex: 1,
  },
  mapStyle: {
    flex: 1,
  },
  markerFixed: {
    left: "50%",
    marginLeft: -24,
    marginTop: -48,
    position: "absolute",
    top: "50%",
  },
  marker: {
    height: 45,
    width: 45,
    resizeMode: "contain",
  },
  topBox: {
    height: 80,
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

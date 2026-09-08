import { StyleSheet, TouchableOpacity, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Modal from "react-native-modal";
import fonts from "../assets/fonts";
import { colors } from "../utils/colors";
import CustomText from "./CustomText";
import Icons from "./Icons";

const LocationModal = ({ visible, setVisible, setData, addressData }) => {
  const hideModal = () => {
    setVisible(false);
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={hideModal}
      onBackButtonPress={hideModal}
    >
      <View style={styles.container}>
        <View style={styles.top}>
          <CustomText label={"Search Location"} />
          <TouchableOpacity onPress={() => hideModal()}>
            <Icons
              name="closecircleo"
              color={colors.black}
              size={20}
              family={"AntDesign"}
            />
          </TouchableOpacity>
        </View>
        <GooglePlacesAutocomplete
          placeholder="Search here..."
          enablePoweredByContainer={false}
          GooglePlacesDetailsQuery={{ fields: "geometry" }}
          listViewDisplayed="auto"
          keepResultsAfterBlur
          styles={{
            container: {
              height: 10,
              flex: 1,
              zIndex: 2,
              width: "90%",
              alignSelf: "center",
              borderBottomColor: "#d4d4d4",
              borderBottomWidth: 1,
              marginTop: 10,
            },
            textInput: {
              borderBottomColor: "#d4d4d4",
              borderBottomWidth: 0.5,
              color: "black",
              fontFamily: fonts.regular,
              fontSize: 15,
              paddingHorizontal: 0,
            },

            description: {
              fontSize: 16,
              fontFamily: fonts.semiBold,
              color: colors.black,
            },
          }}
          fetchDetails={true}
          onPress={(data, details = null) => {
            setData({
              ...addressData,
              address: data.description,
              lat: details?.geometry?.location.lat,
              lng: details?.geometry?.location.lng,
            });
            hideModal();
          }}
          query={{
            key: "AIzaSyB30IDHxRCBwsaiocbWMGCgS0f4Go3FPew",
            language: "en",
            components: "country:qa",
          }}
        />
      </View>
    </Modal>
  );
};

export default LocationModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: 10,
    borderRadius: 10,
    height: "90%",
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingHorizontal: 15,
  },
});

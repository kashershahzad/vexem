import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import React, { useState } from "react";
import CustomText from "./CustomText";
import fonts from "../assets/fonts";
import ImageFast from "./ImageFast";
import { Images } from "../assets/images";

const CategoriesHeader = ({ navigation }) => {
  const [selected, setSelected] = useState(1);
  const categories = [
    { id: 1, name: "Car", image: Images.catitem },
    { id: 2, name: "Car", image: Images.catitem },
    { id: 3, name: "Car", image: Images.catitem },
    { id: 4, name: "Car", image: Images.catitem },
    { id: 5, name: "Car", image: Images.catitem },
  ];

  const renderCategory = ({ item }) => (
    <View style={styles.category}>
      <TouchableOpacity onPress={() => setSelected(item.id)}>
        <ImageFast
          source={item.image}
          style={styles.categoryimg}
          resizeMode={"contain"}
        />
        <CustomText
          label={item.name}
          fontSize={16}
          fontFamily={fonts.semiBold}
          marginLeft={3}
        />
      </TouchableOpacity>
      
      {/* Always render indicator space but only show image for selected */}
      <View style={styles.indicatorContainer}>
        {selected === item.id ? (
          <ImageFast
            source={Images.Indicator}
            style={styles.indicator}
            resizeMode={"contain"}
          />
        ) : (
          <View style={styles.emptyIndicator} />
        )}
      </View>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: "#EDECFF99",
        borderBottomColor: "#9B9B9B33",
        borderBottomWidth: 1,
      }}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ImageFast
            source={Images.backbrn}
            style={styles.img}
            resizeMode={"contain"}
          />
        </TouchableOpacity>

        <View style={styles.textWrapper}>
          <CustomText
            label={"Vehicle"}
            fontSize={16}
            fontFamily={fonts.semiBold}
          />
        </View>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategory}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  categoriesWrapper: {
    paddingHorizontal: 20,
  },
  category: {
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 24,
    height: 48,
    borderRadius: 50,
  },
  textWrapper: {
    flex: 1,
    alignItems: "center",
  },
  categoryimg: {
    width: 48,
    height: 33,
    resizeMode: "contain",
    marginRight:10
  },
  indicatorContainer: {
    height: 3, 
    width: 51, 
    marginTop: 5,
    marginRight:35
  },
  indicator: {
    width: 55,
    height: 3,
  },
  emptyIndicator: {
    width: 51,
    height: 3,
    backgroundColor: 'transparent'
  },
});

export default CategoriesHeader;
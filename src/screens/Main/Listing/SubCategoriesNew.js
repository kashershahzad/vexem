import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import CalendarHeader from "react-native-calendars/src/calendar/header";
import CategoriesHeader from "../../../components/CategoriesHeader";
import CustumInput from "../../../components/CustomInput";

const SubCategoriesNew = () => {
  return (
    <ScreenWrapper headerUnScrollable={() => <CategoriesHeader />}>
      <View style={{ marginTop: 20 }}>
        <CustumInput 
        placeholder="Search for "
        height={48} />
      </View>

      <View >

      </View>
    </ScreenWrapper>
  );
};

export default SubCategoriesNew;

const styles = StyleSheet.create({});

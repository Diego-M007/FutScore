import React, { useState } from "react";
import { View, StyleSheet, Platform, Button, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ImgComponent from "./ImgComponent";
import BotaoImagemComponent from "./BotãoImagemComponent";
import { TouchableOpacity } from "react-native";

export default function HeaderComponent({ onDateChange }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowPicker(Platform.OS === "ios");
    onDateChange(currentDate);
  };

  return (
    <View style={styles.generalheader}>
      <BotaoImagemComponent
        name={"calendar-alt"}
        size={25}
        color={"white"}
        setShowPicker={() => setShowPicker(true)}
      />

      <View style={styles.DivLogo}>
        <ImgComponent
          ImageUri={require("../assets/Images/LogoFutScore.png")}
          ImageStyle={styles.futscore}
        />
      </View>
      <BotaoImagemComponent name={"search"} size={25} color={"white"} />

      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  generalheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "8%",
    width: "100%",
    backgroundColor: "#2C2C2E",
    borderBottomColor: "#2f9fa6",
    borderBottomWidth: 1,
    paddingHorizontal: "2%",
    overflow: "hidden",
  },
  DivLogo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "2%",
    zIndex: -1,
  },
  futscore: {
    height: 40,
    resizeMode: "contain",
    zIndex: -1,
    width: "50%",
  },
});

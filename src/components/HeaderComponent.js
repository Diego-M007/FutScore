import React, { useState } from "react";
import { View, StyleSheet, Platform, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ImgComponent from "./ImgComponent";
import BotaoImagemComponent from "./BotãoImagemComponent";

export default function HeaderComponent({ onDateChange, onSearch }) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDateChange = (event, newSelectedDate) => {
    const currentDate = newSelectedDate || selectedDate;
    setShowPicker(Platform.OS === "ios");
    setSelectedDate(currentDate);
    onDateChange(currentDate);
  };

  const handleSearchToggle = () => {
    setSearchMode(!searchMode);
    setSearchQuery(""); // Limpa a pesquisa ao fechar o campo
    if (searchMode) {
      onSearch(""); // Reseta a pesquisa ao fechar
    }
  };

  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
    onSearch(text); // Chama a função de pesquisa sempre que o texto é alterado
  };

  return (
    <View style={styles.generalheader}>
      <BotaoImagemComponent
        name={"calendar-alt"}
        size={25}
        color={"white"}
        setShowPicker={() => setShowPicker(true)}
      />

      {searchMode ? (
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={handleSearchInputChange}
        />
      ) : (
        <View style={styles.DivLogo}>
          <ImgComponent
            ImageUri={require("../assets/Images/LogoFutScore.png")}
            ImageStyle={styles.futscore}
          />
        </View>
      )}

      <BotaoImagemComponent
        name={"search"}
        size={25}
        color={"white"}
        onPress={handleSearchToggle}
      />

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
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
  searchInput: {
    flex: 1,
    height: "80%",
    color: "white",
    backgroundColor: "#1C1C1E",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

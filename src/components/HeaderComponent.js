import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ImgComponent from "./ImgComponent";
import BotaoImagemComponent from "./BotãoImagemComponent";

export default function HeaderComponent({ onDateChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Estado para armazenar a data selecionada

  const handleDateChange = (event, newSelectedDate) => {
    const currentDate = newSelectedDate || selectedDate; // Usa a data atual ou a data selecionada
    setShowPicker(Platform.OS === "ios"); // Fecha o picker no Android
    setSelectedDate(currentDate); // Atualiza a data selecionada localmente
    onDateChange(currentDate); // Passa a nova data para o componente pai
  };

  return (
    <View style={styles.generalheader}>
      <BotaoImagemComponent
        name={"calendar-alt"}
        size={25}
        color={"white"}
        setShowPicker={() => setShowPicker(true)} // Abre o picker quando o botão de calendário é clicado
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
          value={selectedDate} // Inicializa o picker com a data selecionada
          mode="date"
          display="calendar"
          onChange={handleDateChange} // Atualiza a data ao selecionar uma nova
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

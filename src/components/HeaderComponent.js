import React, { useState } from "react";
import { View, StyleSheet, Platform, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ImgComponent from "./ImgComponent";
import BotaoImagemComponent from "./BotãoImagemComponent";

export default function HeaderComponent({ onDateChange, onSearch }) {
  // Controle de exibição do DateTimePicker e estado de data
  const [showPicker, setShowPicker] = useState(false); // Exibe ou esconde o seletor de data
  const [selectedDate, setSelectedDate] = useState(new Date()); // Armazena a data selecionada
  const [searchMode, setSearchMode] = useState(false); // Controle de modo de busca
  const [searchQuery, setSearchQuery] = useState(""); // Armazena o texto da pesquisa

  // Função chamada quando a data é alterada no DateTimePicker
  const handleDateChange = (event, newSelectedDate) => {
    const currentDate = newSelectedDate || selectedDate;
    setShowPicker(Platform.OS === "ios"); // Mostra o seletor de data no iOS
    setSelectedDate(currentDate); // Atualiza a data selecionada
    onDateChange(currentDate); // Chama a função de callback para atualizar a data no componente pai
  };

  // Função para alternar entre modo de busca e logo
  const handleSearchToggle = () => {
    setSearchMode(!searchMode); // Alterna o estado de busca
    setSearchQuery(""); // Limpa a pesquisa ao fechar
    if (searchMode) {
      onSearch(""); // Reseta a pesquisa ao fechar
    }
  };

  // Função chamada sempre que o texto da pesquisa muda
  const handleSearchInputChange = (text) => {
    setSearchQuery(text); // Atualiza o estado da pesquisa
    onSearch(text); // Chama a função de pesquisa
  };

  return (
    <View style={styles.generalheader}>
      {/* Botão de calendário para abrir o DateTimePicker */}
      <BotaoImagemComponent
        name={"calendar-alt"}
        size={25}
        color={"white"}
        setShowPicker={() => setShowPicker(true)} // Abre o seletor de data
      />

      {/* Exibe o campo de busca ou o logo, dependendo do estado */}
      {searchMode ? (
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={handleSearchInputChange} // Atualiza a pesquisa enquanto o texto é digitado
        />
      ) : (
        <View style={styles.DivLogo}>
          {/* Logo da aplicação */}
          <ImgComponent
            ImageUri={require("../assets/Images/LogoFutScore.png")}
            ImageStyle={styles.futscore}
          />
        </View>
      )}

      {/* Botão de pesquisa para alternar entre os modos */}
      <BotaoImagemComponent
        name={"search"}
        size={25}
        color={"white"}
        onPress={handleSearchToggle} // Alterna o modo de busca
      />

      {/* Exibe o DateTimePicker se o showPicker for true */}
      {showPicker && (
        <DateTimePicker
          value={selectedDate} // Data atual selecionada
          mode="date" // Modo de seleção de data
          display="calendar" // Exibe o calendário
          onChange={handleDateChange} // Lida com a mudança de data
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

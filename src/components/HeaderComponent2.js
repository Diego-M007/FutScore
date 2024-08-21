import React from "react";
import { View, StyleSheet } from "react-native";
import ImgComponent from "./ImgComponent";
import BotaoImagemComponent from "./BotãoImagemComponent";

export default function HeaderComponent() {
  return (
    <View style={styles.generalheader}>
      <View style={styles.DivLogo}>
        <ImgComponent
          ImageUri={require("../assets/Images/LogoFutScore.png")}
          ImageStyle={styles.futscore}
        />
      </View>
      <BotaoImagemComponent name={"search"} size={25} color={"white"} />
    </View>
  );
}

const styles = StyleSheet.create({
  generalheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "8%", // Ajuste a altura conforme necessário
    width: "100%",
    backgroundColor: "#2C2C2E",
    borderBottomColor: "#2f9fa6",
    borderBottomWidth: 1,
    paddingHorizontal: 15, // Para evitar problemas de margem
  },
  DivLogo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "2%",
  },
  futscore: {
    height: 40, // Ajuste a altura conforme necessário para proporcionalidade
    resizeMode: "contain",
  },
});

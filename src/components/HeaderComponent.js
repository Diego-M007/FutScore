import React from "react";
import { View, StyleSheet } from "react-native";
import ImgComponent from "./ImgComponent";
import BotaoImagemComponent from "./BotãoImagemComponent";

export default function HeaderComponent() {
  return (
    <View style={styles.generalheader}>
      <View style={styles.IconeCalendar}>
        <BotaoImagemComponent name={"calendar-alt"} size={20} color={"black"} />
      </View>
      <View style={styles.DivLogo}>
        <ImgComponent
          ImageUri={require("../assets/Images/LogoFutScore.png")}
          ImageStyle={styles.futscore}
        />
      </View>
      <View style={styles.IconLupa}>
        <BotaoImagemComponent name={"search"} size={20} color={"black"} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  generalheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "5%",
    width: "100%",
    paddingHorizontal: "3%",
  },
  DivLogo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  IconLupa: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  IconeCalendar: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  futscore: {
    width: "50%",
    height: undefined,
    resizeMode: "contain",
  },
});

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TxtComponent from "../components/TxtComponent";
import { useNavigation } from "@react-navigation/native";

export default function Favoritos() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "black",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <TxtComponent styleTxt={{ color: "white" }} texto={"Ir para Login"} />
      </TouchableOpacity>
    </View>
  );
}

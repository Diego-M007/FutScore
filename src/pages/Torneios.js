import React from "react";
import { StatusBar, SafeAreaView } from "react-native";
import HeaderComponent from "../components/HeaderComponent";
import { stylesTorneio } from "../styles/StyleTorneios";

export default function Torneios() {
  return (
    <SafeAreaView style={stylesTorneio.all}>
      <StatusBar barStyle="transparent" />
      <HeaderComponent />
    </SafeAreaView>
  );
}

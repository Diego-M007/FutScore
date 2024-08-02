import React from "react";
import { StatusBar, SafeAreaView } from "react-native";
import HeaderComponent from "../components/HeaderComponent";
import { stylesTorneio } from "../styles/StyleTorneios";
import EspaçoPropaganda from "../components/PropagandoComponent";

export default function Torneios() {
  return (
    <SafeAreaView style={stylesTorneio.all}>
      <StatusBar barStyle="transparent" />
      <HeaderComponent />
      <EspaçoPropaganda />
    </SafeAreaView>
  );
}

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TxtComponent from "../components/TxtComponent";
import { useNavigation } from "@react-navigation/native";
import HeaderComponent from "../components/HeaderComponent2";
import { FontAwesome } from "@expo/vector-icons";
import { stylesFavoritos } from "../styles/StyleFavoritos";
import { ImageBackground } from "react-native";

export default function Favoritos() {
  const navigation = useNavigation();
  return (
    <View style={stylesFavoritos.Principal}>
      <HeaderComponent />
      <ImageBackground
        source={require("../assets/Images/ImagemFundoFav.png")}
        resizeMode="cover"
        style={stylesFavoritos.imagemFundo}
      >
        <View style={stylesFavoritos.Container}>
          <FontAwesome name={"star"} size={60} color={"white"} />
          <TxtComponent
            texto={
              "Para acessar seus Favoritos, clique no botão abaixo e faça login."
            }
            styleTxt={stylesFavoritos.Textos}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={stylesFavoritos.Button}
          >
            <FontAwesome name={"user"} size={30} color={"white"} />
            <TxtComponent
              styleTxt={stylesFavoritos.TxtButton}
              texto={"Faça Login"}
            />
          </TouchableOpacity>
          <TxtComponent
            texto={
              "Assim você pode acompanhar seus Jogadores, Times e Competições preferidas, não perca tempo e faça seu Login ou Cadastro."
            }
            styleTxt={stylesFavoritos.Textos}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { CommonActions, useNavigation } from "@react-navigation/native";

export default function Splash() {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Jogos do Dia" }],
        })
      );
    }, 5000); // Ajuste o tempo para corresponder à duração do vídeo
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Video
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN} // Ajuste para CONTAIN ou COVER conforme necessário
        source={require("../assets/Images/Video/Splash.mp4")}
        shouldPlay
        isLooping={false}
        isMuted={true}
        onError={(error) => console.error("Erro ao carregar o vídeo:", error)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black", // Usando fundo preto para garantir que o vídeo não tenha bordas brancas visíveis
  },
  video: {
    width: "100%", // Deixe o vídeo ocupar 100% da largura da tela
    height: "100%", // Deixe o vídeo ocupar 100% da altura da tela
  },
});

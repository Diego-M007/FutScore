// src/components/CompeticaoCardComponent.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import JogosDoDiaComponent from "./JogosDoDiaComponent";

export default function CompeticaoCardComponent({
  imagem,
  nome,
  quantidadeJogos,
  jogos,
}) {
  const [expanded, setExpanded] = useState(false);
  const [heightAnim] = useState(new Animated.Value(60)); // Altura inicial do card

  const toggleExpand = () => {
    setExpanded(!expanded);

    Animated.timing(heightAnim, {
      toValue: expanded ? 60 : 70 + jogos.length * 0, // Ajuste a altura conforme necessário
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.Container}>
      <TouchableOpacity onPress={toggleExpand}>
        <Animated.View style={[styles.card, { height: heightAnim }]}>
          <Image source={{ uri: imagem }} style={styles.imagem} />
          <View style={styles.info}>
            <Text style={styles.nome}>{nome}</Text>
            <Text
              style={styles.quantidadeJogos}
            >{`${quantidadeJogos} jogos`}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
      {expanded && jogos && <JogosDoDiaComponent jogos={jogos} />}
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    width: "100%",
    marginVertical: 5,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2f9fa6",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#2C2C2E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  imagem: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 10,
    resizeMode: "contain",
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  quantidadeJogos: {
    fontSize: 14,
    color: "white",
  },
});

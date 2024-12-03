import React, { useState, useEffect } from "react";
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

// Componente que exibe as informações de uma competição, com animação para expandir
export default function CompeticaoCardComponent({
  imagem, // URL da imagem do campeonato
  nome, // Nome do campeonato
  quantidadeJogos, // Quantidade de jogos da competição
  jogos, // Lista de jogos da competição
  finalizados, // Flag indicando se os jogos estão finalizados
  isUEFA, // Flag para saber se é uma competição UEFA
}) {
  const [expanded, setExpanded] = useState(false); // Controle de expansão do cartão
  const [heightAnim] = useState(new Animated.Value(60)); // Animação da altura do cartão
  const [statuses, setStatuses] = useState({}); // Estado dos status dos jogos

  // Função para alternar a expansão do card (abre/fecha)
  const toggleExpand = () => {
    setExpanded(!expanded);

    // Animação para expandir ou contrair o cartão
    Animated.timing(heightAnim, {
      toValue: expanded ? 60 : 70 + jogos.length * 1, // Calcula a altura com base no número de jogos
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Toca no card para expandir ou contrair */}
      <TouchableOpacity onPress={toggleExpand}>
        {/* Card animado com altura variável */}
        <Animated.View style={[styles.card, { height: heightAnim }]}>
          <Image source={{ uri: imagem }} style={styles.imagem} />
          <View style={styles.info}>
            <Text style={styles.nome}>{isUEFA ? "UEFA" : nome}</Text>{" "}
            {/* Nome da competição */}
            <Text style={styles.quantidadeJogos}>
              {`${quantidadeJogos} jogos`} {/* Exibe a quantidade de jogos */}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* Exibe os jogos se o cartão estiver expandido */}
      {expanded && <JogosDoDiaComponent jogos={jogos} statuses={statuses} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 5, // Margem vertical entre os cards
  },
  card: {
    flexDirection: "row", // Alinha os itens no card horizontalmente
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
    margin: 2,
  },
  imagem: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: "contain",
    borderRadius: 10,
  },
  info: {
    flex: 1, // Faz o texto ocupar o espaço restante
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  quantidadeJogos: {
    fontSize: 12,
    color: "#fff",
  },
});

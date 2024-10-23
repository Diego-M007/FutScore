import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Importando a navegação

export default function TorneioCardComponent({ imagem, nome, ligaId, tipo }) {
  const navigation = useNavigation(); // Hook de navegação

  const handlePress = () => {
    // Navegando para a página da liga com o ID da liga
    navigation.navigate("PaginaLiga", { ligaId });
  };

  // Função para estilizar os últimos jogos (forma)
  const renderForma = (formaString) => {
    return formaString.split("").map((result, index) => {
      let color;
      if (result === "W") color = "#90EE90"; // Verde claro para vitória
      else if (result === "D") color = "gray"; // Empate
      else if (result === "L") color = "red"; // Derrota

      return (
        <View
          key={index}
          style={[styles.formCircle, { backgroundColor: color }]}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.card}>
          <Image source={{ uri: imagem }} style={styles.imagem} />
          <Text style={styles.nome}>{nome}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: "#2f9fa6",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#2C2C2E",
  },
  imagem: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  nome: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  formCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
});

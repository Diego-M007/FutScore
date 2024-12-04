import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Hook para navegação entre telas

// Componente para exibir o card de um torneio
export default function TorneioCardComponent({ imagem, nome, ligaId }) {
  const navigation = useNavigation(); // Usado para navegar para outra tela

  // Função que será chamada ao pressionar o card
  const handlePress = () => {
    // Verifica se o ID da liga foi passado antes de tentar navegar
    if (ligaId) {
      navigation.navigate("PaginaLiga", { ligaId }); // Navega para a página da liga, passando o ID como parâmetro
    } else {
      console.error("Liga ID não foi passado corretamente."); // Exibe um erro caso o ID não esteja disponível
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        {" "}
        {/* Área clicável */}
        <View style={styles.card}>
          {" "}
          {/* Estilização do card */}
          <Image source={{ uri: imagem }} style={styles.imagem} />{" "}
          {/* Imagem do torneio */}
          <Text style={styles.nome}>{nome}</Text> {/* Nome do torneio */}
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Estilos para o componente
const styles = StyleSheet.create({
  container: {
    margin: 10, // Espaçamento ao redor do card
  },
  card: {
    borderWidth: 1, // Borda ao redor do card
    borderColor: "#2f9fa6", // Cor da borda
    borderRadius: 10, // Deixa os cantos arredondados
    padding: 10, // Espaçamento interno
    alignItems: "center", // Centraliza o conteúdo do card
    backgroundColor: "#2C2C2E", // Cor de fundo do card
  },
  imagem: {
    width: 40, // Largura da imagem
    height: 40, // Altura da imagem
    resizeMode: "contain", // Garante que a imagem fique proporcional
  },
  nome: {
    marginTop: 10, // Espaçamento entre a imagem e o nome
    fontSize: 18, // Tamanho do texto
    fontWeight: "bold", // Deixa o texto em negrito
    color: "#fff", // Cor do texto
  },
});

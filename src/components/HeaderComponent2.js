import React from "react";
import { View, StyleSheet } from "react-native";
import ImgComponent from "./ImgComponent";
import BotaoImagemComponent from "./BotãoImagemComponent";

// Componente de Cabeçalho
export default function HeaderComponent() {
  return (
    <View style={styles.generalheader}>
      {/* Componente de Imagem - Exibe o logo da aplicação */}
      <ImgComponent
        ImageUri={require("../assets/Images/LogoFutScore.png")}
        ImageStyle={styles.futscore} // Estilos aplicados à imagem do logo
      />

      {/* Componente de Botão de Imagem - Exibe o ícone de pesquisa */}
      <BotaoImagemComponent
        name={"search"} // Nome do ícone (search)
        size={25} // Tamanho do ícone
        color={"white"} // Cor do ícone
      />
    </View>
  );
}

// Estilos para o cabeçalho
const styles = StyleSheet.create({
  generalheader: {
    flexDirection: "row", // Alinha os itens em linha (horizontalmente)
    alignItems: "center", // Alinha os itens verticalmente ao centro
    justifyContent: "space-between", // Espaça os itens de forma equidistante
    height: "8%", // Define a altura do cabeçalho
    backgroundColor: "#2C2C2E", // Cor de fundo do cabeçalho
    borderBottomColor: "#2f9fa6", // Cor da borda inferior
    borderBottomWidth: 1, // Largura da borda inferior
    paddingHorizontal: 15, // Espaçamento interno nas laterais
  },

  futscore: {
    height: 40, // Altura da imagem do logo
    resizeMode: "contain", // Redimensiona a imagem mantendo a proporção
    width: "50%", // Largura da imagem (50% da largura disponível)
    marginTop: "2%", // Margem superior para centralizar melhor
    marginLeft: "23%", // Margem esquerda para centralizar o logo
  },
});

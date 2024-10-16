import { StyleSheet } from "react-native";

export const stylesTorneios = StyleSheet.create({
  all: {
    backgroundColor: "#000000", // Fundo preto
    flex: 1,
    width: "100%",
  },
  Container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  TextoPrincipal: {
    color: "white", // Cor branca para o texto principal
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
  },
  noDataText: {
    color: "#888", // Texto cinza claro para quando não houver dados
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  paisButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#1f1f1f", // Fundo cinza escuro para o botão
    borderRadius: 8,
    marginVertical: 8,
    alignSelf: "center",
    width: "90%", // Ocupa 90% da largura da tela
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", // Adiciona sombra para dar profundidade ao botão
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3, // Para dispositivos Android
  },
  paisButtonText: {
    color: "#ffffff", // Texto branco para contraste com o fundo escuro
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  ligasContainer: {
    backgroundColor: "#2a2a2a", // Fundo cinza para diferenciar a lista de ligas
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    width: "85%", // Um pouco menor que o botão para criar hierarquia visual
    alignSelf: "center",
  },
  paisButtonSelected: {
    backgroundColor: "#2f9fa6", // Cor azul para indicar seleção
  },
});

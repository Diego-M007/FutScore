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
  // Estilo dos botões dos países
  paisButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#1f1f1f", // Fundo cinza escuro para o botão
    borderRadius: 10, // Arredondar bordas como os cards das ligas
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
  // Quando o país estiver selecionado
  paisButtonSelected: {
    backgroundColor: "#2f9fa6", // Cor azul para indicar seleção
  },
  // Estilo da lista de ligas que aparece ao clicar em um país
  ligasContainer: {
    backgroundColor: "#2a2a2a", // Fundo cinza para diferenciar a lista de ligas
    borderRadius: 10, // Bordas arredondadas
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    width: "85%", // Um pouco menor que o botão para criar hierarquia visual
    alignSelf: "center",
    shadowColor: "#000", // Adiciona sombra similar aos cards de liga
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3, // Para dispositivos Android
  },
  // Estilo dos cards das ligas, para deixar visualmente similar aos países
  torneioCard: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#1f1f1f", // Cor similar ao botão de país
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: "center",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3, // Para Android
  },
  noDataText: {
    color: "#888", // Texto cinza claro para quando não houver dados
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

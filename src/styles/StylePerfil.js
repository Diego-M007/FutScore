import { StyleSheet } from "react-native";

export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  headerContainer: {
    width: "100%",
    backgroundColor: "#E8E8E8",
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  iconTextContainer: {
    width: "100%", // Ajuste para garantir que o conteúdo ocupe toda a largura
    alignItems: "center",
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%", // Garantir que o ícone e o texto ocupem toda a largura
  },
  iconBackground: {
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  icon: {
    color: "#808080",
  },
  headerText: {
    fontSize: 15,
    color: "black",
    textAlign: "left",
    flex: 1, // Adiciona flex para o texto ocupar o espaço restante
  },
  divider: {
    width: "100%", // Largura completa para atravessar a tela
    height: 1, // Altura de 1 pixel
    backgroundColor: "#B0B0B0",
    marginVertical: 10, // Espaçamento vertical entre elementos
  },
  buttonEntrar: {
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 20,
    width: "50%",
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginTop: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    height: "50%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});

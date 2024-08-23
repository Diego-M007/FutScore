import { StyleSheet } from "react-native";

export default StyleSheet.create({
  Container: {
    flexGrow: 1,
    backgroundColor: "black",
  },
  headerContainer: {
    width: "80%",
    backgroundColor: "#3E3E42", // Adjusted to a darker gray to match the new background
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,
  },
  iconBackground: {
    backgroundColor: "#5A5A5E", // Adjusted to a slightly lighter gray to complement the header
    borderRadius: 22.5,
    padding: 7.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    color: "#D1D1D3",
  },
  headerText: {
    fontSize: 15,
    color: "#FFFFFF", // Changed to white for readability against the darker background
    textAlign: "center",
    marginBottom: 10,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#6A6A6D", // Adjusted to a darker gray to match the new theme
    marginVertical: 10,
  },
  buttonEntrar: {
    padding: 10,
    backgroundColor: "#2f9fa6", // Kept the button color as requested
    borderRadius: 20,
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    height: "70%",
    backgroundColor: "#3E3E42",
    borderRadius: 10,
    padding: 20,

    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalText: {
    fontSize: 25,
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "left",
  },
  modalTextsub: {
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "left",
  },
  imagemFundo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    tintColor: "grey",
    resizeMode: "cover",
  },
  ViewVideo: {
    padding: 10,
    alignItems: "center",
  },
  video: {
    width: "100%", // Deixe o vídeo ocupar 100% da largura da tela
    height: "40%", // Deixe o vídeo ocupar 100% da altura da tela
  },
  LogoGoogle: {
    resizeMode: "contain",
    width: 35,
    height: 35,
  },
  txtLogin: {
    fontSize: 17,
    marginLeft: "3%",
    color: "white",
  },
  ButtonGoogle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#2f9fa6",
    borderRadius: 5,
    backgroundColor: "#2f9fa6",
  },
  ViewFecharModal: {
    borderTopColor: "#2f9fa6",
    borderTopWidth: 1,
    width: "95%",
    margin: "10%",
  },
  FecharModal: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  FecharModalTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
  },
});

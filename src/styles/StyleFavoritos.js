import { StyleSheet } from "react-native";

export const stylesFavoritos = StyleSheet.create({
  Principal: {
    flex: 1,
    backgroundColor: "black",
  },
  Container: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#2f9fa6",
    borderWidth: 1,
    borderRadius: 8,
    padding: "6%",
    backgroundColor: "#2C2C2E",
    width: "90%",
  },
  Textos: {
    color: "white",
    paddingVertical: "5%",
  },
  TxtButton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    paddingLeft: "4%",
  },
  Button: {
    flexDirection: "row",
    padding: "4%",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#2f9fa6",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2f9fa6",
  },
  imagemFundo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});

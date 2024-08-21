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
    fontSize: 20,
    paddingLeft: "4%",
  },
  Button: {
    flexDirection: "row",
    padding: "4%",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#2f9fa6",
  },
  imagemFundo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

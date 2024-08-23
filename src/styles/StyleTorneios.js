import { StyleSheet } from "react-native";

export const stylesTorneios = StyleSheet.create({
  all: {
    backgroundColor: "#000000",
    flex: 1,
    width: "100%",
  },
  Container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  leagueContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  leagueName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  countryName: {
    fontSize: 16,
    color: "#666",
  },
  TextoPrincipal: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
  },
});

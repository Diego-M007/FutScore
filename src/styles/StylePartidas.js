import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  countryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leagueItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gameItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  teams: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamLogo: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  backButton: {
    fontSize: 18,
    color: "blue",
    marginTop: 10,
  },
  all: {
    backgroundColor: "grey",
    flex: 1,
  },
});

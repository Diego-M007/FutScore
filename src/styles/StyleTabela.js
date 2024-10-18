import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  tableContainer: {
    padding: 10,
    backgroundColor: "#1E1E1E",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#333",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  headerCell: {
    width: 80, // Defina larguras fixas para cada célula do cabeçalho
    justifyContent: "center",
  },
  headerCell1: {
    width: 200, // Defina larguras maiores para células com conteúdo extenso
    justifyContent: "center",
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  tableCell: {
    width: 80, // Larguras fixas para cada célula
    justifyContent: "center",
    alignItems: "center",
  },
  tableCell1: {
    width: 200, // Largura maior para a coluna do time
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  tablePosition: {
    color: "#fff",
  },
  teamLogo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginHorizontal: 5,
  },
  tableTeamName: {
    color: "#fff",
    textAlign: "left",
  },
  teamStats: {
    color: "#fff",
    textAlign: "center",
  },
  tablePoints: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  formContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
  },
  formCircle: {
    width: 20,
    height: 20,
    marginHorizontal: 2,
    textAlign: "center",
    color: "#fff",
    fontSize: 12,
  },
});

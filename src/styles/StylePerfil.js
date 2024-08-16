import { StyleSheet } from "react-native";

export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#2C2C2E",
    padding: 20,
  },
  headerContainer: {
    width: "100%",
    backgroundColor: "#3E3E42", // Adjusted to a darker gray to match the new background
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
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
    color: "#D1D1D3", // Adjusted to a lighter gray for better contrast
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    height: "50%",
    backgroundColor: "#3E3E42", // Adjusted to match the header background
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
    color: "#FFFFFF", // Changed to white for readability
    marginBottom: 20,
    textAlign: "center",
  },
});

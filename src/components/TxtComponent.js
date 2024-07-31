import { Text } from "react-native";

export default function TxtComponent({ texto, styleTxt }) {
  return <Text style={styleTxt}>{texto}</Text>;
}

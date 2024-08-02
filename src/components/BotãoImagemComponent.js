import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import TxtComponent from "./TxtComponent";

export default function BotaoImagemComponent({
  // Props
  name,
  size,
  color,
  onPress,
  styleBtn,
  texto,
  styletexto,
  fundo,
}) {
  return (
    // Props Touchable com o MaterialCOmmunityIcons
    <TouchableOpacity
      style={[
        fundo,
        {
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <FontAwesome5
        name={name}
        size={size}
        color={color}
        onPress={onPress}
        style={styleBtn}
      />
    </TouchableOpacity>
  );
}

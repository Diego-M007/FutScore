import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import TxtComponent from "./TxtComponent";

export default function BotaoImagemComponent({
  // Props
  name,
  size,
  color,
  setShowPicker,
  styleBtn,
  onPress,
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
          width: 50,
          height: "100%",
        },
      ]}
      onPress={setShowPicker}
    >
      <FontAwesome5 name={name} size={size} color={color} style={styleBtn} />
    </TouchableOpacity>
  );
}

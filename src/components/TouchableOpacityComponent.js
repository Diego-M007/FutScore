import { TouchableOpacity } from "react-native";

export default function TouchableOpacityProps({ children, style, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      {children}
    </TouchableOpacity>
  );
}

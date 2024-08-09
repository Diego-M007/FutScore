import { TouchableOpacity } from "react-native";

export default function TouchableOpacityComponent({
  children,
  style,
  onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      {children}
    </TouchableOpacity>
  );
}

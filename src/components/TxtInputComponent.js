import React from "react";
import { TextInput } from "react-native";

export default function TxtInputComponent({
  placeholder,
  onChangeText,
  value,
  secureTextEntry,
}) {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType="default"
      editable={true}
      secureTextEntry={secureTextEntry}
    />
  );
}

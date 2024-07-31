import React from "react";
import { Image } from "react-native";

export default function ImgComponent({ ImageStyle, ImageUri }) {
  return <Image style={ImageStyle} source={ImageUri} />;
}

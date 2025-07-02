import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

export default function IconMapPin() {
  return (
    <Svg height="24" width="24" viewBox="0 0 24 24">
      <Path
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
        fill="none"
        stroke="#e91e63"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="12"
        cy="10"
        r="3"
        fill="none"
        stroke="#e91e63"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

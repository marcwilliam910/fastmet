import React from "react";
import Svg, {Circle, Path, Rect} from "react-native-svg";

type MapMarkerPinProps = {
  color: string;
  size?: number;
};

export const MapMarkerPin: React.FC<MapMarkerPinProps> = ({
  color,
  size = 50,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Pin / teardrop shape */}
      <Path
        d="M50 5
           C 25 5, 10 22, 10 42
           C 10 65, 50 95, 50 95
           C 50 95, 90 65, 90 42
           C 90 22, 75 5, 50 5
           Z"
        fill={color}
      />
      {/* Inner white circle */}
      <Circle cx="50" cy="40" r="22" fill="#FFFFFF" />
      {/* Simple package icon */}
      <Rect x="38" y="30" width="24" height="18" rx="2" fill="#8B5E3C" />
      <Rect x="38" y="37" width="24" height="3" fill="#754C29" />
    </Svg>
  );
};

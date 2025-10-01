// components/FontWrapper.tsx
import {ReactNode, useEffect} from "react";
import {Text, TextInput} from "react-native";

interface FontWrapperProps {
  children: ReactNode;
}

export default function FontWrapper({children}: FontWrapperProps) {
  useEffect(() => {
    // Set default font for Text
    const defaultTextProps = (Text as any).defaultProps || {};
    (Text as any).defaultProps = {
      ...defaultTextProps,
      style: [{fontFamily: "Montserrat_400Regular"}, defaultTextProps.style],
    };

    // Set default font for TextInput
    const defaultTextInputProps = (TextInput as any).defaultProps || {};
    (TextInput as any).defaultProps = {
      ...defaultTextInputProps,
      style: [
        {fontFamily: "Montserrat_400Regular"},
        defaultTextInputProps.style,
      ],
    };
  }, []);

  return <>{children}</>;
}

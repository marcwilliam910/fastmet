import {Ionicons} from "@expo/vector-icons";
import {useState} from "react";
import {Text, View} from "react-native";
import {Dropdown} from "react-native-element-dropdown";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  data: Option[];
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function Select({
  label,
  data,
  value: propValue,
  onChange,
  placeholder,
}: SelectProps) {
  const [value, setValue] = useState(propValue || null);
  const [isFocus, setIsFocus] = useState(false);

  const handleChange = (item: Option) => {
    setValue(item.value);
    onChange?.(item.value);
    setIsFocus(false);
  };

  return (
    <View className="mb-4">
      <Text
        className={`mb-2 text-sm font-semibold ${isFocus ? "text-lightPrimary" : "text-black"}`}
      >
        {label}
      </Text>
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={handleChange}
        placeholder={placeholder || `Select ${label.toLowerCase()}`}
        style={{
          borderWidth: 1,
          borderColor: isFocus ? "#FFA840" : "#d1d5db",
          borderRadius: 12,
          paddingHorizontal: 14,
          height: 48,
          backgroundColor: "#fff",
        }}
        containerStyle={{
          marginTop: -30,
          borderRadius: 12,
          overflow: "hidden",
        }}
        dropdownPosition="auto"
        itemContainerStyle={{
          paddingVertical: 0,
        }}
        placeholderStyle={{color: "#9ca3af", fontSize: 14}}
        selectedTextStyle={{color: "#000", fontSize: 14}}
        iconStyle={{width: 20, height: 20}}
        renderRightIcon={() => (
          <Ionicons
            name={isFocus ? "chevron-up" : "chevron-down"}
            size={20}
            color="#FFA840"
          />
        )}
        renderItem={(item) => {
          const isSelected = item.value === value;
          return (
            <View
              style={{
                paddingVertical: 18,
                paddingHorizontal: 14,
                backgroundColor: isSelected ? "#fff7ed" : "#fff", // selected color
              }}
            >
              <Text style={{color: "#000", fontSize: 14}}>{item.label}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

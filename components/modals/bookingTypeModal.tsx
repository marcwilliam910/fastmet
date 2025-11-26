import { Type } from "@/store/slices/bookSlice";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Modal, Pressable, StatusBar, Text, View } from "react-native";

export default function BookingTypeModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"main" | "calendar">("main");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const bookingType = useAppStore((state) => state.bookingType);
  const setBookingType = useAppStore((state) => state.setBookingType);

  const handleConfirm = (type: Type) => {
    if (type === "schedule") {
      const combined = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );

      setBookingType({ type, value: combined.toISOString() });
    } else setBookingType({ type, value: type.toUpperCase() });

    setSelectedDate(new Date());
    setStep("main");
    onClose();
  };

  const OPTIONS = [
    {
      id: "asap",
      name: "ASAP",
      icon: "flash-outline", // fast or immediate booking
      onPress: () => handleConfirm("asap"),
    },
    {
      id: "pooling",
      name: "Pooling",
      icon: "people-outline", // shared ride context
      onPress: () => handleConfirm("pooling"),
    },
    {
      id: "schedule",
      name: "Schedule",
      icon: "calendar-outline", // planned ride
      onPress: () => {
        setShowCalendar(true);
        setStep("calendar");
      },
    },
  ];

  const handleCancel = () => {
    onClose();
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setStep("main");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="items-center justify-center flex-1 bg-black/40">
        <View className="w-11/12 p-5 bg-white rounded-2xl">
          {step === "main" && (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold">Booking Type</Text>
                <Pressable onPress={handleCancel}>
                  <Ionicons name="close" size={20} color="black" />
                </Pressable>
              </View>

              <View className="gap-3">
                {OPTIONS.map((value) => (
                  <Pressable
                    key={value.id}
                    className={`flex-row items-center justify-between px-4 py-3 border rounded-lg ${
                      value.id === bookingType?.type
                        ? " border-darkPrimary bg-orange-50"
                        : " border-gray-300"
                    }`}
                    onPress={value.onPress}
                  >
                    <View className="flex-row gap-2 items-center">
                      <Ionicons
                        name={value.icon as keyof typeof Ionicons.glyphMap}
                        size={20}
                        color={
                          value.id === bookingType?.type ? "#FFA840" : "gray"
                        }
                      />
                      <Text
                        className={`text-base font-medium ${value.id === bookingType?.type ? "text-lightPrimary" : ""}`}
                      >
                        {value.name}
                      </Text>
                    </View>
                    <Pressable>
                      <Ionicons
                        name="information-circle"
                        color="#FFA840"
                        size={20}
                      />
                    </Pressable>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {/* {step === "hours" && (
            <View className="gap-6">
              <View className="relative flex-row items-center justify-center">
                <Pressable
                  className="absolute top-0 left-1"
                  onPress={() => {
                    setStep("main");
                    setSelectedHour(1);
                  }}
                >
                  <Ionicons
                    name="chevron-back-outline"
                    color="#FFA840"
                    size={24}
                  />
                </Pressable>
                <Text className="text-lg font-bold">
                  Pick up next few hours
                </Text>
              </View>

              <View className="gap-3">
                {[1, 2].map((hour) => (
                  <Pressable
                    key={hour}
                    onPress={() => setSelectedHour(hour)}
                    className={`flex-row items-center gap-2 border rounded-lg px-4 py-3 ${
                      selectedHour === hour
                        ? "border-darkPrimary bg-orange-50"
                        : "border-gray-300"
                    }`}
                  >
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={selectedHour === hour ? "#FFA840" : "gray"}
                    />
                    <Text
                      className={`text-base ${
                        selectedHour === hour ? "text-orange-500" : ""
                      }`}
                    >
                      Pick up in {hour} hour{hour > 1 ? "s" : ""}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                onPress={() => handleConfirm("hour")}
                className="py-4 bg-lightPrimary rounded-xl"
              >
                <Text className="font-semibold text-center text-white">
                  Confirm
                </Text>
              </Pressable>
            </View>
          )} */}

          {step === "calendar" && (
            <View className="gap-6">
              <View className="relative flex-row items-center justify-center">
                <Pressable
                  className="absolute top-0 left-1"
                  onPress={() => {
                    setStep("main");
                    setSelectedDate(new Date());
                    setSelectedTime(new Date());
                  }}
                >
                  <Ionicons
                    name="chevron-back-outline"
                    color="#FFA840"
                    size={24}
                  />
                </Pressable>
                <Text className="text-lg font-bold">Max schedule: 1 month</Text>
              </View>

              {/* DATE PICKER */}
              <View className="gap-1">
                <Text className="ml-1 font-semibold text-lg">Date:</Text>
                <Pressable
                  onPress={() => setShowCalendar(true)}
                  className="items-center py-3 border border-gray-300 rounded-xl"
                >
                  <Text className="text-base font-semibold text-gray-800">
                    {selectedDate.toDateString()}
                  </Text>
                </Pressable>
              </View>

              {showCalendar && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="calendar"
                  onChange={(event, date) => {
                    setShowCalendar(false);
                    if (event.type === "set" && date) setSelectedDate(date);
                    setTimeout(() => StatusBar.setHidden(true), 120);
                    setShowTimePicker(true);
                  }}
                  minimumDate={new Date()}
                  maximumDate={
                    new Date(new Date().setMonth(new Date().getMonth() + 1))
                  }
                />
              )}

              {/* TIME PICKER */}
              <View className="gap-1">
                <Text className="ml-1 font-semibold text-lg">Time:</Text>
                <Pressable
                  onPress={() => setShowTimePicker(true)}
                  className="items-center py-3 border border-gray-300 rounded-xl"
                >
                  <Text className="text-base font-semibold text-gray-800">
                    {selectedTime
                      ? selectedTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Select Time"}
                  </Text>
                </Pressable>
              </View>

              {showTimePicker && (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display="clock"
                  onChange={(event, time) => {
                    setShowTimePicker(false);
                    if (event.type === "set" && time) setSelectedTime(time);
                    setTimeout(() => StatusBar.setHidden(true), 120);
                  }}
                />
              )}

              {/* CONFIRM BUTTON */}
              <Pressable
                onPress={() => handleConfirm("schedule")}
                className="py-3 bg-lightPrimary rounded-xl"
              >
                <Text className="font-semibold text-center text-white">
                  Confirm
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

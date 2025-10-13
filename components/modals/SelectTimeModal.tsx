import {isDateString} from "@/utils/date";
import {Ionicons} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useState} from "react";
import {Modal, Pressable, Text, View} from "react-native";

export default function SelectTimeModal({
  visible,
  onClose,
  setSelectedTime,
  currentTypeSelected,
}: {
  visible: boolean;
  onClose: () => void;
  setSelectedTime: React.Dispatch<React.SetStateAction<string | null>>;
  currentTypeSelected: string | null;
}) {
  const [step, setStep] = useState<"main" | "hours" | "calendar">("main");
  const [selectedHour, setSelectedHour] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true);

  const handleConfirm = (type: string) => {
    switch (type) {
      case "now":
        setSelectedTime("Pick up now");
        break;
      case "hour":
        setSelectedTime(selectedHour.toString());
        break;
      case "schedule":
        setSelectedTime(selectedDate.toISOString());
        break;
      default:
        setSelectedTime(null);
    }
    onClose();
    setSelectedHour(1);
    setSelectedDate(new Date());
    setStep("main");
  };

  const handleCancel = () => {
    onClose();
    setSelectedHour(1);
    setSelectedDate(new Date());
    setStep("main");
  };

  let isNowSelected = false;
  let isHourSelected = false;
  let isScheduleSelected = false;

  if (currentTypeSelected === "Pick up now") {
    isNowSelected = true;
  } else if (currentTypeSelected && !isNaN(Number(currentTypeSelected))) {
    // pure numeric string
    isHourSelected = true;
  } else if (currentTypeSelected && isDateString(currentTypeSelected)) {
    // valid date string
    isScheduleSelected = true;
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="items-center justify-center flex-1 bg-black/40">
        <View className="w-11/12 p-5 bg-white rounded-2xl">
          {step === "main" && (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold">Pick up schedule</Text>
                <Pressable onPress={handleCancel}>
                  <Ionicons name="close" size={20} color="black" />
                </Pressable>
              </View>

              <View className="gap-3">
                <Pressable
                  className={`flex-row items-center gap-2 px-4 py-3  rounded-lg ${
                    isNowSelected
                      ? "border-2 border-darkPrimary"
                      : "border border-gray-300"
                  }`}
                  onPress={() => handleConfirm("now")}
                >
                  <Ionicons
                    name="car-outline"
                    size={20}
                    color={isNowSelected ? "#FFA840" : "gray"}
                  />
                  <Text
                    className={`text-base font-medium ${isNowSelected ? "text-lightPrimary" : ""}`}
                  >
                    Pick up now
                  </Text>
                </Pressable>

                <Pressable
                  className={`flex-row items-center gap-2 px-4 py-3  rounded-lg ${
                    isHourSelected
                      ? "border-2 border-darkPrimary"
                      : "border border-gray-300"
                  }`}
                  onPress={() => {
                    setStep("hours");
                  }}
                >
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={isHourSelected ? "#FFA840" : "gray"}
                  />
                  <Text
                    className={`text-base font-medium ${isHourSelected ? "text-lightPrimary" : ""}`}
                  >
                    Pick up next few hours
                  </Text>
                </Pressable>

                <Pressable
                  className={`flex-row items-center gap-2 px-4 py-3  rounded-lg ${
                    isScheduleSelected
                      ? "border-2 border-darkPrimary"
                      : "border border-gray-300"
                  }`}
                  onPress={() => {
                    setShowCalendar(true);
                    setStep("calendar");
                  }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={isScheduleSelected ? "#FFA840" : "gray"}
                  />
                  <Text
                    className={`text-base font-medium ${isScheduleSelected ? "text-lightPrimary" : ""}`}
                  >
                    Schedule Pickup
                  </Text>
                </Pressable>
              </View>
            </>
          )}

          {step === "hours" && (
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
          )}

          {step === "calendar" && (
            <View className="gap-6">
              <View className="relative flex-row items-center justify-center">
                <Pressable
                  className="absolute top-0 left-1"
                  onPress={() => {
                    setStep("main");
                    setSelectedDate(new Date());
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

              <Pressable
                onPress={() => setShowCalendar(true)}
                className="items-center py-3 border border-gray-300 rounded-xl"
              >
                <Text className="text-base font-semibold text-gray-800">
                  {selectedDate.toDateString()}
                </Text>
              </Pressable>

              {showCalendar && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="calendar"
                  onChange={(event, date) => {
                    setShowCalendar(false);
                    if (event.type === "set" && date) setSelectedDate(date);
                  }}
                  minimumDate={new Date()}
                  maximumDate={
                    new Date(new Date().setMonth(new Date().getMonth() + 1))
                  }
                />
              )}

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

import { Type } from "@/store/slices/bookSlice";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const getMinTime = () => {
  const min = new Date();
  min.setHours(min.getHours() + 3);
  return min;
};

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export default function BookingTypeModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"main" | "calendar">("main");
  const [selectedDate, setSelectedDate] = useState(getMinTime());
  const [selectedTime, setSelectedTime] = useState(getMinTime());

  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const bookingType = useAppStore((state) => state.bookingType);
  const setBookingType = useAppStore((state) => state.setBookingType);

  const [infoVisible, setInfoVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    (typeof OPTIONS)[number] | null
  >(null);

  const handleConfirm = (type: Type, value: string) => {
    if (type === "schedule") {
      let combined: Date;

      if (Platform.OS === "ios") {
        // On iOS, selectedDate already contains both date and time
        combined = selectedDate;
      } else {
        // On Android, combine separate date and time
        combined = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes()
        );
      }

      // Validate: combined datetime must be at least 2 hours from now
      const minDateTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
      if (combined < minDateTime) {
        Toast.show({
          type: "info",
          text1: "Invalid schedule time",
          text2: "Pickup time must be at least 2 hours from now",
        });
        setSelectedDate(getMinTime());
        setSelectedTime(getMinTime());
        return;
      }

      setBookingType({ type, value: combined.toISOString() });
    } else if (type === "asap") {
      setBookingType({ type, value });
    } else setBookingType({ type, value });

    setSelectedDate(getMinTime());
    setSelectedTime(getMinTime());
    setShowCalendar(false);
    setShowTimePicker(false);
    setStep("main");
    onClose();
  };

  const OPTIONS = [
    {
      id: "asap",
      name: "ASAP",
      icon: "rocket-outline",
      description:
        "The ASAP option prioritizes immediate dispatch. Once your booking is confirmed, the system automatically searches for the nearest available driver and assigns the job as quickly as possible. This is ideal for urgent deliveries, time-sensitive pickups, or situations where delays may impact operations. Pricing may be higher due to priority matching and reduced flexibility in routing.",
      onPress: () => setBookingType({ type: "asap", value: "" }),
    },
    {
      id: "pooling",
      name: "Pooling",
      icon: "people-outline",
      subtext: "Most affordable – share ride with others",
      description:
        "Pooling allows your booking to be grouped with other requests that have similar routes and destinations. This option optimizes vehicle capacity and reduces overall transport costs by sharing space and travel time. Delivery and pickup times may vary depending on route optimization, making it best suited for non-urgent shipments where cost efficiency is a priority.",
      onPress: () => handleConfirm("pooling", "POOLING"),
    },
    {
      id: "schedule",
      name: "Schedule",
      icon: "calendar-outline",
      subtext: "Book up to 1 month in advance",
      description:
        "The Schedule option lets you pre-book a vehicle at a specific date and time, up to one month in advance. This is recommended for planned logistics operations such as scheduled deliveries, recurring pickups, or coordinated transport activities. Scheduling ensures better driver availability, predictable timelines, and smoother operational planning.",
      onPress: () => {
        setStep("calendar");
      },
    },
  ];

  const handleCancel = () => {
    onClose();
    setSelectedDate(getMinTime());
    setSelectedTime(getMinTime());
    setShowCalendar(false);
    setShowTimePicker(false);
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
                <Pressable onPress={handleCancel} hitSlop={20}>
                  <Ionicons
                    name="close"
                    size={Platform.OS === "ios" ? 28 : 24}
                    color="black"
                  />
                </Pressable>
              </View>

              <View className="gap-3">
                {OPTIONS.map((value) => (
                  <View key={value.id}>
                    <Pressable
                      className={`flex-row items-center justify-between px-4 py-3 border rounded-lg ${value.id === bookingType?.type
                        ? " border-darkPrimary bg-orange-50"
                        : " border-gray-300"
                        }`}
                      onPress={value.onPress}
                    >
                      <View className="gap-0.5">
                        <View className="flex-row gap-2 items-center">
                          <Ionicons
                            name={value.icon as keyof typeof Ionicons.glyphMap}
                            size={20}
                            color={
                              value.id === bookingType?.type
                                ? "#FFA840"
                                : "gray"
                            }
                          />
                          <Text
                            className={`text-base font-medium ${value.id === bookingType?.type ? "text-lightPrimary" : ""}`}
                          >
                            {value.name}
                          </Text>
                        </View>
                        {value.subtext && (
                          <Text className="text-xs text-gray-500 mt-0.5">
                            {value.subtext}
                          </Text>
                        )}
                      </View>
                      <Pressable
                        onPress={() => {
                          setSelectedOption(value);
                          setInfoVisible(true);
                        }}
                        hitSlop={20}
                      >
                        <Ionicons
                          name="information-circle"
                          color="#FFA840"
                          size={Platform.OS === "ios" ? 25 : 22}
                        />
                      </Pressable>
                    </Pressable>

                    {/* ASAP Sub-picker */}
                    {value.id === "asap" && bookingType?.type === "asap" && (
                      <View className="mt-2 gap-2">
                        <View className="flex-row gap-2">
                          <Pressable
                            className={`flex-1 px-1.5 py-2 border rounded-lg ${bookingType.value === "REGULAR"
                              ? "border-darkPrimary bg-orange-50"
                              : "border-gray-300 bg-white"
                              }`}
                            onPress={() => handleConfirm("asap", "REGULAR")}
                          >
                            <View className="flex-row items-center justify-center gap-1">
                              <Ionicons
                                name="time-outline"
                                size={16}
                                color={
                                  bookingType.value === "REGULAR"
                                    ? "#FFA840"
                                    : "gray"
                                }
                              />
                              <Text
                                className={`text-sm font-medium ${bookingType.value === "REGULAR"
                                  ? "text-lightPrimary"
                                  : "text-gray-600"
                                  }`}
                              >
                                Regular
                              </Text>
                            </View>
                            <Text className="text-xs text-gray-500 text-center mt-1">
                              Standard &#8226; pickup in ~2hrs
                            </Text>
                          </Pressable>
                          <Pressable
                            className={`flex-1 px-1.5 py-2 border rounded-lg ${bookingType.value === "PRIORITY"
                              ? "border-darkPrimary bg-orange-50"
                              : "border-gray-300 bg-white"
                              }`}
                            onPress={() => handleConfirm("asap", "PRIORITY")}
                          >
                            <View className="flex-row items-center justify-center gap-1">
                              <Ionicons
                                name="flash-outline"
                                size={16}
                                color={
                                  bookingType.value === "PRIORITY"
                                    ? "#FFA840"
                                    : "gray"
                                }
                              />
                              <Text
                                className={`text-sm font-medium ${bookingType.value === "PRIORITY"
                                  ? "text-lightPrimary"
                                  : "text-gray-600"
                                  }`}
                              >
                                Priority
                              </Text>
                            </View>
                            <Text className="text-xs text-gray-500 text-center mt-1">
                              Quickest &#8226; pickup in &lt;1hr
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}

          {step === "calendar" && (
            <View className="gap-6">
              <View className="relative flex-row items-center justify-center">
                <Pressable
                  hitSlop={20}
                  className="absolute -top-1 left-1"
                  onPress={() => {
                    setStep("main");
                    setSelectedDate(getMinTime());
                    setSelectedTime(getMinTime());
                    setShowCalendar(false);
                    setShowTimePicker(false);
                  }}
                >
                  <Ionicons
                    name="chevron-back-outline"
                    color="#FFA840"
                    size={Platform.OS === "ios" ? 32 : 28}
                  />
                </Pressable>
                <Text className="text-lg font-bold">Max schedule: 1 month</Text>
              </View>

              {Platform.OS === "ios" ? (
                // iOS: Combined Date & Time Picker
                <>
                  <View className="gap-1">
                    <Text className="ml-1 font-semibold text-lg">
                      Date & Time:
                    </Text>
                    <Pressable
                      onPress={() => setShowCalendar(true)}
                      className="items-center py-3 border border-gray-300 rounded-xl"
                    >
                      <Text className="text-base font-semibold text-gray-800">
                        {selectedDate.toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        at{" "}
                        {selectedDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </Pressable>
                  </View>

                  {showCalendar && (
                    <>
                      <DateTimePicker
                        value={selectedDate}
                        mode="datetime"
                        display="spinner"
                        onChange={(event, date) => {
                          if (date) {
                            setSelectedDate(date);
                          }
                        }}
                        minimumDate={new Date(Date.now() + 2.5 * 60 * 60 * 1000)}
                        maximumDate={
                          new Date(
                            new Date().setMonth(new Date().getMonth() + 1)
                          )
                        }
                        textColor="#000000"
                        themeVariant="light"
                      />

                      <Pressable
                        onPress={() => setShowCalendar(false)}
                        className="py-3 bg-lightPrimary rounded-xl"
                      >
                        <Text className="font-semibold text-center text-white">
                          Done
                        </Text>
                      </Pressable>
                    </>
                  )}

                  {!showCalendar && (
                    <Pressable
                      onPress={() => handleConfirm("schedule", "")}
                      className="bg-lightPrimary rounded-xl"
                      style={{
                        paddingVertical: Platform.OS === "ios" ? 15 : 12,
                      }}
                    >
                      <Text className="font-semibold text-center text-white">
                        Confirm
                      </Text>
                    </Pressable>
                  )}
                </>
              ) : (
                // Android: Separate Date & Time Pickers
                <>
                  {/* DATE PICKER */}
                  <View className="gap-1">
                    <Text className="ml-1 font-semibold text-lg">Date:</Text>
                    <Pressable
                      onPress={() => {
                        setShowCalendar(true);
                        setShowTimePicker(false);
                      }}
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
                        if (date) {
                          setSelectedDate(date);
                          setShowTimePicker(true);
                        }
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
                      onPress={() => {
                        setShowCalendar(false);
                        setShowTimePicker(true);
                      }}
                      className="items-center py-3 border border-gray-300 rounded-xl"
                    >
                      <Text className="text-base font-semibold text-gray-800">
                        {selectedTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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

                        if (!time) return;

                        // Apply selected time to the selected date
                        const selected = new Date(selectedDate);
                        selected.setHours(
                          time.getHours(),
                          time.getMinutes(),
                          0,
                          0
                        );

                        // Validate: if selected date is today, time must be at least 2 hours from now
                        if (isToday(selectedDate)) {
                          const minTime = getMinTime();
                          if (selected < minTime) {
                            Toast.show({
                              type: "info",
                              text1: "Invalid time",
                              text2:
                                "Pickup time must be at least 2 hours from now",
                            });
                            setSelectedTime(minTime);
                            return;
                          }
                        }

                        setSelectedTime(selected);
                      }}
                      is24Hour={false}
                    />
                  )}

                  {/* CONFIRM BUTTON */}
                  {!showCalendar && !showTimePicker && (
                    <Pressable
                      onPress={() => handleConfirm("schedule", "")}
                      className="py-3 bg-lightPrimary rounded-xl"
                    >
                      <Text className="font-semibold text-center text-white">
                        Confirm
                      </Text>
                    </Pressable>
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </View>
      <BookingInfoModal
        visible={infoVisible}
        option={selectedOption}
        onClose={() => setInfoVisible(false)}
      />
    </Modal>
  );
}

const BookingInfoModal = ({
  visible,
  onClose,
  option,
}: {
  visible: boolean;
  onClose: () => void;
  option: any;
}) => {
  if (!option) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-full rounded-2xl bg-white p-5">
          <Text className="text-xl font-semibold text-gray-900">
            {option.name}
          </Text>

          <Text className="mt-3 leading-6 text-gray-600">
            {option.description}
          </Text>

          <Pressable
            onPress={onClose}
            className="mt-5 self-end rounded-lg bg-[#FFA840] px-5 py-3"
            hitSlop={20}
          >
            <Text className="font-bold text-white">Got it</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

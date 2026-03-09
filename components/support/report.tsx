import { Booking } from "@/types/book";
import { formatDate, formatDuration } from "@/utils/helpers/date";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

type BookingStatus = "Delivered" | "Cancelled" | "In Transit" | "Pending";

interface ReportTemplate {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface BookingReportTabProps {
  bookings: Booking[];
  selectedBooking: Booking | null;
  onSelectBooking: (booking: Booking) => void;
  dropdownOpen: boolean;
  onOpenDropdown: () => void;
  onCloseDropdown: () => void;
  selectedTemplates: string[];
  onToggleTemplate: (id: string) => void;
  reportMessage: string;
  onChangeReportMessage: (text: string) => void;
  onSubmitReport: () => void;
  reportTemplates: ReportTemplate[];
}

const formatStatus = (status: string): BookingStatus => {
  const map: Record<string, BookingStatus> = {
    completed: "Delivered",
    cancelled: "Cancelled",
    in_transit: "In Transit",
    pending: "Pending",
  };
  return map[status] ?? "Pending";
};

const formatPrice = (amount: number): string => `₱${amount.toFixed(2)}`;

const STATUS_CONFIG: Record<
  BookingStatus,
  { bg: string; text: string; dot: string }
> = {
  Delivered: { bg: "#DCFCE7", text: "#166534", dot: "#22C55E" },
  Cancelled: { bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444" },
  "In Transit": { bg: "#FFF7ED", text: "#9A3412", dot: "#FFA840" },
  Pending: { bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" },
};

const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const c = STATUS_CONFIG[status];
  return (
    <View
      className="flex-row items-center rounded-full px-3 py-1 gap-1.5"
      style={{ backgroundColor: c.bg }}
    >
      <View
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: c.dot }}
      />
      <Text className="text-xs font-semibold" style={{ color: c.text }}>
        {status}
      </Text>
    </View>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  isLast?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  icon,
  isLast = false,
}) => (
  <View
    className={`flex-row items-center gap-3 py-3 ${!isLast ? "border-b border-gray-100" : ""}`}
  >
    <View className="w-8 h-8 rounded-lg items-center justify-center bg-orange-50">
      <Ionicons name={icon} size={15} color="#ED8718" />
    </View>
    <View className="flex-1">
      <Text className="text-xs text-gray-400">{label}</Text>
      <Text className="text-sm font-semibold text-secondary mt-0.5">
        {value}
      </Text>
    </View>
  </View>
);

export default function BookingReportTab({
  bookings,
  selectedBooking,
  onSelectBooking,
  dropdownOpen,
  onOpenDropdown,
  onCloseDropdown,
  selectedTemplates,
  onToggleTemplate,
  reportMessage,
  onChangeReportMessage,
  onSubmitReport,
  reportTemplates,
}: BookingReportTabProps) {
  const canSubmit =
    selectedBooking !== null &&
    (selectedTemplates.length > 0 || reportMessage.trim().length > 0);

  return (
    <View className="gap-4">
      <Text className="text-base font-bold text-secondary">Booking Report</Text>

      {/* Dropdown Selector */}
      <Pressable
        onPress={onOpenDropdown}
        className={`bg-white rounded-2xl px-4 py-3.5 flex-row items-center justify-between border ${
          selectedBooking ? "border-lightPrimary" : "border-gray-200"
        }`}
      >
        <View className="flex-1">
          {selectedBooking ? (
            <>
              <Text className="text-sm font-bold text-secondary">
                {selectedBooking.bookingRef}
              </Text>
              <Text className="text-xs text-gray-400 mt-0.5">
                {formatDate(selectedBooking.createdAt)} ·{" "}
                {selectedBooking.selectedVehicle.name}
              </Text>
            </>
          ) : (
            <Text className="text-sm text-gray-400">
              Select a booking reference...
            </Text>
          )}
        </View>
        <Ionicons
          name="chevron-down"
          size={18}
          color={selectedBooking ? "#FFA840" : "#9CA3AF"}
        />
      </Pressable>

      {/* Booking Summary Card */}
      {selectedBooking && (
        <View className="bg-white rounded-2xl p-4 border border-gray-100">
          <View className="flex-row justify-between items-start mb-3">
            <View>
              <Text className="text-sm font-bold text-secondary">
                {selectedBooking.bookingRef}
              </Text>
              <Text className="text-xs text-gray-400 mt-0.5">
                {formatDate(selectedBooking.createdAt)}
              </Text>
            </View>
            <StatusBadge status={formatStatus(selectedBooking.status)} />
          </View>

          {/* Route */}
          <View className="bg-gray-50 rounded-xl p-3 gap-2 mb-1">
            <View className="flex-row items-center gap-2.5">
              <View className="w-2.5 h-2.5 rounded-full bg-lightPrimary" />
              <Text className="text-xs text-gray-500 flex-1" numberOfLines={1}>
                {selectedBooking.pickUp?.address ?? "—"}
              </Text>
            </View>
            <View className="w-px h-3 bg-gray-200 ml-1" />
            <View className="flex-row items-center gap-2.5">
              <Ionicons
                name="location"
                size={12}
                color="#ED8718"
                style={{ marginLeft: -1 }}
              />
              <Text className="text-xs text-gray-500 flex-1" numberOfLines={1}>
                {selectedBooking.dropOff?.address ?? "—"}
              </Text>
            </View>
          </View>

          <DetailRow
            label="Vehicle"
            value={selectedBooking.selectedVehicle.name}
            icon="car-outline"
          />
          <DetailRow
            label="Driver"
            value={selectedBooking.driver?.name ?? "N/A"}
            icon="person-outline"
          />
          <DetailRow
            label="Distance · Duration"
            value={`${selectedBooking.routeData.distance.toFixed(1)} km · ${formatDuration(selectedBooking.routeData.duration)}`}
            icon="navigate-outline"
          />
          <DetailRow
            label="Payment"
            value={selectedBooking.paymentMethod}
            icon="wallet-outline"
          />

          {/* Fare Breakdown */}
          <View className="mt-3 pt-3 border-t border-gray-100 gap-1.5">
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-400">Base Price</Text>
              <Text className="text-xs text-gray-500">
                {formatPrice(selectedBooking.routeData.basePrice)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-400">Distance Fee</Text>
              <Text className="text-xs text-gray-500">
                {formatPrice(selectedBooking.routeData.distanceFee)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-400">Service Fee</Text>
              <Text className="text-xs text-gray-500">
                {formatPrice(selectedBooking.routeData.serviceFee)}
              </Text>
            </View>
            <View className="flex-row justify-between pt-2 mt-1 border-t border-gray-100">
              <Text className="text-sm font-bold text-secondary">Total</Text>
              <Text className="text-sm font-bold text-secondary">
                {formatPrice(selectedBooking.routeData.totalPrice)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Report Form */}
      <View className={`gap-4 ${!selectedBooking ? "opacity-40" : ""}`}>
        {/* Template Badges */}
        <View className="gap-2">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            What&apos;s the issue?
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {reportTemplates.map((t) => {
              const active = selectedTemplates.includes(t.id);
              return (
                <Pressable
                  key={t.id}
                  onPress={() => selectedBooking && onToggleTemplate(t.id)}
                  className={`flex-row items-center gap-1.5 px-3 py-2 rounded-full border ${
                    active
                      ? " bg-lightPrimary border-lightPrimary"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Ionicons
                    name={t.icon}
                    size={13}
                    color={active ? "white" : "#6B7280"}
                  />
                  <Text
                    className={`text-xs font-semibold ${active ? "text-white" : "text-gray-500"}`}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Message Input */}
        <View className="gap-2">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Additional Details
          </Text>
          <TextInput
            value={reportMessage}
            onChangeText={(t) => t.length <= 500 && onChangeReportMessage(t)}
            placeholder="Describe your concern in detail..."
            placeholderTextColor="#9CA3AF"
            multiline
            editable={!!selectedBooking}
            numberOfLines={5}
            textAlignVertical="top"
            className="bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-secondary min-h-[120px]"
            style={{ textAlignVertical: "top" }}
          />
          <Text className="text-xs text-gray-400 text-right">
            {reportMessage.length} / 500
          </Text>
        </View>

        {/* Submit */}
        <Pressable
          onPress={onSubmitReport}
          disabled={!canSubmit}
          className={`rounded-2xl py-4 items-center justify-center flex-row gap-2 ${
            canSubmit ? "bg-lightPrimary active:bg-darkPrimary" : "bg-gray-200"
          }`}
        >
          <Ionicons
            name="send"
            size={16}
            color={canSubmit ? "white" : "#9CA3AF"}
          />
          <Text
            className={`text-sm font-bold ${canSubmit ? "text-white" : "text-gray-400"}`}
          >
            Submit Report
          </Text>
        </Pressable>
      </View>

      {/* Booking Dropdown Modal */}
      <Modal
        visible={dropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={onCloseDropdown}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={onCloseDropdown}
        >
          <View
            className="bg-white rounded-t-3xl pt-3 pb-8"
            style={{ maxHeight: "60%" }}
          >
            <View className="w-9 h-1 rounded-full bg-gray-200 self-center mb-4" />
            <Text className="text-sm font-bold text-secondary px-5 mb-3">
              Select Booking
            </Text>
            <FlatList
              data={bookings}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = selectedBooking?._id === item._id;
                return (
                  <Pressable
                    onPress={() => {
                      onSelectBooking(item);
                      onCloseDropdown();
                    }}
                    className={`flex-row items-center px-5 py-3.5 border-b border-gray-50 gap-3 active:bg-gray-50 ${
                      isSelected ? "bg-orange-50" : "bg-white"
                    }`}
                  >
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-secondary">
                        {item.bookingRef}
                      </Text>
                      <Text className="text-xs text-gray-400 mt-0.5">
                        {formatDate(item.createdAt)} ·{" "}
                        {item.selectedVehicle.name}
                      </Text>
                    </View>
                    <StatusBadge status={formatStatus(item.status)} />
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#FFA840"
                      />
                    )}
                  </Pressable>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

import ContactTab from "@/components/support/contact";
import FAQTab, { Faq } from "@/components/support/faq";
import BookingReportTab from "@/components/support/report";
import { useRecentBookings } from "@/queries/bookingQueries";
import { Booking } from "@/types/book";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

type TabKey = "bookings" | "faqs" | "contact";

interface Tab {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface ReportTemplate {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const TABS: Tab[] = [
  { key: "bookings", label: "Booking Report", icon: "document-text-outline" },
  { key: "faqs", label: "FAQs", icon: "help-circle-outline" },
  { key: "contact", label: "Contact", icon: "call-outline" },
];

const REPORT_TEMPLATES: ReportTemplate[] = [
  { id: "late", label: "Driver Late", icon: "time-outline" },
  { id: "damaged", label: "Damaged Package", icon: "warning-outline" },
  { id: "missing", label: "Item Missing", icon: "cube-outline" },
  { id: "wrong", label: "Wrong Drop-off", icon: "location-outline" },
  { id: "rude", label: "Driver Misconduct", icon: "person-remove-outline" },
  { id: "overcharge", label: "Overcharged", icon: "cash-outline" },
  { id: "other", label: "Other", icon: "alert-circle-outline" },
];

const FAQS: Faq[] = [
  {
    id: 1,
    question: "How do I track my delivery in real-time?",
    answer:
      "Go to your dashboard and tap any active booking. A live map will show your driver's exact location and ETA.",
  },
  {
    id: 2,
    question: "Can I cancel or reschedule a booking?",
    answer:
      "You can cancel or reschedule up to 30 minutes before the scheduled pickup via your booking details. Cancellations after the cutoff may incur a fee.",
  },
  {
    id: 3,
    question: "What items are not allowed for delivery?",
    answer:
      "Prohibited items include flammable materials, illegal substances, live animals, and perishable goods requiring cold storage.",
  },
  {
    id: 4,
    question: "How is the delivery fee calculated?",
    answer:
      "Fees are based on distance, vehicle type, and current demand. You'll always see the exact fare before confirming — no hidden charges.",
  },
  {
    id: 5,
    question: "My package was damaged. What do I do?",
    answer:
      "Take photos immediately and report within 24 hours via Live Chat or email. Our team will process a claim within 3–5 business days.",
  },
  {
    id: 6,
    question: "How do I update my delivery address after booking?",
    answer:
      "Address changes are only allowed before a driver is assigned. Once matched, please contact support directly.",
  },
];

export default function CustomerSupport() {
  const [activeTab, setActiveTab] = useState<TabKey>("bookings");

  // Booking Report state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [reportMessage, setReportMessage] = useState<string>("");

  // FAQs state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: bookings, isPending, error, refetch } = useRecentBookings(10);

  const toggleTemplate = (id: string): void => {
    setSelectedTemplates((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleSubmitReport = (): void => {
    // TODO: wire up API call
    console.log("Submitting report", {
      selectedBooking,
      selectedTemplates,
      reportMessage,
    });
  };

  const handleCall = (): void => {};
  const handleEmail = (): void => {};
  const handleOpenLiveChat = (): void => {
    // TODO: navigate to live chat screen
  };

  if (error) {
    return (
      <View className="flex-1 items-center justify-center gap-2">
        <Text className="text-gray-500">Error loading support</Text>
        <Text className="text-gray-500">{error.message}</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#9CA3AF" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      {/* Tab Bar */}
      <View className="flex-row bg-white px-3 py-2 border-b border-gray-100">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
              className={`flex-1 items-center py-2 rounded-xl gap-1 ${isActive ? "bg-orange-50" : ""}`}
            >
              <Ionicons
                name={tab.icon}
                size={18}
                color={isActive ? "#FFA840" : "#9CA3AF"}
              />
              <Text
                className={`text-[10px] ${isActive ? "font-bold text-darkPrimary" : "text-gray-400"}`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
      >
        {activeTab === "bookings" && (
          <BookingReportTab
            bookings={bookings}
            selectedBooking={selectedBooking}
            onSelectBooking={setSelectedBooking}
            dropdownOpen={dropdownOpen}
            onOpenDropdown={() => setDropdownOpen(true)}
            onCloseDropdown={() => setDropdownOpen(false)}
            selectedTemplates={selectedTemplates}
            onToggleTemplate={toggleTemplate}
            reportMessage={reportMessage}
            onChangeReportMessage={setReportMessage}
            onSubmitReport={handleSubmitReport}
            reportTemplates={REPORT_TEMPLATES}
          />
        )}

        {activeTab === "faqs" && (
          <FAQTab
            faqs={FAQS}
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
            expandedFaqId={expandedFaq}
            onToggleFaq={(id) => setExpandedFaq(expandedFaq === id ? null : id)}
          />
        )}

        {activeTab === "contact" && (
          <ContactTab
            onCall={handleCall}
            onEmail={handleEmail}
            onOpenLiveChat={handleOpenLiveChat}
          />
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

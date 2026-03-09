import ContactTab from "@/components/support/contact";
import FAQTab, { Faq } from "@/components/support/faq";
import BookingReportTab from "@/components/support/report";
import { Booking } from "@/types/book";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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

const BOOKINGS: Booking[] = [
  {
    _id: "66f1a2b3c4d5e6f7a8b9c001",
    bookingRef: "FM-20260305-001",
    customerId: "cust_001",
    pickUp: {
      name: "Makati CBD",
      address: "Ayala Ave, Makati City, Metro Manila",
      coords: { lat: 14.5547, lng: 121.0244 },
    },
    dropOff: {
      name: "Quezon City Hall",
      address: "Elliptical Rd, Quezon City, Metro Manila",
      coords: { lat: 14.6507, lng: 121.0494 },
    },
    bookingType: { type: "asap", value: "" },
    selectedVehicle: { name: "Motorcycle", freeServices: [] },
    routeData: {
      distance: 12400,
      duration: 1800,
      basePrice: 80,
      distanceFee: 160,
      serviceFee: 40,
      totalPrice: 280,
    },
    paymentMethod: "GCash",
    addedServices: [],
    note: "",
    itemType: "Documents",
    photos: [],
    createdAt: "2026-03-05T08:30:00.000Z",
    status: "pending",
    driverRating: 5,
    cancelledAt: null,
    requestedDrivers: [],
    driver: {
      id: "66f1a2b3c4d5e6f7a8b9c001",
      name: "John Doe",
      rating: 4.5,
      profilePictureUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    },
  },
  {
    _id: "66f1a2b3c4d5e6f7a8b9c002",
    bookingRef: "FM-20260302-009",
    customerId: "cust_001",
    pickUp: {
      name: "BGC",
      address: "9th Ave, Bonifacio Global City, Taguig",
      coords: { lat: 14.5502, lng: 121.051 },
    },
    dropOff: {
      name: "Pasay City",
      address: "Taft Ave, Pasay City, Metro Manila",
      coords: { lat: 14.5378, lng: 120.998 },
    },
    bookingType: { type: "schedule", value: "2026-03-02T15:00:00.000Z" },
    selectedVehicle: { name: "Sedan", freeServices: [] },
    routeData: {
      distance: 8100,
      duration: 1200,
      basePrice: 120,
      distanceFee: 0,
      serviceFee: 0,
      totalPrice: 0,
    },
    paymentMethod: "Cash",
    addedServices: [],
    note: "",
    itemType: null,
    photos: [],
    createdAt: "2026-03-02T14:10:00.000Z",
    status: "cancelled",
    driverRating: null,
    cancelledAt: "2026-03-02T14:25:00.000Z",
    requestedDrivers: [],
  },
  {
    _id: "66f1a2b3c4d5e6f7a8b9c003",
    bookingRef: "FM-20260228-015",
    customerId: "cust_001",
    pickUp: {
      name: "Mandaluyong City",
      address: "Shaw Blvd, Mandaluyong City, Metro Manila",
      coords: { lat: 14.5794, lng: 121.0359 },
    },
    dropOff: {
      name: "Marikina City",
      address: "Marcos Highway, Marikina City, Metro Manila",
      coords: { lat: 14.6507, lng: 121.1029 },
    },
    bookingType: { type: "asap", value: "" },
    selectedVehicle: { name: "Motorcycle", freeServices: [] },
    routeData: {
      distance: 7600,
      duration: 1080,
      basePrice: 80,
      distanceFee: 80,
      serviceFee: 35,
      totalPrice: 195,
    },
    paymentMethod: "GCash",
    addedServices: [],
    note: "Handle with care",
    itemType: "Parcel",
    photos: [],
    createdAt: "2026-02-28T10:00:00.000Z",
    status: "completed",
    driverRating: 4,
    cancelledAt: null,
    requestedDrivers: [],
    driver: {
      id: "66f1a2b3c4d5e6f7a8b9c001",
      name: "John Doe",
      rating: 4.5,
      profilePictureUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    },
  },
  {
    _id: "66f1a2b3c4d5e6f7a8b9c004",
    bookingRef: "FM-20260225-022",
    customerId: "cust_001",
    pickUp: {
      name: "Las Piñas City",
      address: "Alabang-Zapote Rd, Las Piñas City, Metro Manila",
      coords: { lat: 14.45, lng: 120.9822 },
    },
    dropOff: {
      name: "Muntinlupa City",
      address: "National Rd, Muntinlupa City, Metro Manila",
      coords: { lat: 14.4081, lng: 121.0415 },
    },
    bookingType: { type: "asap", value: "" },
    selectedVehicle: { name: "L300 Van", freeServices: [] },
    routeData: {
      distance: 9300,
      duration: 1500,
      basePrice: 200,
      distanceFee: 100,
      serviceFee: 40,
      totalPrice: 340,
    },
    paymentMethod: "Cash",
    addedServices: [],
    note: "",
    itemType: "Furniture",
    photos: [],
    createdAt: "2026-02-25T09:15:00.000Z",
    status: "completed",
    driverRating: 5,
    cancelledAt: null,
    requestedDrivers: [],
    driver: {
      id: "66f1a2b3c4d5e6f7a8b9c002",
      name: "Joel Castillo",
      rating: 4.5,
      profilePictureUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    },
  },
  {
    _id: "66f1a2b3c4d5e6f7a8b9c005",
    bookingRef: "FM-20260220-008",
    customerId: "cust_001",
    pickUp: {
      name: "Caloocan City",
      address: "A. Mabini St, Caloocan City, Metro Manila",
      coords: { lat: 14.6499, lng: 120.978 },
    },
    dropOff: {
      name: "Malabon City",
      address: "Gov. Pascual Ave, Malabon City, Metro Manila",
      coords: { lat: 14.6625, lng: 120.9572 },
    },
    bookingType: { type: "asap", value: "" },
    selectedVehicle: { name: "Motorcycle", freeServices: [] },
    routeData: {
      distance: 5200,
      duration: 720,
      basePrice: 80,
      distanceFee: 50,
      serviceFee: 30,
      totalPrice: 160,
    },
    paymentMethod: "GCash",
    addedServices: [],
    note: "",
    itemType: "Documents",
    photos: [],
    createdAt: "2026-02-20T16:45:00.000Z",
    status: "in_transit",
    driverRating: null,
    cancelledAt: null,
    requestedDrivers: [],
    driver: {
      id: "66f1a2b3c4d5e6f7a8b9c003",
      name: "Bryan Lim",
      rating: 4.5,
      profilePictureUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  },
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
            bookings={BOOKINGS}
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

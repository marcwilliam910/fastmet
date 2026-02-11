export enum NOTIFICATION_TYPES {
  driver_offer = "driver_offer",
  booking_expired = "booking_expired",
  // Add new notification types here as needed
  // Example: payment_received = "payment_received",
}

// Extensible notification configuration
// Add new notification types here with their display properties
export interface NotificationConfig {
  icon: string; // Ionicons name
  color: string; // Hex color
  label: string; // Display label
}

export const NOTIFICATION_CONFIG: Record<
  NOTIFICATION_TYPES,
  NotificationConfig
> = {
  [NOTIFICATION_TYPES.driver_offer]: {
    icon: "car",
    color: "#22C55E", // green
    label: "New Driver Offer",
  },
  [NOTIFICATION_TYPES.booking_expired]: {
    icon: "close-circle",
    color: "#EF4444", // red
    label: "Booking Expired",
  },
  // Add new notification configs here
};

// Default fallback for unknown notification types
export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  icon: "notifications",
  color: "#6B7280", // gray
  label: "Notification",
};

// Helper function to get notification config with fallback
export const getNotificationConfig = (
  type: NOTIFICATION_TYPES,
): NotificationConfig => {
  return NOTIFICATION_CONFIG[type] || DEFAULT_NOTIFICATION_CONFIG;
};

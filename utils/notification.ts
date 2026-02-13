export interface NotificationConfig {
  icon: string; // Ionicons name
  color: string; // Hex color
  label: string; // Display label
}

export enum NOTIFICATION_TYPES {
  driver_offer = "driver_offer",
  booking_expired = "booking_expired",
  scheduled_choose_driver = "scheduled_choose_driver",
  scheduled_no_drivers = "scheduled_no_drivers",
  scheduled_auto_assign_warning = "scheduled_auto_assign_warning",
  scheduled_auto_assigned = "scheduled_auto_assigned",
  scheduled_auto_cancelled = "scheduled_auto_cancelled",
  // Add new notification types here as needed
  // Example: payment_received = "payment_received",
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
  [NOTIFICATION_TYPES.scheduled_choose_driver]: {
    icon: "people",
    color: "#3B82F6", // blue
    label: "Choose Driver",
  },
  [NOTIFICATION_TYPES.scheduled_no_drivers]: {
    icon: "alert-circle",
    color: "#F59E0B", // amber
    label: "No Drivers Yet",
  },
  [NOTIFICATION_TYPES.scheduled_auto_assign_warning]: {
    icon: "time",
    color: "#F97316", // orange
    label: "Auto-Assign Warning",
  },
  [NOTIFICATION_TYPES.scheduled_auto_assigned]: {
    icon: "checkmark-circle",
    color: "#10B981", // green
    label: "Driver Assigned",
  },
  [NOTIFICATION_TYPES.scheduled_auto_cancelled]: {
    icon: "close-circle",
    color: "#DC2626", // red
    label: "Booking Cancelled",
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

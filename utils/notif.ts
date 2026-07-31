import { Ionicons } from "@expo/vector-icons";

export const TYPE_BADGE_STYLES: Record<
  string,
  { bg: string; text: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  announcement: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    icon: "megaphone-outline",
  },
  update: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    icon: "sync-outline",
  },
  promotion: {
    bg: "bg-green-100",
    text: "text-green-700",
    icon: "pricetag-outline",
  },
  alert: { bg: "bg-red-100", text: "text-red-700", icon: "warning-outline" },
};

const DEFAULT_BADGE = {
  bg: "bg-gray-100",
  text: "text-gray-700",
  icon: "information-circle-outline" as const,
};

export const getTypeBadgeStyle = (type: string) =>
  TYPE_BADGE_STYLES[type] ?? DEFAULT_BADGE;

const ICON_COLORS: Record<string, string> = {
  Announcement: "#C2410C",
  Update: "#1D4ED8",
  Promotion: "#15803D",
  Alert: "#B91C1C",
};
export const iconColorFor = (type: string) => ICON_COLORS[type] ?? "#374151";

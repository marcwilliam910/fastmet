import {
  ACCOUNT_DEACTIVATED_ROUTE,
  DEVICE_BANNED_ROUTE,
} from "@/constants/routes";
import { router } from "expo-router";

export function routeAuthGuardError(error: {
  response?: { status?: number; data?: Record<string, unknown> };
}): boolean {
  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 403 && data?.deviceBanned) {
    router.replace(DEVICE_BANNED_ROUTE);
    return true;
  }

  if (
    status === 403 &&
    (data?.accountDeactivated || data?.accountBlocked)
  ) {
    router.replace(ACCOUNT_DEACTIVATED_ROUTE);
    return true;
  }

  return false;
}

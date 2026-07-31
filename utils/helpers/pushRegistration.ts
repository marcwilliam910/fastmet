import {deleteItemAsync, getItemAsync} from "expo-secure-store";

export const PUSH_REGISTRATION_KEY = "push_registration";

export type PushRegistration = {
  token: string;
  userId: string;
};

export async function getPushRegistration() {
  const raw = await getItemAsync(PUSH_REGISTRATION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PushRegistration;
  } catch {
    return null;
  }
}

export async function clearPushRegistrationCache() {
  await deleteItemAsync(PUSH_REGISTRATION_KEY);
}

import { LocationDetails } from "@/types/book";
import * as SecureStore from "expo-secure-store";

// Save an array
const saveArray = async (key: string, array: LocationDetails[]) => {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(array));
  } catch (error) {
    console.error(`Failed to save array for key "${key}":`, error);
  }
};

// Read an array
const getArray = async (key: string) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error(`Failed to read array for key "${key}":`, error);
    return [];
  }
};

// Push a new item to the array
const pushToArray = async (key: string, newItem: LocationDetails) => {
  try {
    const currentArray = await getArray(key);

    //dont add if already exists
    if (
      currentArray.some((item: LocationDetails) => item?.name === newItem?.name)
    )
      return;

    // Keep array size max 3
    if (currentArray.length === 3) currentArray.pop();

    currentArray.unshift(newItem);
    await saveArray(key, currentArray);
  } catch (error) {
    console.error(`Failed to push item to array for key "${key}":`, error);
  }
};

export { getArray, pushToArray, saveArray };

export const isDateString = (value: string): boolean => {
  const date = new Date(value);
  return !isNaN(date.getTime());
};

// utils/formatDate.js
export function formatDate(dateString: string) {
  const date = new Date(dateString);

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date
    .toLocaleDateString("en-US", dateOptions)
    .replace(",", "")
    .replace(/(\b[A-Za-z]{3})/, "$1."); // add dot after month

  const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

  return `${formattedDate} \n ${formattedTime}`;
}

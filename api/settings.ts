export const fetchAllowedDomains = async (): Promise<string[]> => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/domains/allowed-domains`);
  if (!res.ok) throw new Error("Failed to fetch allowed domains");
  const data = await res.json();
  return data.allowedEmailDomains as string[];
};

export const ALLOWED_EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "icloud.com"];

export function isAllowedEmailDomain(
  email: string,
  domains: string[] = ALLOWED_EMAIL_DOMAINS,
): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  return !!domain && domains.includes(domain);
}

export function allowedDomainsMessage(domains: string[]): string {
  return `Only ${domains.join(", ")} addresses are accepted`;
}

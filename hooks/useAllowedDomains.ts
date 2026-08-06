import {fetchAllowedDomains} from "@/api/settings";
import {ALLOWED_EMAIL_DOMAINS} from "@/utils/helpers/emailDomain";
import {useQuery} from "@tanstack/react-query";

export const useAllowedDomains = (): string[] => {
  const {data} = useQuery({
    queryKey: ["allowedDomains"],
    queryFn: fetchAllowedDomains,
    staleTime: Infinity,
  });
  return data ?? ALLOWED_EMAIL_DOMAINS;
};

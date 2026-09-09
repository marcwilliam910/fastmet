import {reportAPI} from "@/api/reports";
import {useAuth} from "@/hooks/useAuth";
import {useQuery} from "@tanstack/react-query";

export const PENDING_REPORTS_AGAINST_ME_KEY = [
  "pendingReportsAgainstMeCount",
] as const;

export const usePendingReportsAgainstMeCount = () => {
  const {isLoggedIn} = useAuth();

  return useQuery({
    queryKey: PENDING_REPORTS_AGAINST_ME_KEY,
    queryFn: () => reportAPI.getPendingAgainstMeCount(),
    enabled: isLoggedIn,
    select: (data) => data.count,
  });
};

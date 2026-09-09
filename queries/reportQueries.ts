import {reportAPI} from "@/api/reports";
import {useAuth} from "@/hooks/useAuth";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";

export const REPORTS_PAGE_SIZE = 20;

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

export const useReports = (type: "filed" | "received") =>
  useInfiniteQuery({
    queryKey: ["reports", type],
    queryFn: ({pageParam}) =>
      reportAPI.getReports({
        type,
        limit: REPORTS_PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.reports.length;
      if (nextOffset >= lastPage.total || lastPage.reports.length === 0) {
        return undefined;
      }
      return nextOffset;
    },
  });

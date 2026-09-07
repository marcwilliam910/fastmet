import {reportAPI} from "@/api/reports";
import {queryClient} from "@/lib/queryClient";
import {ReportSubmission} from "@/types/report";
import {useMutation} from "@tanstack/react-query";
import {AxiosError} from "axios";
import Toast from "react-native-toast-message";

export const useSubmitReportMutation = () =>
  useMutation({
    mutationFn: (data: ReportSubmission) => reportAPI.submit(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: ["reports"]});
      void queryClient.invalidateQueries({queryKey: ["eligibleBookings"]});

      Toast.show({
        type: "success",
        text1: "Report Submitted",
        text2: "Your report has been filed successfully",
      });
    },
    onError: (error: AxiosError<{message?: string}>) => {
      Toast.show({
        type: "error",
        text1: "Failed to submit report",
        text2: error.response?.data?.message || "Please try again",
      });
    },
  });

export const useReplyToReportMutation = () => {
  return useMutation({
    mutationFn: ({id, message}: {id: string; message: string}) =>
      reportAPI.reply(id, message),
    onSuccess: (_, variables) => {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Your reply has been submitted",
      });
      queryClient.invalidateQueries({queryKey: ["reports"]});
      queryClient.invalidateQueries({queryKey: ["report", variables.id]});
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to submit reply";
      Toast.show({
        type: "error",
        text1: "Failed to submit reply",
        text2: message,
      });
    },
  });
};

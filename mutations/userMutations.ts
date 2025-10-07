import {registerUserProfile} from "@/api/user";
import {queryClient} from "@/lib/queryClient";
import {useMutation} from "@tanstack/react-query";

export const useRegisterProfile = () => {
  return useMutation({
    mutationFn: registerUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["userProfile"]});
    },
    onError: (error: any) => {
      console.error(
        "Profile registration failed:",
        error.response?.data || error.message
      );
    },
  });
};

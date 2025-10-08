import {registerUserProfile, updateUserProfile} from "@/api/user";
import {queryClient} from "@/lib/queryClient";
import {User} from "@/types/user";
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

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: ({uid, user}: {uid: string; user: Partial<User>}) =>
      updateUserProfile(uid, user),
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

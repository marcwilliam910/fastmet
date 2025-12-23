// export const useRegisterProfile = () => {
//   return useMutation({
//     mutationFn: registerUserProfile,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["userProfile"] });
//     },
//     onError: (error: any) => {
//       console.error(
//         "Profile registration failed:",
//         error.response?.data || error.message
//       );
//     },
//   });
// };

// export const useUpdateProfile = () => {
//   return useMutation({
//     mutationFn: ({ id, user }: { id: string; user: Partial<NewUser> }) =>
//       updateUserProfile(id, user),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["userProfile"] });
//     },
//     onError: (error: any) => {
//       console.error(
//         "Profile update failed:",
//         error.response?.data || error.message
//       );
//     },
//   });
// };

// export async function registerUserProfile(payload: NewUser) {
//   const res = await api.post<ApiResponse<NewUser>>(
//     "/user/register-profile",
//     payload
//   );
//   return res.data;
// }

// export async function updateUserProfile(
//   uid: string,
//   payload: Partial<NewUser>
// ) {
//   const formData = new FormData();

//   // Add text fields
//   if (payload.fullName !== undefined) {
//     formData.append("fullName", payload.fullName);
//   }
//   if (payload.address !== undefined) {
//     formData.append("address", payload.address);
//   }
//   if (payload.gender !== undefined) {
//     formData.append("gender", payload.gender || "");
//   }

//   // Handle profile picture deletion
//   if (payload.profilePictureUrl === "") {
//     formData.append("deleteProfilePicture", "true");
//   }
//   // Handle new profile picture upload (local file)
//   else if (
//     payload.profilePictureUrl &&
//     (payload.profilePictureUrl.startsWith("file://") ||
//       payload.profilePictureUrl.startsWith("content://") ||
//       payload.profilePictureUrl.startsWith("ph://"))
//   ) {
//     const filename =
//       payload.profilePictureUrl.split("/").pop() || "profile.jpg";
//     const match = /\.(\w+)$/.exec(filename);
//     const type = match ? `image/${match[1]}` : "image/jpeg";

//     formData.append("profilePicture", {
//       uri: payload.profilePictureUrl,
//       type: type,
//       name: filename,
//     } as any);
//   }

//   const res = await api.patch<{
//     success: boolean;
//     message: string;
//     user: NewUser;
//   }>(`/profile/update-profile`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//       Authorization: `Bearer ${useAppStore.getState().token}`,
//     },
//   });

//   return res.data;
// }

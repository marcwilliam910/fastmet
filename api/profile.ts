import api from "@/lib/axios";
import {ApprovalStatus} from "@/store/slices/authSlice";

export type UploadIdImagesResponse = {
  success: boolean;
  message: string;
  images: Record<string, string>;
  registrationStep: number;
  approvalStatus: ApprovalStatus;
};

export type ActiveRejectionResponse = {
  success: boolean;
  adminNote: string;
  flaggedFields: string[];
};

export const uploadIdImages = async (
  idImageUri: string,
  selfieUri: string,
): Promise<UploadIdImagesResponse> => {
  const formData = new FormData();

  formData.append("images", {
    uri: idImageUri,
    type: "image/jpeg",
    name: "idImage.jpg",
  } as any);
  formData.append("types", "idImage");

  formData.append("images", {
    uri: selfieUri,
    type: "image/jpeg",
    name: "selfieWithId.jpg",
  } as any);
  formData.append("types", "selfieWithId");

  const res = await api.post<UploadIdImagesResponse>(
    "/profile/upload-id-images",
    formData,
    {headers: {"Content-Type": "multipart/form-data"}},
  );

  return res.data;
};

export const getActiveRejection = async (): Promise<ActiveRejectionResponse> => {
  const res = await api.get<ActiveRejectionResponse>("/rejection");
  return res.data;
};

export const resubmitRejectedFields = async (
  fields: Record<string, string | {uri: string; type?: string; name?: string}>,
): Promise<{success: boolean}> => {
  const formData = new FormData();

  for (const [field, value] of Object.entries(fields)) {
    if (typeof value === "string") {
      formData.append(field, value);
    } else {
      formData.append(field, {
        uri: value.uri,
        type: value.type || "image/jpeg",
        name: value.name || `${field}.jpg`,
      } as any);
    }
  }

  const res = await api.post<{success: boolean}>(
    "/rejection/resubmit",
    formData,
    {headers: {"Content-Type": "multipart/form-data"}},
  );

  return res.data;
};

import {ApprovalStatus} from "@/store/slices/authSlice";

export const hasProfile = (registrationStep: number) => registrationStep >= 2;

export const hasSubmittedId = (registrationStep: number) =>
  registrationStep >= 3;

export const canBook = (approvalStatus: ApprovalStatus) =>
  approvalStatus === "approved";

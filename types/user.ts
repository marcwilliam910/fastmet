export type UserAddress = {
  name: string;
  fullAddress: string;
  coords: {lat: number; lng: number};
  street?: string;
  barangay?: string;
  city?: string;
  province?: string;
} | null;

export type NewUser = {
  fullName: string;
  address: UserAddress;
  gender: string;
  email: string;
  profilePictureUrl?: string;
};

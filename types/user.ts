export type User = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  contactNumber?: string;
  birthDate?: string;
  profilePictureUrl?: string;
  fromOAuth: boolean;
};

export type NewUser = {
  fullName: string;
  address?: string;
  gender?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
};

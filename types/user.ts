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

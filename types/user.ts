export type User = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate?: string;
  profilePictureUrl?: string;
  fromOAuth: boolean;
};

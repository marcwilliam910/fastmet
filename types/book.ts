export type Vehicle = {
  id: string;
  name: string;
  img: string;
  desc: string;
  price?: number; //placeholder
  capacity: string;
};

export type LocationDetails = {
  name: string;
  address: string;
  coords: { lat: number; lng: number };
} | null;

export type Service = {
  id: string;
  name: string;
  price: string | null;
  icon: string;
};

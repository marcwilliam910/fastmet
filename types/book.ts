export type Vehicle = {
  id: string;
  name: string;
  img: string;
  desc: string;
  price?: number; //placeholder
  capacity: string;
};

export type LocationData = {
  name: string;
  address: string;
  coords: { lat: number; lng: number };
} | null;

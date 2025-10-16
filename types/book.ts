export type Service = {
  id: string;
  name: string;
  price: string | null;
  icon: string;
};

export type Method = {
  id: "regular" | "bidding" | "pooling";
  label: string;
  price: string;
  icon: string;
  badge: null | string;
  description: string;
};

export type BidCardProps = {
  driverName: string;
  rating: number;
  totalBooking: number;
  amount: number;
};

export type Vehicle = {
  id: string;
  name: string;
  img: string;
  description: string;
};

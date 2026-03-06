export type BookingTypeKey = "asap" | "pooling" | "schedule";

export interface SubOption {
  key: string;
  name: string;
  icon: string;
  subtext?: string;
  description: string;
  priceModifier: number;
  isActive: boolean;
  order: number;
}

export interface BookingTypeConfig {
  _id: string;
  key: BookingTypeKey;
  name: string;
  icon: string;
  subtext?: string;
  description: string;
  note: string;
  priceModifier: number;
  subOptions: SubOption[];
  isActive: boolean;
  order: number;
}

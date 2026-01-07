interface IPricingTier {
  minKm: number; // inclusive
  maxKm?: number; // undefined = infinity
  pricePerKm: number;
}

export interface ILoadVariant {
  maxLoadKg: number;
  baseFare: number;
  pricingTiers: IPricingTier[];
  isActive: boolean;
}

export interface IVehicleType extends Document {
  key: string; // motorcycle, sedan, l300, closed_van, wing_van
  name: string; // UI display
  imageUrl: string; // Cloudinary
  desc: string;
  variants: ILoadVariant[];
  isActive: boolean;
}

export interface SelectedVehicle extends Document {
  key: string; // motorcycle, sedan, l300, closed_van, wing_van
  name: string; // UI display
  imageUrl: string; // Cloudinary
  desc: string;
  variant: ILoadVariant | null;
  isActive: boolean;
}

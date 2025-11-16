export type Services =
  | "student"
  | "employer"
  | "ausbildung"
  | "fsj"
  | "fachkraft";

export type ServicePageData = {
  title: string;
  description: string;
  picture: string;
  priceRangeInEuro: string;
  beginningDate?: string;
  durationInMonths: number;
  requirements: string[];
  included: string[];
  photos?: string[];
  reviews?: {
    name: string;
    review: string;
    rating: number;
    instagram?: string;
    image?: string;
  }[];
};

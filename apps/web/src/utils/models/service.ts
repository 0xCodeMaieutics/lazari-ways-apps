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
  priceInEuro: number;
  beginningDate?: string;
  durationInMonths: number;
  requirements: string[];
  included: string[];
  photos?: string[];
  reviews?: { name: string; review: string; rating: number }[];
};

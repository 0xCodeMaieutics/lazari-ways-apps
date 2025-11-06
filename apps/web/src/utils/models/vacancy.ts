export const employmentTypeLabels = {
  "full-time": "სრული განაკვეთი",
  "part-time": "ნახევარი განაკვეთი",
  temporary: "დროებითი",
  internship: "სტაჟირება",
};
export type EmploymentType = keyof typeof employmentTypeLabels;

export interface Vacancy {
  title: string;
  description: string;
  priceInEuro: [number, number];
  requirements: string[];
  benefits: string[];
  employmentType: EmploymentType;
  imageUrl?: string;
}

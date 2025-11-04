import { ServicePageData, Services } from "@/utils/models/service";
import { notFound } from "next/navigation";
import { ServicesClientPage } from "./page.client";
import { getTranslations } from "@/i18n/translations";
import { Locale } from "@/i18n";

// @ts-nocheck asdf
const servicesData: Record<Services, ServicePageData> = {
  student: {
    title: "სტუდენტური დასაქმება",
    description:
      "ბევრი ირჩევს გერმანიას სამუშაოდ წასასვლელად მაღალი ხელფასის, ქვეყნის სწრაფი განვითარების, გერმანელების კეთილგანწყობისა და საქართველოსთან სიახლოვის გამო. ჩვენ გვყავს 550-ზე მეტი სანდო დამსაქმებელი, ამიტომ ყველასთვის გამოჩნდება სამუშაო. ვასაქმებთ სტუდენტებს (ზაფხულში, არდადეგების პერიოდში ZAV-ის პროგრამით ან ფასიანი სტაჟირების ფარგლებში), ასევე 18-55 წლის პირებს 3 თვით ან მეტი ვადით. გერმანიაში სამუშაოდ წასასვლელად არ არის აუცილებელი უცხო ენის ცოდნა. ხელფასი თვეში 1200-დან 3000 ევრომდე მერყეობს.",
    picture: "/images/services/student.webp",
    // List
    priceInEuro: 500,
    beginningDate: "2026-01-01",
    durationInMonths: 3,
    requirements: [
      "უნივერსიტეტში უნდა იყოთ ჩარიცხული",
      "გერმანული ენის საბაზისო ცოდნა",
      "შრომისმოყვარეობის სურვილი",
    ],
    included: [
      "სამუშაოს შესატყვისი",
      "საბუთების სრული პაკეტის",
      "სადაზღვეო პოლისის გაფორმება;",
      "ტრანსპორტის ორგანიზებ",
      "მენეჯერის ონლაინ დახმარებ",
    ],
    photos: [
      "/images/employers/employers-1.webp",
      "/images/employers/employers-1.webp",
      "/images/employers/employers-1.webp",
      "/images/employers/employers-1.webp",
      "/images/employers/employers-1.webp",
      "/images/employers/employers-1.webp",
      "/images/employers/employers-1.webp",
      "/images/employers/employers-1.webp",
      "/images/employers/employers-1.webp",
    ],
    reviews: [
      {
        name: "ნინო ქათამაძე",
        rating: 5,
        review:
          "ეს საოცარი იყო, მე და ჩემს მეგობრებს გერმანიაში შესანიშნავი სამუშაო მივიღეთ. Lazari Ways-მა ყველაფერი გააკეთა მარტივი და სტრესის გარეშე.",
        instagram: "@nino.katamadze",
        image: "/images/reviewers/reviewer-1.webp",
      },
      {
        name: "ნინო ქათამაძე",
        rating: 5,
        review:
          "ეს საოცარი იყო, მე და ჩემს მეგობრებს გერმანიაში შესანიშნავი სამუშაო მივიღეთ. Lazari Ways-მა ყველაფერი გააკეთა მარტივი და სტრესის გარეშე.",
        instagram: "@nino.katamadze",
        image: "/images/reviewers/reviewer-1.webp",
      },
    ],
  },
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: Locale; serviceId: Services }>;
}) {
  const { lang, serviceId } = await params;

  const translations = await getTranslations(lang, "services-detail");

  const serviceData = servicesData[serviceId];

  if (!serviceData) {
    return notFound();
  }

  return <ServicesClientPage translations={translations} data={serviceData} />;
}

import { notFound } from "next/navigation";
import { VacanciesClientPage } from "./page.client";
import { getTranslations } from "@/i18n/translations";
import { Locale } from "@/i18n";
import { Vacancy } from "@/utils/models/vacancy";

const vacancyImageUrl = (filename: string) => `/images/vacancies/${filename}`;

const vacanciesData: Record<string, Vacancy> = {
  hotels: {
    title: "სასტუმროები",
    description:
      "იპოვეთ საინტერესო სამუშაო შესაძლებლობები გერმანიაში სასტუმროში კონკურენტული ანაზღაურებით 12.85€-დან 13.50€-მდე საათში.",
    priceInEuro: [12.85, 13.5],
    requirements: [
      "გერმანული ენის ბაზისური ცოდნა",
      "მომხმარებელთა მომსახურების გამოცდილება",
      "მოქნილობა შიფთების მიხედვით",
    ],
    benefits: [
      "კონკურენტული საათობრივი ანაზღაურება",
      "საცხოვრებლის დახმარება",
      "კარიერული ზრდის შესაძლებლობა",
    ],

    employmentType: "full-time",
    imageUrl: vacancyImageUrl("hotels.webp"),
  },
  bakery: {
    title: "საცხობები",
    description:
      "გამოცდილება საცხობში მუშაობისას გერმანიაში ანაზღაურებით 12.50€-დან 14.00€-მდე საათში.",
    priceInEuro: [12.5, 14.0],
    requirements: [
      "ადრე დილით მუშაობის მზადყოფნა",
      "კვების მომზადების საბაზისო უნარები",
      "გუნდური მუშაობის უნარი",
    ],
    benefits: [
      "შესანიშნავი ანაზღაურება",
      "ტრენინგის პროგრამები",
      "მეგობრული გუნდი",
    ],

    employmentType: "full-time",
    imageUrl: vacancyImageUrl("hotels.webp"),
  },
  restaurant: {
    title: "რესტორნები",
    description:
      "რესტორნების მრავალფეროვანი შესაძლებლობები გერმანიაში ანაზღაურებით 12.50€-დან 13.50€-მდე საათში.",
    priceInEuro: [12.5, 13.5],
    requirements: [
      "გუნდური მუშაობის უნარი",
      "სწრაფი ტემპით მუშაობა",
      "გერმანული ენის საბაზისო ცოდნა",
    ],
    benefits: ["საკვების ფასდაკლება", "მოქნილი გრაფიკი", "კარიერული წინსვლა"],

    employmentType: "full-time",
    imageUrl: vacancyImageUrl("hotels.webp"),
  },
  mcdonalds: {
    title: "McDonald's",
    description:
      "შემოუერთდით McDonald's-ის გუნდს გერმანიაში ანაზღაურებით 12.50€-დან 12.80€-მდე საათში.",
    priceInEuro: [12.5, 12.8],
    requirements: [
      "მომხმარებელთა მომსახურების უნარები",
      "სწრაფი სწავლის უნარი",
      "გუნდური მუშაობა",
    ],
    benefits: [
      "საკვების უფასო კვება",
      "ტრენინგი და სერტიფიკატები",
      "კარიერული ზრდა",
    ],
    employmentType: "full-time",
    imageUrl: vacancyImageUrl("hotels.webp"),
  },
  cafe: {
    title: "კაფეები",
    description:
      "კაფეებში შესაძლებლობები გერმანიაში ანაზღაურებით 12.50€-დან 14.00€-მდე საათში.",
    priceInEuro: [12.5, 14.0],
    requirements: [
      "ბარისტის უნარები (სასურველი)",
      "მომხმარებელთა მომსახურება",
      "გერმანული ენის საბაზისო ცოდნა",
    ],
    benefits: ["კეთილი სამუშაო გარემო", "ბონუსები და პრემიები", "ტრენინგი"],
    employmentType: "full-time",
    imageUrl: vacancyImageUrl("hotels.webp"),
  },
  gasStation: {
    title: "ავტოგასამართი სადგურები",
    description:
      "ავტოგასამართ სადგურებზე მუშაობა გერმანიაში ანაზღაურებით 12.50€-დან 14.00€-მდე საათში.",
    priceInEuro: [12.5, 14.0],
    requirements: [
      "მოქნილობა სამუშაო საათებში",
      "კასის გამოცდილება",
      "საბაზისო გერმანული ენა",
    ],
    benefits: ["ღამის ზედნადები", "ჯანდაცვის დაზღვევა", "სტაბილური შემოსავალი"],

    employmentType: "full-time",
    imageUrl: vacancyImageUrl("hotels.webp"),
  },
  restStop: {
    title: "გზის კაფეები (Raststätte)",
    description:
      "მუშაობა გზის კაფეებში გერმანიაში ანაზღაურებით 12.00€-დან 14.00€-მდე საათში.",
    priceInEuro: [12.0, 14.0],
    requirements: [
      "მომხმარებელთა მომსახურება",
      "მოქნილობა სამუშაო დროში",
      "გერმანული ენის საბაზისო ცოდნა",
    ],
    benefits: [
      "საცხოვრებლის შესაძლებლობა",
      "სტაბილური შემოსავალი",
      "ტრანსპორტის კომპენსაცია",
    ],

    employmentType: "full-time",
    imageUrl: vacancyImageUrl("hotels.webp"),
  },
  factory: {
    title: "ქარხნები",
    description:
      "ქარხნებში მუშაობა გერმანიაში ანაზღაურებით 13.50€-დან 16.00€-მდე საათში.",
    priceInEuro: [13.5, 16.0],
    requirements: [
      "ტექნიკური უნარები",
      "ფიზიკური გამძლეობა",
      "სამუშაო უსაფრთხოების წესების ცოდნა",
    ],
    benefits: [
      "მაღალი ანაზღაურება",
      "ზეგანაკვეთური ანაზღაურება",
      "სტაბილური დასაქმება",
    ],

    employmentType: "full-time",
    imageUrl: vacancyImageUrl("hotels.webp"),
  },
  warehouse: {
    title: "საწყობები (Lager)",
    description:
      "საწყობებში მუშაობა გერმანიაში ანაზღაურებით 12.50€-დან 14.00€-მდე საათში.",
    priceInEuro: [12.5, 14.0],
    requirements: [
      "ფიზიკური გამძლეობა",
      "ყურადღება დეტალებზე",
      "საწყობის მართვის უნარები",
    ],
    benefits: [
      "კონკურენტული ანაზღაურება",
      "შიფთების ზედნადები",
      "კარიერული ზრდა",
    ],

    employmentType: "full-time",
    imageUrl: vacancyImageUrl("hotels.webp"),
  },
  childrenAnimator: {
    title: "ბავშვთა ანიმატორი",
    description:
      "ბავშვთა ანიმატორის როლი გერმანიაში ანაზღაურებით 12.00€-დან 14.00€-მდე საათში.",
    priceInEuro: [12.0, 14.0],
    requirements: [
      "გამოცდილება ბავშვებთან მუშაობაში",
      "კრეატიულობა და ენერგიულობა",
      "გერმანული ენის ცოდნა",
    ],
    benefits: ["საინტერესო სამუშაო", "მეგობრული გარემო", "მოქნილი გრაფიკი"],

    employmentType: "part-time",
    imageUrl: vacancyImageUrl("hotels.webp"),
  },
  kindergartenAssistant: {
    title: "საბავშვო ბაღის თანაშემწე",
    description:
      "საბავშვო ბაღში მუშაობა გერმანიაში ანაზღაურებით 12.50€-დან 14.00€-მდე საათში.",
    priceInEuro: [12.5, 14.0],
    requirements: [
      "გამოცდილება ბავშვებთან მუშაობაში",
      "პედაგოგიური უნარები",
      "გერმანული ენის კარგი ცოდნა",
    ],
    benefits: [
      "სტაბილური დასაქმება",
      "პროფესიული განვითარება",
      "ჯანდაცვის დაზღვევა",
    ],

    employmentType: "full-time",
    imageUrl: vacancyImageUrl("hotels.webp"),
  },
} as const;

type VacanciesKey = keyof typeof vacanciesData;

export default async function VacanciesDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; vacancyId: VacanciesKey }>;
}) {
  const { lang, vacancyId } = await params;

  const translations = await getTranslations(lang, "services-detail");

  const data = vacanciesData[vacancyId];

  if (!data) {
    return notFound();
  }

  return <VacanciesClientPage translations={translations} data={data} />;
}

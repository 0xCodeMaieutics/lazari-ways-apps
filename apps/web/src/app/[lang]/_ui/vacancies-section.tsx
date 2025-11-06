import { scrollSmoothlyToSection, SECTION_IDS } from "@/app/[lang]/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Euro, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { EmploymentType, Vacancy } from "@/utils/models/vacancy";

const vacancyImageUrl = (filename: string) => `/images/vacancies/${filename}`;

const vacancies: Record<string, Vacancy> = {
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

type VacanciesKey = keyof typeof vacancies;

const employmentTypeLabels: Record<EmploymentType, string> = {
  "full-time": "სრული განაკვეთი",
  "part-time": "ნახევარი განაკვეთი",
  temporary: "დროებითი",
  internship: "სტაჟირება",
};

const VacancyCard = ({
  vacancy,
  id,
}: {
  vacancy: Vacancy;
  id: VacanciesKey;
}) => {
  return (
    <Card className="group h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden pt-0">
      {vacancy.imageUrl && (
        <div className="relative w-full h-[300px] overflow-hidden">
          <Image
            src={vacancy.imageUrl}
            alt={vacancy.title}
            fill={true}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <CardHeader className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start md:justify-between gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl transition-colors">
              {vacancy.title}
            </CardTitle>
          </div>
          <span className="max-w-max shrink-0 px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md">
            {employmentTypeLabels[vacancy.employmentType]}
          </span>
        </div>
        {/* Salary Info */}
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
          <Euro className="h-5 w-5 text-primary shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">ანაზღაურება</p>
            <p className="font-semibold text-lg">
              {vacancy.priceInEuro[0].toFixed(2)}€ -{" "}
              {vacancy.priceInEuro[1].toFixed(2)}€/სთ
            </p>
          </div>
        </div>

        <CardDescription className="text-base leading-relaxed">
          {vacancy.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Button
            className="max-w-xs mx-auto text-lg font-semibold h-12 cursor-pointer"
            size={"lg"}
            variant={"link"}
            asChild
          >
            <Link href={`/vacancies/${id}`}>
              დეტალურად
              <div className="border border-primary rounded-full p-1 animate-bounce-left ml-1">
                <ArrowRight className="size-4" />
              </div>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const VacancySection = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeader
        onClick={() => {
          scrollSmoothlyToSection(SECTION_IDS.vacancies);
        }}
      >
        ვაკანსიები
      </SectionHeader>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(vacancies).map(([id, vacancy], index) => (
          <VacancyCard key={index} vacancy={vacancy} id={id} />
        ))}
      </div>
    </div>
  );
};

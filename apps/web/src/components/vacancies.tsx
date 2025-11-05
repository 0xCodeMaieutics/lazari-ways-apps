import { scrollSmoothlyToSection, SECTION_IDS } from "@/app/[lang]/utils";
import { SectionHeader } from "./section-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  MapPin,
  Euro,
  Clock,
  Building2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

/**
 * Vacancy Data:
 * - title
 * - description
 * - priceInEuro (number range)
 * - requirements (list)
 * - benefits (list)
 * - location
 * - company
 * - employmentType (full-time, part-time, temporary, internship)
 */

type EmploymentType = "full-time" | "part-time" | "temporary" | "internship";

interface Vacancy {
  title: string;
  description: string;
  priceInEuro: [number, number];
  requirements: string[];
  benefits: string[];
  location: string;
  company: string;
  employmentType: EmploymentType;
  icon?: string;
}

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
    location: "გერმანიის სხვადასხვა ქალაქი",
    company: "Lazari Ways GmbH",
    employmentType: "full-time",
    icon: "🏨",
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
    location: "გერმანიის სხვადასხვა ქალაქი",
    company: "Lazari Ways GmbH",
    employmentType: "full-time",
    icon: "🥖",
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
    location: "გერმანიის სხვადასხვა ქალაქი",
    company: "Lazari Ways GmbH",
    employmentType: "full-time",
    icon: "🍽️",
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
    location: "გერმანიის სხვადასხვა ქალაქი",
    company: "Lazari Ways GmbH",
    employmentType: "full-time",
    icon: "🍔",
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
    location: "გერმანიის სხვადასხვა ქალაქი",
    company: "Lazari Ways GmbH",
    employmentType: "full-time",
    icon: "☕",
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
    location: "გერმანიის სხვადასხვა ქალაქი",
    company: "Lazari Ways GmbH",
    employmentType: "full-time",
    icon: "⛽",
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
    location: "გერმანიის სხვადასხვა ქალაქი",
    company: "Lazari Ways GmbH",
    employmentType: "full-time",
    icon: "🛣️",
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
    location: "გერმანიის სხვადასხვა ქალაქი",
    company: "Lazari Ways GmbH",
    employmentType: "full-time",
    icon: "🏭",
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
    location: "გერმანიის სხვადასხვა ქალაქი",
    company: "Lazari Ways GmbH",
    employmentType: "full-time",
    icon: "📦",
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
    location: "გერმანიის სხვადასხვა ქალაქი",
    company: "Lazari Ways GmbH",
    employmentType: "part-time",
    icon: "🎨",
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
    location: "გერმანიის სხვადასხვა ქალაქი",
    company: "Lazari Ways GmbH",
    employmentType: "full-time",
    icon: "👶",
  },
} as const;

const employmentTypeLabels: Record<EmploymentType, string> = {
  "full-time": "სრული განაკვეთი",
  "part-time": "ნახევარი განაკვეთი",
  temporary: "დროებითი",
  internship: "სტაჟირება",
};

const VacancyCard = ({ vacancy }: { vacancy: Vacancy }) => {
  return (
    <Card className="group h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {vacancy.icon && (
              <span className="text-3xl" aria-hidden="true">
                {vacancy.icon}
              </span>
            )}
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {vacancy.title}
            </CardTitle>
          </div>
          <span className="shrink-0 px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md">
            {employmentTypeLabels[vacancy.employmentType]}
          </span>
        </div>
        <CardDescription className="text-base leading-relaxed">
          {vacancy.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
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

        {/* Location */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">{vacancy.location}</span>
        </div>

        {/* Company */}
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">{vacancy.company}</span>
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm">მოთხოვნები</h4>
          </div>
          <ul className="space-y-1.5 ml-6">
            {vacancy.requirements.slice(0, 3).map((req, idx) => (
              <li
                key={idx}
                className="text-sm text-muted-foreground flex gap-2"
              >
                <span className="text-primary mt-1">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-sm">უპირატესობები</h4>
          </div>
          <ul className="space-y-1.5 ml-6">
            {vacancy.benefits.slice(0, 3).map((benefit, idx) => (
              <li
                key={idx}
                className="text-sm text-muted-foreground flex gap-2"
              >
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Apply Button */}
        <Button className="w-full" variant="default">
          განაცხადის გაკეთება
        </Button>
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

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(vacancies).map((vacancy, index) => (
          <VacancyCard key={index} vacancy={vacancy} />
        ))}
      </div>
    </div>
  );
};

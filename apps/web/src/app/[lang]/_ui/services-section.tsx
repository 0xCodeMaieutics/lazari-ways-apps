import { SectionHeader } from "@/components/section-header";
import { scrollSmoothlyToSection, SECTION_IDS } from "../utils";
import Image from "next/image";
import Link from "next/link";
import { Services } from "@/utils/models/service";
import { Button } from "@workspace/ui/components/button";
import { ArrowRight, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

const services = {
  student: {
    title: "სტუდენტური დასაქმება",
    description:
      "ჩვენ ვაკავშირებთ კვალიფიციურ პროფესიონალებს დამოწმებულ დამსაქმებლებთან სხვადასხვა ინდუსტრიასა და ქვეყანაში.",
    durationInMonths: 3,
  },
  employer: {
    title: "არასტუდენტური დასაქმება",
    description:
      "არასტუდენტი აპლიკანტებისთვის, რომლებიც საერთაშორისო დასაქმების შესაძლებლობებს ეძებენ, მორგებული დასაქმების სერვისები.",
    durationInMonths: 6,
  },

  ausbildung: {
    title: "ტრენინგი (Ausbildung)",
    description: "ჩვენ გაწვდით დახმარებას ტრენინგის ადგილების ძიებაში.",
    durationInMonths: 3,
  },
  fsj: {
    title: "FSJ",
    description: "ჩვენ გაწვდით დახმარებას FSJ-შესაძლებლობების ძიებაში.",
    durationInMonths: 6,
  },
  fachkraft: {
    title: "სპეციალისტი (Fachkraft)",
    description:
      "გერმანიაში დასაქმების მაძიებელი კვალიფიციური მუშაკების ყოვლისმომცველი მხარდაჭერა, მათ შორის სამუშაოს შესაბამისობისა და ვიზის მიღებაში დახმარება.",
    durationInMonths: 6,
  },
} as const;

type ServiceKey = keyof typeof services;
type Service = (typeof services)[ServiceKey];

const ServiceCard = ({
  type,
  service,
}: {
  type: Services;
  service: Service;
}) => (
  <Card className="group rounded-lg overflow-hidden rounded-lg border pt-0">
    <div className="relative w-full h-[350px] overflow-hidden border">
      <Image
        // FIXME: change to proper images per service type when available
        src={`/images/services/student.webp`}
        alt={service.title}
        fill={true}
        sizes="382x348"
        className="object-cover group-hover:scale-105 transition-transform duration-150"
      />
    </div>
    <CardHeader className="space-y-6 py-6 px-6">
      <div className="flex items-center justify-between gap-2">
        <CardTitle className="flex-1 text-xl font-semibold max-w-xs">
          {service.title}
        </CardTitle>
        {/* Price in euro */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
          <Clock className="size-4" />
          <span className="font-semibold">{service.durationInMonths} თვე</span>
        </div>
      </div>
      <CardDescription className="text-lg text-muted-foreground">
        {service.description}
      </CardDescription>
    </CardHeader>

    <CardContent className="flex-1 flex flex-col justify-end space-y-6">
      <div className="flex justify-center">
        <Button
          className="max-w-xs mx-auto text-lg font-semibold h-12 cursor-pointer"
          size={"lg"}
          variant={"link"}
          asChild
        >
          <Link href={`/services/${type}`}>
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

export const ServicesSection = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        onClick={() => {
          scrollSmoothlyToSection(SECTION_IDS.services);
        }}
      >
        ჩვენი სერვისები
      </SectionHeader>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(services).map(([type, service]) => (
          <ServiceCard
            key={service.title}
            service={service}
            type={type as Services}
          />
        ))}
      </div>
    </div>
  );
};

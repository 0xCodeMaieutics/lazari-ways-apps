import { SectionHeader } from "@/components/section-header";
import { scrollSmoothlyToSection, SECTION_IDS } from "../utils";
import Image from "next/image";
import Link from "next/link";
import { Services } from "@/utils/models/service";
import { Button } from "@workspace/ui/components/button";
import { ArrowRight } from "lucide-react";

const services: Record<
  Services,
  {
    title: string;
    description: string;
  }
> = {
  student: {
    title: "სტუდენტური დასაქმება",
    description:
      "ჩვენ ვაკავშირებთ კვალიფიციურ პროფესიონალებს დამოწმებულ დამსაქმებლებთან სხვადასხვა ინდუსტრიასა და ქვეყანაში.",
  },
  employer: {
    title: "არასტუდენტური დასაქმება",
    description:
      "არასტუდენტი აპლიკანტებისთვის, რომლებიც საერთაშორისო დასაქმების შესაძლებლობებს ეძებენ, მორგებული დასაქმების სერვისები.",
  },

  ausbildung: {
    title: "ტრენინგი (Ausbildung)",
    description: "ჩვენ გაწვდით დახმარებას ტრენინგის ადგილების ძიებაში.",
  },
  fsj: {
    title: "FSJ",
    description: "ჩვენ გაწვდით დახმარებას FSJ-შესაძლებლობების ძიებაში.",
  },
  fachkraft: {
    title: "სპეციალისტი (Fachkraft)",
    description:
      "გერმანიაში დასაქმების მაძიებელი კვალიფიციური მუშაკების ყოვლისმომცველი მხარდაჭერა, მათ შორის სამუშაოს შესაბამისობისა და ვიზის მიღებაში დახმარება.",
  },
};

const ServiceCard = ({
  title,
  description,
  type,
}: {
  title: string;
  description: string;
  type: Services;
}) => (
  <div className="relative group sm:h-[670px] rounded-lg overflow-hidden rounded-lg border">
    <div className="relative w-full h-[350px] overflow-hidden border">
      <Image
        // FIXME: change to proper images per service type when available
        src={`/images/services/student.webp`}
        alt={title}
        fill={true}
        sizes="382x348"
        className="object-cover group-hover:scale-105 transition-transform duration-150"
      />
    </div>
    <div className="space-y-1 py-6 px-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-lg text-muted-foreground">{description}</p>
    </div>
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full flex justify-center">
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
  </div>
);

export const ServicesSection = () => {
  return (
    <div className="max-w-6xl mx-auto">
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
            title={service.title}
            description={service.description}
            type={type as Services}
          />
        ))}
      </div>
    </div>
  );
};

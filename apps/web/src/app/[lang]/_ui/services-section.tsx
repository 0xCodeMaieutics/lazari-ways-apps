import { SectionHeader } from "@/components/section-header";
import { scrollSmoothlyToSection, SECTION_IDS } from "../utils";
import Image from "next/image";
import Link from "next/link";
import { Services } from "@/utils/models/service";

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
}) => {
  return (
    <Link href={`services/${type}`}>
      <div className="group sm:h-[600px] rounded-lg overflow-hidden rounded-lg cursor-pointer border">
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
        <div className="space-y-1 pt-6 px-6">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  );
};

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
      {/**
       * Service card information:
       * 1. title
       * 2. description
       * 3. picture
       *
       * Services list:
       * 1. For Students - We connect skilled professionals with verified employers across various industries and countries.
       * 2. For Non-student - Tailored job placement services for non-student applicants seeking international employment opportunities.
       * 3. Ausbildung - Specialized recruitment for vocational training positions in Germany, connecting candidates with reputable companies.
       * 4. FSJ - Facilitating placements in voluntary social year programs in Germany for personal and professional growth.
       * 5. Fachkraft - Comprehensive support for skilled workers seeking employment in Germany, including job matching and visa assistance.
       */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

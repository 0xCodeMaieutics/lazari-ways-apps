import { ServicePageData, Services } from "@/utils/models/service";
import { notFound } from "next/navigation";
import { ServicesClientPage } from "./page.client";

// @ts-nocheck asdf
const servicesData: Record<Services, ServicePageData> = {
  student: {
    title: "Student Employment",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos numquam est, delectus corrupti architecto deserunt reprehenderit eum molestiae adipisci praesentium veniam dolor, alias nostrum rem sit consectetur corporis ex nesciunt. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit nam atque at rerum, distinctio nobis est soluta et doloremque ab explicabo libero omnis! Minus, est quas dicta aliquid nam voluptatem.",
    picture: "/images/services/student.webp",
    // List
    priceInEuro: 500,
    beginningDate: "2026-01-01",
    durationInMonths: 3,
    requirements: [
      "Must be enrolled in a university",
      "Basic German language skills",
      "Basic German language skills",
      "Basic German language skills",
    ],
    included: [
      "Job matching",
      "Resume review",
      "Interview preparation",
      "Interview preparation",
      "Interview preparation",
      "Interview preparation",
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
        name: "Giorgi",
        rating: 5,
        review:
          "This was amazing This was amazing This was amazing This was amazing This was amazing",
      },
    ],
  },
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string; serviceId: Services }>;
}) {
  const { lang, serviceId } = await params;

  const serviceData = servicesData[serviceId];

  if (!serviceData) {
    return notFound();
  }

  return <ServicesClientPage data={serviceData} />;
}

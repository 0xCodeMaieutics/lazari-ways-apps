"use client";
import Image from "next/image";
import clsx from "clsx";
import { Button } from "@workspace/ui/components/button";
import { scrollSmoothlyToSection, SECTION_IDS } from "../../utils";
import {
  ArrowDown,
  CheckCircle2,
  Clock,
  Euro,
  Calendar,
  Package,
  Star,
  User,
  ExternalLink,
  Instagram,
  ArrowLeft,
} from "lucide-react";
import { ServicePageData } from "@/utils/models/service";
import { SectionHeader } from "@/components/section-header";
import { formatDistanceToNow } from "date-fns";

import { ka } from "date-fns/locale"; // Georgian locale
import { Translations } from "@/i18n/translations";
import { translationsContext } from "@/lib/context/translations";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card";
import { ContactVideo } from "@/components/contact-video";
import { useParams } from "next/navigation";

export const ServicesClientPage = ({
  data,
  translations,
}: {
  data: ServicePageData;
  translations: Translations;
}) => {
  const { lang } = useParams();
  return (
    <translationsContext.Provider value={{ translations }}>
      <main className="min-h-screen w-full">
        {/* Hero Section */}
        <section className="px-6 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="py-5">
              <Button
                size={"lg"}
                asChild
                variant={"link"}
                className="flex items-center gap-2 h-12 text-xl font-semibold max-w-max mr-auto"
              >
                <Link href={`/${lang}#services`}>
                  <ArrowLeft />
                  დაბრუნება
                </Link>
              </Button>
            </div>

            <div className="flex flex-col gap-12 lg:gap-20 md:flex-row md:items-center">
              <div className="text-center md:text-left flex-1 space-y-6">
                <div className="tracking-tight space-y-3">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                    {data.title}
                  </h1>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                      <Clock className="size-4" />
                      <span className="font-semibold">
                        {data.durationInMonths} თვე
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                      <Euro className="size-4" />
                      <span className="font-semibold">{data.priceInEuro}</span>
                    </div>
                    {data.beginningDate && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                        <Calendar className="size-4" />
                        <span className="font-semibold">
                          დაწყება{" "}
                          {formatDistanceToNow(new Date(data.beginningDate), {
                            addSuffix: true,
                            locale: ka,
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {data.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Button
                    size="lg"
                    className="flex gap-2 items-center text-lg font-semibold h-12 px-8"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollSmoothlyToSection(SECTION_IDS.requirements);
                    }}
                  >
                    მოთხოვნების ნახვა
                    <ArrowDown className="animate-bounce size-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex gap-2 items-center text-lg font-semibold h-12 px-8"
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Add contact/application link
                    }}
                  >
                    შეავსეთ ფორმა
                    <ExternalLink />
                  </Button>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div
                  className={clsx(
                    "group mx-auto relative w-[320px] h-[400px] lg:w-[450px] lg:h-[550px] overflow-hidden rounded-2xl shadow-2xl border"
                  )}
                >
                  <Image
                    src={data.picture}
                    alt={data.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Requirements Section */}
        <section id={SECTION_IDS.requirements} className="px-6 py-10">
          <div className="md:py-16 max-w-7xl mx-auto">
            <SectionHeader
              onClick={() => scrollSmoothlyToSection(SECTION_IDS.requirements)}
            >
              მოთხოვნები
            </SectionHeader>
            <div className="grid md:grid-cols-2 gap-4">
              {data.requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-background border hover:shadow-md transition-shadow"
                >
                  <CheckCircle2 className="size-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-base md:text-lg text-foreground">{req}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* What's Included Section */}
        <section className="px-6 py-10">
          <div className="md:py-16 max-w-7xl mx-auto">
            <SectionHeader>რას მიიღებთ?</SectionHeader>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.included.map((item, index) => (
                <div
                  key={index}
                  className="group relative p-4 rounded-xl border bg-card hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Package className="size-5 text-primary" />
                    </div>
                    <p className="text-base md:text-lg text-card-foreground leading-relaxed">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Photos Gallery Section */}
        {data.photos && data.photos.length > 0 && (
          <section className="px-6 py-10">
            <div className="max-w-7xl mx-auto py-10 md:py-16 rounded-xl">
              <SectionHeader>ჩვენი კლიენტების ფოტოები</SectionHeader>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
                  >
                    <Image
                      src={photo}
                      alt={`${data.title} photo ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* Reviews Section */}
        {data.reviews && data.reviews.length > 0 && (
          <section className="px-6 py-10 md:py-16 max-w-7xl mx-auto">
            <div className="space-y-8">
              <SectionHeader>რას ამბობენ ჩვენი კლიენტები</SectionHeader>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow space-y-4"
                  >
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={clsx(
                            "size-5",
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed italic">
                      &quot;{review.review}&quot;
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <div className="relative size-8 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                          {review.image ? (
                            <Image
                              src={review.image}
                              alt={review.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <User className="size-4 text-primary" />
                          )}
                        </div>
                        <span className="font-semibold text-sm">
                          {review.name}
                        </span>
                      </div>
                      {review.instagram && (
                        <a
                          href={`https://instagram.com/${review.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full hover:bg-primary/10 transition-colors group"
                          aria-label={`Visit ${review.name}'s Instagram`}
                        >
                          <Instagram className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* CTA Section */}
        <section className="w-full px-6 py-16 md:py-24 bg-secondary mt-8 md:mt-16">
          <Card className="max-w-7xl mx-auto text-center shadow-lg pb-0 pt-0">
            <div className="flex flex-col lg:flex-row p-8 md:p-16">
              <div className="flex-1 flex flex-col justify-center">
                <CardHeader className="text-center space-y-4 p-8 md:p-12">
                  <CardTitle className="text-3xl md:text-4xl font-bold">
                    მზად ხართ დასაწყებად?
                  </CardTitle>
                  <CardDescription className="text-lg max-w-2xl mx-auto">
                    გადადგით პირველი ნაბიჯი თქვენი კარიერული გზისკენ. განაცხადი
                    შეავსეთ ახლავე და ჩვენი გუნდი მალე დაგიკავშირდებათ.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8 md:pb-12">
                  <Button
                    size="lg"
                    className="text-lg font-semibold h-12 px-10"
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Add application form link
                    }}
                  >
                    განაცხადის გაგზავნა
                    <ExternalLink />
                  </Button>
                </CardContent>
              </div>
              <ContactVideo />
            </div>
          </Card>
        </section>
      </main>
    </translationsContext.Provider>
  );
};

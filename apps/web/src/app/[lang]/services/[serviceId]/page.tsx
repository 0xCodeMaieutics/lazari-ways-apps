import { ServicePageData, Services } from "@/utils/models/service";
import { notFound } from "next/navigation";
import { ServicesClientPage } from "./page.client";
import { getTranslations } from "@/i18n/translations";
import { Locale } from "@/i18n";

const reviewerImage = ({ name, type }: { name: string; type: Services }) =>
  `/images/services/reviewers/${type}/${name}.webp`;

const pictureImage = (type: string) => `/images/services/${type}.webp`;

// @ts-nocheck asdf
const servicesData: Record<Services, ServicePageData> = {
  student: {
    title: "სტუდენტური დასაქმება",
    description:
      "ბევრი ირჩევს გერმანიას სამუშაოდ წასასვლელად მაღალი ხელფასის, ქვეყნის სწრაფი განვითარების, გერმანელების კეთილგანწყობისა და საქართველოსთან სიახლოვის გამო. ჩვენ გვყავს 550-ზე მეტი სანდო დამსაქმებელი, ამიტომ ყველასთვის გამოჩნდება სამუშაო. ვასაქმებთ სტუდენტებს (ზაფხულში, არდადეგების პერიოდში ZAV-ის პროგრამით ან ფასიანი სტაჟირების ფარგლებში), ასევე 18-55 წლის პირებს 3 თვით ან მეტი ვადით. გერმანიაში სამუშაოდ წასასვლელად არ არის აუცილებელი უცხო ენის ცოდნა. ხელფასი თვეში 1200-დან 3000 ევრომდე მერყეობს.",
    picture: pictureImage("student"),
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
        image: reviewerImage({ name: "reviewer-1", type: "student" }),
      },
      {
        name: "ნინო ქათამაძე",
        rating: 5,
        review:
          "ეს საოცარი იყო, მე და ჩემს მეგობრებს გერმანიაში შესანიშნავი სამუშაო მივიღეთ. Lazari Ways-მა ყველაფერი გააკეთა მარტივი და სტრესის გარეშე.",
        instagram: "@nino.katamadze",
        image: reviewerImage({ name: "reviewer-1", type: "student" }),
      },
    ],
  },
  ausbildung: {
    title: "აუდიზბილდუნგი - პროფესიული განათლება",
    description:
      "აუდიზბილდუნგი არის პროფესიული განათლების სისტემა გერმანიაში, რომელიც საშუალებას აძლევს ახალგაზრდებს მიიღონ პრაქტიკული და თეორიული ცოდნა კონკრეტულ პროფესიებში. ეს პროგრამა მოიცავს როგორც სასწავლო კურსებს, ასევე პრაქტიკულ სამუშაო გამოცდილებას კომპანიებში. აუდიზბილდუნგი გრძელდება ჩვეულებრივ 2-3 წელი და უზრუნველყოფს სტუდენტებს უნარებითა და ცოდნით, რომლებიც საჭიროა წარმატებული კარიერის დასაწყებად გერმანიის შრომის ბაზარზე.",
    picture: pictureImage("ausbildung"),
    // List
    priceInEuro: 800,
    durationInMonths: 24,
    requirements: [
      "საშუალო განათლება (Realschulabschluss ან შესაბამისი)",
      "გერმანული ენის კარგი ცოდნა (B2 დონე ან მეტი)",
      "მოტივაცია და ინტერესები არჩეულ პროფესიაში",
    ],
    included: [
      "სასწავლო კურსების ორგანიზება",
      "პრაქტიკული ტრენინგი სანდო კომპანიებში",
      "საბუთების მომზადება და კონსულტაციები",
      "მენეჯერის მხარდაჭერა მთელი პროგრამის განმავლობაში",
    ],
    reviews: [
      {
        name: "მარიამ ბერიძე",
        rating: 5,
        review:
          "აუდიზბილდუნგის პროგრამა Lazari Ways-თან ერთად იყო ჩემი ცხოვრების საუკეთესო გადაწყვეტილება. მე მივიღე შესანიშნავი განათლება და პრაქტიკული გამოცდილება, რაც დამეხმარა კარიერის დაწყებაში.",
        instagram: "@mariam.beridze",
        image: reviewerImage({ name: "reviewer-1", type: "ausbildung" }),
      },
    ],
  },
  employer: {
    title: "დამსაქმებლის მომსახურება",
    description:
      "ჩვენი დამსაქმებლის მომსახურება მიზნად ისახავს კომპანიებს დაეხმაროს საერთაშორისო თანამშრომლების მოძიებასა და დასაქმებაში. ჩვენ ვთავაზობთ სრულ სერვისს, რომელიც მოიცავს კანდიდატების შერჩევას, გასაუბრებებს, ვიზების პროცესის მხარდაჭერას და ინტეგრაციის დახმარებას. ჩვენი მიზანია უზრუნველვყოთ, რომ დამსაქმებლები მიიღებენ მაღალკვალიფიციურ და მოტივირებულ თანამშრომლებს, რომლებიც შეესაბამებიან მათი კომპანიის საჭიროებებს და კულტურას.",
    picture: pictureImage("employer"),
    // List
    priceInEuro: 1000,
    durationInMonths: 6,
    requirements: [
      "კომპანიის რეგისტრაცია გერმანიაში",
      "დამსაქმებლის საჭიროებების განსაზღვრა",
      "თანამშრომლების რაოდენობა და პროფილი",
    ],
    included: [
      "კანდიდატების შერჩევა და გასაუბრებები",
      "ვიზების და საბუთების პროცედურების მხარდაჭერა",
      "ინტეგრაციის და ადაპტაციის დახმარება",
      "მენეჯერის კონსულტაციები და მხარდაჭერა",
    ],
    reviews: [
      {
        name: "გიორგი მჭედლიშვილი",
        rating: 5,
        review:
          "Lazari Ways-ის დამსაქმებლის მომსახურებამ მნიშვნელოვნად გაამარტივა ჩვენი საერთაშორისო თანამშრომლების დაქირავების პროცესი. მათი პროფესიონალიზმი და მხარდაჭერა იყო შეუფასებელი.",
        instagram: "@giorgi.mchedlishvili",
        image: reviewerImage({ name: "reviewer-1", type: "employer" }),
      },
    ],
  },
  fsj: {
    title: "FSJ - სოციალური წლიური სამსახური",
    description:
      "FSJ (Freiwilliges Soziales Jahr) არის სოციალური წლიური სამსახურის პროგრამა გერმანიაში, რომელიც საშუალებას აძლევს ახალგაზრდებს მიიღონ პრაქტიკული გამოცდილება სოციალური სფეროში. ეს პროგრამა მოიცავს მოხალისეობრივ მუშაობას სხვადასხვა ორგანიზაციებში, როგორიცაა ბავშვთა სახლები, მოხუცთა თავშესაფრები და სხვა სოციალური დაწესებულებები. FSJ გრძელდება ჩვეულებრივ 12 თვე და უზრუნველყოფს ახალგაზრდებს უნარებითა და ცოდნით, რომლებიც საჭიროა სოციალური სფეროში კარიერის დასაწყებად.",
    picture: pictureImage("fsj"),
    // List
    priceInEuro: 300,
    durationInMonths: 12,
    requirements: [
      "18-დან 27 წლამდე ასაკის",
      "გერმანული ენის საბაზისო ცოდნა",
      "ინტერსი სოციალური სფეროს მიმართ",
    ],
    included: [
      "სოციალური დაწესებულების შერჩევა",
      "საბუთების მომზადება და კონსულტაციები",
      "მენეჯერის მხარდაჭერა მთელი პროგრამის განმავლობაში",
      "ტრანსპორტის ორგანიზება",
    ],
    reviews: [
      {
        name: "ეკა ჯანელიძე",
        rating: 5,
        review:
          "FSJ პროგრამა Lazari Ways-თან ერთად იყო ჩემი ცხოვრების ყველაზე მნიშვნელოვანი გამოცდილება. მე შევიძინე უნარები და მეგობრები, რომლებიც სამუდამოდ დამრჩება.",
        instagram: "@eka.janelidze",
        image: reviewerImage({ name: "reviewer-1", type: "fsj" }),
      },
    ],
  },
  fachkraft: {
    title: "ფახკრაფტი - კვალიფიციური მუშაკი",
    description:
      "ფახკრაფტი არის პროგრამა გერმანიაში კვალიფიციური მუშაკებისთვის, რომელიც მიზნად ისახავს უცხოელი პროფესიონალების დასაქმებას სხვადასხვა სფეროში. ეს პროგრამა მოიცავს სამუშაოს მოძიებას, ვიზების პროცესის მხარდაჭერას და ინტეგრაციის დახმარებას. ფახკრაფტი უზრუნველყოფს, რომ კვალიფიციური მუშაკები მიიღებენ შესაბამის სამუშაოს, რომელიც შეესაბამება მათ უნარებსა და გამოცდილებას, და ხელს უწყობს მათი წარმატებულ ინტეგრაციას გერმანიის შრომის ბაზარზე.",
    picture: pictureImage("fachkraft"),
    // List
    priceInEuro: 1200,
    durationInMonths: 12,
    requirements: [
      "შესაბამისი პროფესიული კვალიფიკაცია",
      "გერმანული ან ინგლისური ენის კარგი ცოდნა",
      "მოტივაცია და პროფესიული გამოცდილება არჩეულ სფეროში",
    ],
    included: [
      "სამუშაოს მოძიება და რეკომენდაციები",
      "ვიზების და საბუთების პროცედურების მხარდაჭერა",
      "ინტეგრაციის და ადაპტაციის დახმარება",
      "მენეჯერის კონსულტაციები და მხარდაჭერა",
    ],
    reviews: [
      {
        name: "ლაშა კიკნაძე",
        rating: 5,
        review:
          "ფახკრაფტის პროგრამა Lazari Ways-თან ერთად იყო ჩემი კარიერის საუკეთესო ნაბიჯი. მე მივიღე შესანიშნავი სამუშაო, რომელიც შეესაბამება ჩემს პროფესიულ მიზნებს.",
        instagram: "@lasha.kiknadze",
        image: reviewerImage({ name: "reviewer-1", type: "fsj" }),
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

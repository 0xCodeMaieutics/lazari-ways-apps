import Image, { ImageProps } from "next/image";

const images = [
  { src: "/images/employers/employers-1.webp", alt: "Employer company logo 1" },
  { src: "/images/employers/employers-2.webp", alt: "Employer company logo 2" },
  { src: "/images/employers/employers-3.webp", alt: "Employer company logo 3" },
  { src: "/images/employers/employers-4.webp", alt: "Employer company logo 4" },
  { src: "/images/employers/employers-5.webp", alt: "Employer company logo 5" },
  { src: "/images/employers/employers-6.webp", alt: "Employer company logo 6" },
  { src: "/images/employers/employers-7.webp", alt: "Employer company logo 7" },
  { src: "/images/employers/employers-8.webp", alt: "Employer company logo 8" },
  { src: "/images/employers/employers-9.webp", alt: "Employer company logo 9" },
];

const ImageCustom = ({ ...props }: ImageProps) => (
  <Image
    priority={false}
    className="rounded-md object-cover hover:scale-105 transition-transform duration-300"
    fill={true}
    sizes="400x400"
    {...props}
  />
);

export const EmployersGallery = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative h-[380px] w-full rounded-lg overflow-hidden"
        >
          <ImageCustom alt={image.alt} src={image.src} />
        </div>
      ))}
    </div>
  );
};

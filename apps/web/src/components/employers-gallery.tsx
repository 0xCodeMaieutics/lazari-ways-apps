import Image, { ImageProps } from "next/image";

const images = [
  { src: "/employers/employers-1.webp", alt: "Employer company logo 1" },
  { src: "/employers/employers-2.webp", alt: "Employer company logo 2" },
  { src: "/employers/employers-3.webp", alt: "Employer company logo 3" },
  { src: "/employers/employers-4.webp", alt: "Employer company logo 4" },
  { src: "/employers/employers-5.webp", alt: "Employer company logo 5" },
  { src: "/employers/employers-6.webp", alt: "Employer company logo 6" },
  { src: "/employers/employers-7.webp", alt: "Employer company logo 7" },
  { src: "/employers/employers-8.webp", alt: "Employer company logo 8" },
  { src: "/employers/employers-9.webp", alt: "Employer company logo 9" },
];

const ImageCustom = ({ ...props }: ImageProps) => (
  <Image
    priority={false}
    className="rounded-md object-cover"
    fill={true}
    sizes="350x400"
    {...props}
  />
);

export const EmployersGallery = () => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative w-full h-[400px] sm:h-[350px max-w-sm mx-auto rounded-lg overflow-hidden"
        >
          <ImageCustom alt={image.alt} src={image.src} />
        </div>
      ))}
    </div>
  );
};

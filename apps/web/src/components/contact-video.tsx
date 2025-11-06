import clsx, { ClassValue } from "clsx";

export const ContactVideo = ({ className }: { className?: ClassValue }) => {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className={clsx("w-full h-full", className)}
    >
      <source src="/images/employers/contact.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

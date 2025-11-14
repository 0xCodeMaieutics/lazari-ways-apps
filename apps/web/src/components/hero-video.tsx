export const HeroVideo = () => {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className="rounded-2xl w-full bg-red-200 max-w-sm sm:min-w-[350px]"
    >
      <source src="/images/employers/hero.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

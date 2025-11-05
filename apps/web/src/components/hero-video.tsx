export const HeroVideo = () => {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className="rounded-2xl ml-auto w-full max-w-sm"
    >
      <source src="/images/employers/hero.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

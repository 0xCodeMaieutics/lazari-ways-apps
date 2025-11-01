export const HeroVideo = () => (
  <video
    autoPlay
    muted
    loop
    playsInline
    className="rounded-2xl mx-auto w-full max-w-sm"
  >
    <source src="/employers/employers-1.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
);

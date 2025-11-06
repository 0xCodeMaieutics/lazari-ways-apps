export const ContactVideo = () => {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className="rounded-2xl max-h-max mx-auto w-full max-w-sm"
    >
      <source src="/images/employers/contact.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

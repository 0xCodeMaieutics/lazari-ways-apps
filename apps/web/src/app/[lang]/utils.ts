export const replaceWindowHash = (sectionId: string) => {
  if (typeof window === "undefined") return;
  window.history.replaceState(null, "", "#" + sectionId);
};

export const scrollSmoothlyToSection = (sectionId: string) => {
  if (typeof window === "undefined") {
    return;
  }
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
    replaceWindowHash(sectionId);
  }
};

export const SECTION_IDS = {
  // home page:
  gallery: "gallery",
  contact: "contact",
  services: "services",
  vacancies: "vacancies",
  // service detail page:
  requirements: "requirements",
  included: "included",
  gallery_service: "gallery-service",
  reviews: "reviews",
};

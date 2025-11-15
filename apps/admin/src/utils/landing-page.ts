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
  howItWork: "how-it-work",
  gallery: "gallery",
  advantages: "advantages",
  aboutUs: "about-us",
  contact: "contact",
};

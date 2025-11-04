import { SectionHeader } from "@/components/section-header";
import { SECTION_IDS, scrollSmoothlyToSection } from "../utils";

export const HowDoWeWorkSection = () => {
  return (
    <section id={SECTION_IDS.howItWork} className="px-6 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          onClick={() => {
            scrollSmoothlyToSection(SECTION_IDS.howItWork);
          }}
        >
          How it works
        </SectionHeader>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg border p-6">
            <span className="text-sm font-medium text-slate-500">Step 1</span>
            <p className="mt-2 text-slate-700">
              Initial consultation and profile review.
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <span className="text-sm font-medium text-slate-500">Step 2</span>
            <p className="mt-2 text-slate-700">
              Matching with verified employers and preparing documents.
            </p>
          </div>
          <div className="rounded-lg border p-6 ">
            <span className="text-sm font-medium text-slate-500">Step 3</span>
            <p className="mt-2 text-slate-700">
              Job placement support and relocation guidance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

import { Card } from "@workspace/ui/components/card";
import { ComponentProps, PropsWithChildren } from "react";
import { ContactVideo } from "./contact-video";

export const CTASection = ({
  children,
  ...props
}: PropsWithChildren<ComponentProps<"section">>) => {
  return (
    <section
      className="sm:px-6 py-6 md:py-24 bg-secondary mt-8 md:mt-16"
      {...props}
    >
      <Card className="p-0 px-0 max-w-6xl mx-auto text-center shadow-lg rounded-none border-0 bg-transparent sm:bg-card sm:border sm:rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {children}
          <ContactVideo className="rounded-none max-w-none" />
        </div>
      </Card>
    </section>
  );
};

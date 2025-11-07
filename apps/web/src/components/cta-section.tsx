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
      <Card className="max-w-7xl mx-auto text-center shadow-lg rounded-none border-0 bg-transparent sm:bg-card sm:border sm:rounded-xl overflow-hidden py-0 sm:py-12 lg:py-0">
        <div className="flex flex-col lg:flex-row gap-y-6">
          <div className="flex-1">{children}</div>
          <ContactVideo className="h-full w-full sm:max-w-lg lg:max-w-xl lg:max-w-auto rounded-none sm:rounded-xl mx-auto lg:mx-0 lg:rounded-none" />
        </div>
      </Card>
    </section>
  );
};

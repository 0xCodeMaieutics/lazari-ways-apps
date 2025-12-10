import { PropsWithChildren } from "react";
import { ApplicationsTabs } from "./tabs";

export default async function ApplicationsLayout({
  children,
}: PropsWithChildren) {
  return (
    <div className="h-dvh w-full mx-auto space-y-6 pt-40 pb-10">
      <ApplicationsTabs />
      {children}
    </div>
  );
}

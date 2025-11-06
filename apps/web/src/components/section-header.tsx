import clsx, { ClassValue } from "clsx";
import { Hash } from "lucide-react";
import { ComponentProps, PropsWithChildren } from "react";

export const SectionHeader = ({
  children,
  className,
  ...props
}: PropsWithChildren<ComponentProps<"h1">> & {
  className?: ClassValue;
}) => (
  <h1
    {...props}
    role="button"
    className={clsx(
      "group flex items-center gap-2 text-3xl sm:text-4xl font-semibold cursor-pointer mb-10",
      className
    )}
  >
    {children}
    <Hash className="transition duration-150 opacity-0 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100" />
  </h1>
);

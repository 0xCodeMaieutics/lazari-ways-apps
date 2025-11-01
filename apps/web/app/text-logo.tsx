import { PropsWithChildren } from "react";

export const Underline = () => (
  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out" />
);
export const TextLogo = ({ children }: PropsWithChildren) => {
  return (
    <button className="relative group text-primary text-3xl font-bold max-w-max cursor-pointer pb-2">
      {children}
      <Underline />
    </button>
  );
};

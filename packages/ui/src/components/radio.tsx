import React from "react";
import { cn } from "@workspace/ui/lib/utils";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Radio = ({ className, label, id, ...props }: RadioProps) => (
  <div className="flex items-center space-x-2">
    <input
      type="radio"
      className={cn(
        "h-4 w-4 border border-input bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      id={id}
      {...props}
    />
    {label && (
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    )}
  </div>
);
Radio.displayName = "Radio";

export { Radio };

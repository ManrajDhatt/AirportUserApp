import * as React from "react";
import { cn } from "@/app/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-md transition-colors",
          "bg-blue-500 text-white hover:bg-blue-600",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };

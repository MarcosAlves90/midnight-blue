import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "transparent";
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, variant = "transparent", ...props }, ref) => {
    const variantClasses = {
      default: "border border-input",
      transparent: "bg-muted/20 border-transparent focus:bg-background",
    };

    return (
      <Input
        ref={ref}
        className={cn(variantClasses[variant], className)}
        {...props}
      />
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput };

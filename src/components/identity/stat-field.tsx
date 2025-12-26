import React from "react";
import { FormInput } from "@/components/ui/form-input";
import { Tip } from "@/components/ui/tip";

interface StatFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  description?: string;
}

export const StatField: React.FC<StatFieldProps> = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  description,
}) => (
  <div className="space-y-1.5 group">
    {description ? (
      <Tip
        content={<div className="max-w-xs text-xs">{description}</div>}
        side="top"
        align="start"
      >
        <label className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1.5 group-hover:text-primary transition-colors cursor-help w-fit">
          {icon}
          <span className="decoration-dotted underline underline-offset-2">
            {label}
            {required && (
              <span className="text-red-500 ml-0.5" aria-label="obrigatório">
                *
              </span>
            )}
          </span>
        </label>
      </Tip>
    ) : (
      <label className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1.5 group-hover:text-primary transition-colors">
        {icon}
        <span>
          {label}
          {required && (
            <span className="text-red-500 ml-0.5" aria-label="obrigatório">
              *
            </span>
          )}
        </span>
      </label>
    )}
    <FormInput
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 text-sm bg-muted/20 border-transparent focus:bg-background transition-all text-center font-medium"
      placeholder={placeholder}
      required={required}
      aria-label={label}
    />
  </div>
);

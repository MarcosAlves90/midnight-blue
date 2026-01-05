"use client";

import React from "react";
import { FormInput } from "@/components/ui/form-input";
import { Textarea } from "@/components/ui/textarea";
import { Tip } from "@/components/ui/tip";
import { useIdentityActions, type IdentityData } from "@/contexts/IdentityContext";
import { useFieldLocalState } from "@/hooks/use-field-local-state";
import { useIdentityField } from "@/hooks/use-identity-field";
import { cn } from "@/lib/utils";

interface IdentityFieldProps {
  field: keyof IdentityData;
  label: string;
  icon?: React.ReactNode;
  placeholder?: string;
  description?: string;
  textarea?: boolean;
  className?: string;
  inputClassName?: string;
  debounceMs?: number;
}

/**
 * A standardized, subscription-based input field for Identity data.
 * This component is reference-stable and prevents focus loss by being defined at the top level.
 * It uses useIdentityField to only re-render when its specific field changes.
 */
export const IdentityField = React.memo(({
  field,
  label,
  icon,
  placeholder,
  description,
  textarea = false,
  className,
  inputClassName,
  debounceMs = 300,
}: IdentityFieldProps) => {
  const { markFieldDirty, updateIdentity } = useIdentityActions();
  const extValue = useIdentityField(field);
  
  const { value, handleChange, handleBlur } = useFieldLocalState(
    (extValue as string) || "", 
    (v: string) => updateIdentity(field, v), 
    { 
      debounceMs, 
      fieldName: String(field), 
      onDirty: () => markFieldDirty(String(field)) 
    }
  );

  const InputComponent = textarea ? Textarea : FormInput;

  return (
    <div className={cn("space-y-1.5 min-w-0", className)}>
      {description ? (
        <Tip
          content={<div className="max-w-xs text-xs">{description}</div>}
          side="top"
          align="start"
        >
          <label 
            htmlFor={String(field)} 
            className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1 cursor-help w-fit max-w-full"
          >
            <span className="shrink-0">{icon}</span>
            <span className="decoration-dotted underline underline-offset-2 truncate">{label}</span>
          </label>
        </Tip>
      ) : (
        <label 
          htmlFor={String(field)} 
          className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1 w-fit max-w-full"
        >
          <span className="shrink-0">{icon}</span>
          <span className="truncate">{label}</span>
        </label>
      )}
      <InputComponent
        id={String(field)}
        name={String(field)}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn("w-full min-w-0", inputClassName)}
        aria-label={label}
      />
    </div>
  );
});

IdentityField.displayName = "IdentityField";

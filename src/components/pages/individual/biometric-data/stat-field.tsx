import React from "react";
import { FormInput } from "@/components/ui/form-input";
import { Tip } from "@/components/ui/tip";
import { useFieldLocalState } from "@/hooks/use-field-local-state";
import { useIdentityContext } from "@/contexts/IdentityContext";

interface StatFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Optional key name to identify the field for dirty tracking */
  fieldKey?: keyof import("@/contexts/IdentityContext").IdentityData;
  placeholder?: string;
  required?: boolean;
  description?: string;
}

export const StatField: React.FC<StatFieldProps> = ({
  icon,
  label,
  value,
  onChange: parentOnChange,
  fieldKey,
  placeholder,
  required = false,
  description,
}) => {
  const { markFieldDirty } = useIdentityContext();
  const { value: localValue, handleChange, handleBlur } = useFieldLocalState(value, parentOnChange, {
    debounceMs: 300,
    fieldName: fieldKey ? String(fieldKey) : undefined,
    onDirty: () => fieldKey && markFieldDirty(String(fieldKey)),
  });

  return (
    <div className="space-y-1.5 group">
      {description ? (
        <Tip
          content={<div className="max-w-xs text-xs">{description}</div>}
          side="top"
          align="start"
        >
          <label htmlFor={fieldKey ? String(fieldKey) : undefined} className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1.5 group-hover:text-primary transition-colors cursor-help w-fit">
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
        <label htmlFor={fieldKey ? String(fieldKey) : undefined} className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1.5 group-hover:text-primary transition-colors">
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
        id={fieldKey ? String(fieldKey) : undefined}
        name={fieldKey ? String(fieldKey) : label.replace(/\s+/g, "-").toLowerCase()}
        value={localValue}
        onChange={(e) => handleChange(e)}
        onBlur={handleBlur}
        className="h-9 text-sm bg-muted/20 border-transparent focus:bg-background transition-all text-center font-medium"
        placeholder={placeholder}
        required={required}
        aria-label={label}
      />
    </div>
  );
};

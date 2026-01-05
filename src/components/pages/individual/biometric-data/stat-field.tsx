import React from "react";
import { FormInput } from "@/components/ui/form-input";
import { Tip } from "@/components/ui/tip";
import { useFieldLocalState } from "@/hooks/use-field-local-state";
import { useIdentityField } from "@/hooks/use-identity-field";
import { useIdentityActions } from "@/contexts/IdentityContext";

interface StatFieldProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  /** Optional key name to identify the field for dirty tracking */
  fieldKey?: keyof import("@/contexts/IdentityContext").IdentityData;
  placeholder?: string;
  required?: boolean;
  description?: string;
}

export const StatField: React.FC<StatFieldProps> = ({
  icon,
  label,
  value = "",
  onChange: parentOnChange,
  fieldKey,
  placeholder,
  required = false,
  description,
}) => {
  const { markFieldDirty, updateIdentity } = useIdentityActions();

  // Always call the hook to satisfy rules-of-hooks; if no `fieldKey` is provided we ignore the subscribed value
  const _subscribedValue = useIdentityField(fieldKey as keyof import("@/contexts/IdentityContext").IdentityData);
  const extValue = fieldKey ? (_subscribedValue as unknown as string) : value;

  const commit = React.useCallback((v: string) => {
    if (fieldKey) {
      // The typed mapping from field -> value is dynamic here; cast safely and keep the rule narrow
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateIdentity(fieldKey as any, v as any);
    } else if (parentOnChange) {
      parentOnChange(v);
    }
  }, [fieldKey, parentOnChange, updateIdentity]);

  const { value: localValue, handleChange, handleBlur } = useFieldLocalState(extValue, commit, {
    debounceMs: 300,
    fieldName: fieldKey ? String(fieldKey) : undefined,
    onDirty: () => fieldKey && markFieldDirty(String(fieldKey)),
  });

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[dev-stat-field] render ${fieldKey ?? label}`);
    }
  });

  return (
    <div className="space-y-1.5 group min-w-0">
      {description ? (
        <Tip
          content={<div className="max-w-xs text-xs">{description}</div>}
          side="top"
          align="start"
        >
          <label 
            htmlFor={fieldKey ? String(fieldKey) : undefined} 
            className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1.5 group-hover:text-primary transition-colors cursor-help w-fit max-w-full"
          >
            <span className="shrink-0">{icon}</span>
            <span className="decoration-dotted underline underline-offset-2 truncate">
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
        <label 
          htmlFor={fieldKey ? String(fieldKey) : undefined} 
          className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1.5 group-hover:text-primary transition-colors w-fit max-w-full"
        >
          <span className="shrink-0">{icon}</span>
          <span className="truncate">
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
        className="h-9 text-sm bg-muted/20 border-transparent focus:bg-background transition-all text-center font-medium w-full min-w-0"
        placeholder={placeholder}
        required={required}
        aria-label={label}
      />
    </div>
  );
};

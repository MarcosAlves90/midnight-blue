import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "transparent";
  /** Optional debounce in ms for onChange to avoid heavy work on each keystroke */
  debounceMs?: number;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, variant = "transparent", debounceMs, onChange, value, onBlur, ...props }, ref) => {
    const variantClasses = {
      default: "border border-input",
      transparent: "bg-muted/20 border-transparent focus:bg-background",
    };

    // Hooks must be unconditional — create them even if debounce isn't used
    const [localValue, setLocalValue] = React.useState(String(value ?? ""));
    const timeoutRef = React.useRef<number | undefined>(undefined);

    // Sync when parent value changes (e.g., external update)
    React.useEffect(() => {
      setLocalValue(String(value ?? ""));
    }, [value]);

    const handleChangeDebounced = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setLocalValue(v);
      if (!debounceMs || !onChange) {
        return;
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        // Create a fresh event-like object to send the latest value
        const ev = Object.assign({}, e, { target: { ...e.target, value: v } });
        try {
          onChange(ev as React.ChangeEvent<HTMLInputElement>);
        } catch {
          // ignore
        }
        timeoutRef.current = undefined;
      }, debounceMs);
    }, [onChange, debounceMs]);

    const handleBlurDebounced = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      // flush pending change
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
        const fake = Object.assign({}, { target: { value: localValue } });
        try {
          if (onChange) onChange(fake as unknown as React.ChangeEvent<HTMLInputElement>);
        } catch {
          // ignore
        }
      }
      if (onBlur) onBlur(e);
    }, [localValue, onChange, onBlur]);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    // If debounce not requested, pass through to parent handlers immediately
    if (!debounceMs || !onChange) {
      return (
        <Input
          ref={ref}
          className={cn(variantClasses[variant], className)}
          value={String(value ?? "")}
          onChange={onChange}
          onBlur={onBlur}
          {...props}
        />
      );
    }

    return (
      <Input
        ref={ref}
        className={cn(variantClasses[variant], className)}
        value={localValue}
        onChange={handleChangeDebounced}
        onBlur={handleBlurDebounced}
        {...props}
      />
    );
  },
);

FormInput.displayName = "FormInput";

export { FormInput };

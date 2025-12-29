import * as React from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<'textarea'> {
  /** Optional debounce in ms to reduce updates per keystroke */
  debounceMs?: number;
}

function Textarea({ className, debounceMs, value, onChange, onBlur, ...props }: TextareaProps) {
  const [localValue, setLocalValue] = React.useState(String(value ?? ""));
  const timeoutRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    setLocalValue(String(value ?? ""));
  }, [value]);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setLocalValue(v);
    if (!debounceMs || !onChange) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      const ev = Object.assign({}, e, { target: { ...e.target, value: v } });
      try {
        onChange(ev as React.ChangeEvent<HTMLTextAreaElement>);
      } catch {
        // ignore
      }
      timeoutRef.current = undefined;
    }, debounceMs);
  }, [debounceMs, onChange]);

  const handleBlur = React.useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
      const fake = Object.assign({}, { target: { value: localValue } });
      try {
        if (onChange) onChange(fake as unknown as React.ChangeEvent<HTMLTextAreaElement>);
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

  if (!debounceMs || !onChange) {
    return (
      <textarea
        data-slot="textarea"
        className={cn(
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex min-h-[60px] w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
    );
  }

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex min-h-[60px] w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
  );
}

export { Textarea };
export default React.memo(Textarea);

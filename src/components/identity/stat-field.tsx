import React from "react"
import { Input } from "@/components/ui/input"

interface StatFieldProps {
  icon: React.ReactNode
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export const StatField: React.FC<StatFieldProps> = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
  required = false,
}) => (
  <div className="space-y-1.5 group">
    <label className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1.5 group-hover:text-primary transition-colors">
      {icon}
      <span>
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-label="obrigatório">*</span>}
      </span>
    </label>
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 text-sm bg-muted/20 border-transparent focus:bg-background transition-all text-center font-medium"
      placeholder={placeholder}
      required={required}
      aria-label={label}
    />
  </div>
)

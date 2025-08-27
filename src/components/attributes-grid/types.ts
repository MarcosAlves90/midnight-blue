export interface Attribute {
    id: string
    name: string
    abbreviation: string
    color: string
    value: number
    bonus?: number // agora opcional
    type: "attribute" | "biotype"
}

export interface AttributesGridProps {
    initialAttributes?: Attribute[]
    initialBiotypes?: Attribute[]
    onAttributesChange?: (attributes: Attribute[]) => void
    onBiotypesChange?: (biotypes: Attribute[]) => void
    disabled?: boolean
    editable?: boolean
    mode?: "attribute" | "biotype"
}

export interface EditableValueHook {
    value: number
    inputValue: string
    handleChange: (inputVal: string) => void
    handleBlur: () => void
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

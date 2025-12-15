export interface Attribute {
    id: string
    name: string
    abbreviation: string
    color: string
    value: number
    bonus?: number // agora opcional
    type: "attribute"
    description?: string
}

export interface AttributesGridProps {
    initialAttributes?: Attribute[]
    onAttributesChange?: (attributes: Attribute[]) => void
    disabled?: boolean
    editable?: boolean
}

export interface EditableValueHook {
    value: number
    inputValue: string
    handleChange: (inputVal: string) => void
    handleBlur: () => void
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

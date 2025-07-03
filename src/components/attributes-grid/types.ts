export interface Attribute {
    id: string
    name: string
    abbreviation: string
    borderColor: string
    value: number
    bonus: number
}

export interface AttributesGridProps {
    initialAttributes?: Attribute[]
    onAttributesChange?: (attributes: Attribute[]) => void
    disabled?: boolean
    editable?: boolean
}

export interface AttributeCardProps {
    id: string
    name: string
    abbreviation: string
    borderColor: string
    value: number
    bonus: number
    onValueChange?: (value: number) => void
    onBonusChange?: (bonus: number) => void
    disabled?: boolean
    editable?: boolean
}

export interface Skill {
  id: string;
  name: string;
  attribute: string; // linked attribute abbreviation (e.g., 'DES', 'FOR')
  abbreviation?: string;
  value?: number;
  // Outros: campos de bônus (outros modificadores aplicáveis à perícia)
  others?: number;
  description?: string;
  onlyTrained?: boolean;
  action?: string;
  isTemplate?: boolean;
  parentId?: string; // If it's a specialization, this points to the template ID
  specialization?: string; // The specific name of the specialization (e.g., "Ciência")
}

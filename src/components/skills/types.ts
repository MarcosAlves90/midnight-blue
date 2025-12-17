export interface Skill {
  id: string;
  name: string;
  attribute: string; // linked attribute abbreviation (e.g., 'DES', 'FOR')
  abbreviation?: string;
  value?: number;
  // Outros: campos de bônus (outros modificadores aplicáveis à perícia)
  others?: number;
  description?: string;
}

export class SheetManager {
  /**
   * Compara se dois objetos são diferentes de forma eficiente (rasa para campos simples).
   */
  static hasChanges<T>(prev: T, next: T): boolean {
    if (prev === next) return false;
    if (!prev || !next) return true;
    
    // Fallback para objetos complexos
    return JSON.stringify(prev) !== JSON.stringify(next);
  }

  /**
   * Consolida dirty fields com base nas mudanças detectadas.
   */
  static getNewDirtyFields(
    currentDirty: Set<string>,
    updates: Record<string, unknown>,
    prefix: string = ""
  ): Set<string> {
    const next = new Set(currentDirty);
    Object.keys(updates).forEach((k) => {
      const path = prefix ? `${prefix}.${k}` : k;
      next.add(path);
      
      const val = updates[k];
      if (val && typeof val === "object" && !Array.isArray(val)) {
        Object.keys(val).forEach((subK) => next.add(`${path}.${subK}`));
      }
    });
    return next;
  }
}

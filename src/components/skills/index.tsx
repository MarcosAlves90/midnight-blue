"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Edit3, Lock, ChevronDown, Search, X } from "lucide-react";
import SkillCard from "./skill-card";
import { useSkillsContext } from "@/contexts/SkillsContext";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "attribute"
  | "value-asc"
  | "value-desc"
  | "others-asc"
  | "others-desc";

export function SkillsList() {
  const { skills, updateSkill } = useSkillsContext();
  const [isEditMode, setIsEditMode] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (
    id: string,
    field: "value" | "others",
    value: number,
  ) => {
    updateSkill(id, field, value);
  };

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);

  // Função para ordenar as perícias
  const sortedSkills = useMemo(() => {
    // Primeiro filtra por termo de busca
    const filtered = skills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.attribute.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (skill.abbreviation &&
          skill.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())),
    );

    // Depois ordena
    const sorted = [...filtered];

    switch (sortOption) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "attribute":
        return sorted.sort((a, b) => a.attribute.localeCompare(b.attribute));
      case "value-asc":
        return sorted.sort((a, b) => (a.value ?? 0) - (b.value ?? 0));
      case "value-desc":
        return sorted.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
      case "others-asc":
        return sorted.sort((a, b) => (a.others ?? 0) - (b.others ?? 0));
      case "others-desc":
        return sorted.sort((a, b) => (b.others ?? 0) - (a.others ?? 0));
      default:
        return sorted;
    }
  }, [skills, sortOption, searchTerm]);

  const renderEditButton = () => (
    <button
      onClick={toggleEditMode}
      className={`p-2 rounded cursor-pointer transition-all duration-200 ${
        isEditMode
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/30"
      }`}
      title={isEditMode ? "Desativar modo de edição" : "Ativar modo de edição"}
      aria-label={
        isEditMode ? "Desativar modo de edição" : "Ativar modo de edição"
      }
      aria-pressed={isEditMode}
    >
      {isEditMode ? (
        <Edit3 className="w-4 h-4" />
      ) : (
        <Lock className="w-4 h-4" />
      )}
    </button>
  );

  const renderSortDropdown = () => (
    <div className="relative">
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value as SortOption)}
        className="appearance-none px-3 py-2 rounded text-sm bg-muted-foreground/20 text-muted-foreground border-0 outline-none cursor-pointer hover:bg-muted-foreground/30 transition-colors pr-8"
        aria-label="Ordenar perícias"
      >
        <option value="name-asc">Nome (A-Z)</option>
        <option value="name-desc">Nome (Z-A)</option>
        <option value="attribute">Por Atributo</option>
        <option value="value-asc">Valor (↑)</option>
        <option value="value-desc">Valor (↓)</option>
        <option value="others-asc">Bônus (↑)</option>
        <option value="others-desc">Bônus (↓)</option>
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );

  const renderSearchInput = () => (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        placeholder="Buscar perícia..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 pr-8 py-2 rounded text-sm bg-muted-foreground/20 text-muted-foreground placeholder:text-muted-foreground/60 border-0 outline-none hover:bg-muted-foreground/30 transition-colors"
        aria-label="Buscar perícias"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0.5 hover:bg-muted-foreground/40 rounded transition-colors cursor-pointer"
          aria-label="Limpar busca"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold">Perícias</h2>
        <div className="flex items-center gap-2">
          {renderSearchInput()}
          {renderSortDropdown()}
          {renderEditButton()}
        </div>
      </div>
      <table className="w-full table-fixed">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-muted/20">
            <th className="w-[50%] sm:w-[40%] px-2 py-1 font-medium">
              Perícia
            </th>
            <th className="hidden sm:table-cell sm:w-[20%] px-2 py-1 font-medium">
              Attr
            </th>
            <th className="w-[25%] sm:w-[20%] px-1 py-1 text-center font-medium">
              Grad
            </th>
            <th className="w-[25%] sm:w-[20%] px-1 py-1 text-center font-medium">
              Outros
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-muted/10">
          {sortedSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              {...skill}
              value={skill.value ?? 0}
              others={skill.others ?? 0}
              onChange={handleChange}
              disabled={!isEditMode}
            />
          ))}
        </tbody>
      </table>
      {sortedSkills.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma perícia encontrada
        </div>
      )}
    </div>
  );
}

export default SkillsList;

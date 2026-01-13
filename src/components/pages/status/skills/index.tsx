"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Edit3, Lock, ChevronDown, Search, X, Plus } from "lucide-react";
import SkillCard from "./skill-card";
import { useSkillsContext } from "@/contexts/SkillsContext";
import { INITIAL_SKILLS } from "./constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "attribute"
  | "value-asc"
  | "value-desc"
  | "others-asc"
  | "others-desc";

function SkillsList({
  isEditMode: initialIsEditMode = false,
}: {
  isEditMode?: boolean;
}) {
  const { skills, updateSkill, addSpecialization, removeSkill } =
    useSkillsContext();
  const [isEditMode, setIsEditMode] = useState(initialIsEditMode);
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [searchTerm, setSearchTerm] = useState("");

  // State for new specialization
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [specName, setSpecName] = useState("");

  const templates = useMemo(
    () => INITIAL_SKILLS.filter((s) => s.isTemplate),
    [],
  );

  const handleAddSpec = () => {
    if (selectedTemplate && specName.trim()) {
      addSpecialization(selectedTemplate, specName.trim());
      setSpecName("");
      setSelectedTemplate("");
      setIsAddDialogOpen(false);
    }
  };

  const getPlaceholder = () => {
    switch (selectedTemplate) {
      case "ESPECIALIDADE":
        return "Ex: Ciência, Magia, Direito, Manha...";
      case "COMBATE_CORPO_A_CORPO":
        return "Ex: Espadas, Desarmado, Garras...";
      case "COMBATE_DISTANCIA":
        return "Ex: Armas de Fogo, Arremesso, Controle de Energia...";
      default:
        return "Ex: Ciência, Espadas, Armas de Fogo...";
    }
  };

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
    // Primeiro filtra por termo de busca e remove templates
    const filtered = skills.filter(
      (skill) =>
        !skill.isTemplate &&
        (skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          skill.attribute.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (skill.abbreviation &&
            skill.abbreviation
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))),
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
    <div className="flex items-center gap-2">
      {isEditMode && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <button
              className="p-2 rounded-lg cursor-pointer transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90"
              title="Adicionar Especialização"
            >
              <Plus className="w-4 h-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Especialização</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="template">Tipo de Perícia</Label>
                <select
                  id="template"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled className="bg-background">
                    Selecione o tipo...
                  </option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id} className="bg-background">
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="spec-name">Nome da Especialização</Label>
                <Input
                  id="spec-name"
                  placeholder={getPlaceholder()}
                  value={specName}
                  onChange={(e) => setSpecName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSpec()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddSpec}
                disabled={!selectedTemplate || !specName.trim()}
              >
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <button
        onClick={toggleEditMode}
        className={`p-2 rounded cursor-pointer transition-all duration-200 ${
          isEditMode
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/30"
        }`}
        title={
          isEditMode ? "Desativar modo de edição" : "Ativar modo de edição"
        }
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
    </div>
  );

  const renderSortDropdown = () => (
    <div className="relative">
      <select
        id="skill-sort"
        name="skill-sort"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value as SortOption)}
        className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8 cursor-pointer hover:bg-accent/50"
        aria-label="Ordenar perícias"
      >
        <option value="name-asc" className="bg-background">
          Nome (A-Z)
        </option>
        <option value="name-desc" className="bg-background">
          Nome (Z-A)
        </option>
        <option value="attribute" className="bg-background">
          Por Atributo
        </option>
        <option value="value-asc" className="bg-background">
          Valor (↑)
        </option>
        <option value="value-desc" className="bg-background">
          Valor (↓)
        </option>
        <option value="others-asc" className="bg-background">
          Bônus (↑)
        </option>
        <option value="others-desc" className="bg-background">
          Bônus (↓)
        </option>
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );

  const renderSearchInput = () => (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
      <Input
        id="skill-search"
        name="skill-search"
        type="text"
        placeholder="Buscar perícia..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 pr-8 h-8 text-xs bg-transparent"
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
              onRemove={
                skill.parentId ? () => removeSkill(skill.id) : undefined
              }
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

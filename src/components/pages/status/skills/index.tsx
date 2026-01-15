"use client";

import React, { useState, useCallback, useMemo } from "react";
import { ChevronDown, Search, X, Plus } from "lucide-react";
import { EditToggle } from "@/components/ui/edit-toggle";
import SkillCard from "./skill-card";
import { useSkillsContext } from "@/contexts/SkillsContext";
import { INITIAL_SKILLS } from "./constants";
import { cn } from "@/lib/utils";
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
  const [isControlsOpen, setIsControlsOpen] = useState(false);
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
              className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/30 transition-all active:scale-95"
              title="Adicionar Especialização"
            >
              <Plus className="h-3 w-3" />
              Injetar
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

      <EditToggle 
        isActive={isEditMode} 
        onToggle={toggleEditMode}
        activeTitle="Desativar modo de edição"
        inactiveTitle="Ativar modo de edição"
      />
    </div>
  );

  const renderSortDropdown = () => (
    <div className="relative group min-w-[140px]">
      <select
        id="skill-sort"
        name="skill-sort"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value as SortOption)}
        className="w-full h-9 pl-3 pr-8 bg-zinc-900/50 border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-400 appearance-none focus:outline-none focus:border-blue-500/50 focus:text-blue-400 transition-all cursor-pointer hover:border-white/10"
        aria-label="Ordenar perícias"
      >
        <option value="name-asc" className="bg-zinc-950 text-zinc-400">
          Nome (A-Z)
        </option>
        <option value="name-desc" className="bg-zinc-950 text-zinc-400">
          Nome (Z-A)
        </option>
        <option value="attribute" className="bg-zinc-950 text-zinc-400">
          Por Atributo
        </option>
        <option value="value-asc" className="bg-zinc-950 text-zinc-400">
          Valor (↑)
        </option>
        <option value="value-desc" className="bg-zinc-950 text-zinc-400">
          Valor (↓)
        </option>
        <option value="others-asc" className="bg-zinc-950 text-zinc-400">
          Bônus (↑)
        </option>
        <option value="others-desc" className="bg-zinc-950 text-zinc-400">
          Bônus (↓)
        </option>
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-zinc-600 group-hover:text-zinc-400 pointer-events-none transition-colors" />
    </div>
  );

  const renderSearchInput = () => (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none z-10" />
      <input
        id="skill-search"
        name="skill-search"
        type="text"
        placeholder="RASTREAR PERÍCIA..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full h-9 pl-8 pr-8 bg-zinc-900/50 border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-400 placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 focus:text-blue-400 transition-all hover:border-white/10"
        aria-label="Buscar perícias"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-zinc-800 text-zinc-600 hover:text-rose-500 rounded transition-all cursor-pointer"
          aria-label="Limpar busca"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-2 gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-black uppercase tracking-tighter text-white">
            Perícias
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsControlsOpen(!isControlsOpen)}
            className={cn(
              "p-2 border transition-all duration-300",
              isControlsOpen || searchTerm
                ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                : "bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/10"
            )}
            title="Filtrar e Buscar"
          >
            <Search className="w-4 h-4" />
          </button>
          {renderEditButton()}
        </div>
      </div>

      {isControlsOpen && (
        <div className="flex flex-col sm:flex-row gap-2 mb-2 animate-in fade-in slide-in-from-top-2 duration-300">
          {renderSearchInput()}
          {renderSortDropdown()}
        </div>
      )}

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

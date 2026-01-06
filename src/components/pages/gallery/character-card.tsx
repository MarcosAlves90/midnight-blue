"use client";

import { useState } from "react";
import { Shield, Trash2, Loader2 } from "lucide-react";
import { DeleteCharacterDialog } from "./delete-character-dialog";
import type { CharacterDocument } from "@/lib/types/character";
import { CharacterImage } from "@/components/ui/custom/character-image";

interface CharacterCardProps {
  character: CharacterDocument;
  onSelect: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function CharacterCard({
  character,
  onSelect,
  onDelete,
  isDeleting,
}: CharacterCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const heroName = character.identity?.heroName || character.identity?.name || "UNKNOWN";
  const civilName = character.identity?.name || "CLASSIFIED";
  const powerLevel = (character.status as { powerLevel?: number }).powerLevel ?? 0;
  const fileId = character.id.slice(-8).toUpperCase();
  const updatedAt = new Date(character.updatedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <>
      <div
        onClick={onSelect}
        className="group relative rounded-lg border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col shadow-md hover:shadow-primary/5 cursor-default"
      >
        <MugshotArea character={character} heroName={heroName} />
        
        <div className="p-2.5 flex flex-col flex-1 gap-2.5">
          <CharacterInfo 
            heroName={heroName} 
            fileId={fileId} 
            civilName={civilName} 
            powerLevel={powerLevel} 
            updatedAt={updatedAt} 
          />
          
          <CharacterActions 
            isDeleting={isDeleting} 
            onDelete={() => setIsDeleteDialogOpen(true)} 
          />
        </div>

        {/* Invisible link for accessibility and SEO */}
        <a
          href={`/dashboard/personagem/individual/${character.id}`}
          onClick={(e) => {
            e.preventDefault();
            onSelect();
          }}
          className="absolute inset-0 z-0"
          aria-label={`Acessar ficha de ${heroName}`}
        />
      </div>

      <DeleteCharacterDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onDelete}
        heroName={heroName}
        isDeleting={isDeleting}
      />
    </>
  );
}

function MugshotArea({ character, heroName }: { character: CharacterDocument; heroName: string }) {
  return (
    <div className="h-40 w-full bg-muted/20 overflow-hidden relative border-b border-border cursor-pointer">
      {/* Height Scale Visual Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex flex-col justify-between py-2 px-1 font-mono">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-full border-t border-foreground/50 flex justify-end">
            <span className="text-[6px] leading-none pr-0.5">{180 - i * 10}</span>
          </div>
        ))}
      </div>

      <CharacterImage
        src={character.identity.profileImage}
        alt={heroName}
        imagePosition={character.identity.imagePosition}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
        className="grayscale contrast-110 brightness-90 group-hover:grayscale-0 transition-all duration-500"
        fallback={
          <div className="h-full w-full flex items-center justify-center bg-muted/30">
            <span className="text-2xl font-bold text-muted-foreground/20 font-mono">SEM FOTO</span>
          </div>
        }
      />

      <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm py-1 px-2 border-t border-border">
        <p className="text-[7px] text-center tracking-[0.2em] text-muted-foreground font-bold uppercase">
          SEVASTOPOL / UNIDADE-44 BASILISC
        </p>
      </div>

      <div className="absolute top-2 left-2 -rotate-12 border-2 border-destructive/40 px-1.5 py-0.5 invert rounded-sm pointer-events-none font-mono">
        <span className="text-[8px] font-black text-destructive/60 tracking-tighter uppercase">Confidencial</span>
      </div>
    </div>
  );
}

function CharacterInfo({ 
  heroName, 
  fileId, 
  civilName, 
  powerLevel, 
  updatedAt 
}: { 
  heroName: string; 
  fileId: string; 
  civilName: string; 
  powerLevel: number; 
  updatedAt: string; 
}) {
  return (
    <div className="flex flex-col gap-2 cursor-pointer">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[8px] text-primary font-bold uppercase tracking-tight opacity-80">Codinome / Alias</p>
          <h3 className="font-bold text-xs leading-tight truncate group-hover:text-primary transition-colors">
            {heroName}
          </h3>
        </div>
        <div className="text-right font-mono">
          <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter">ID Arquivo</p>
          <p className="text-[9px] font-bold opacity-80">#{fileId}</p>
        </div>
      </div>

      <div className="space-y-1 border-t border-border pt-1.5">
        <div>
          <p className="text-[7px] text-muted-foreground uppercase font-bold">Nome do Indivíduo:</p>
          <p className="text-[9px] font-medium truncate">{civilName}</p>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[7px] text-muted-foreground uppercase font-bold">Nível de Ameaça:</p>
            <div className="flex items-center gap-1">
              <Shield className={`w-2.5 h-2.5 ${powerLevel > 10 ? "text-destructive" : "text-primary"}`} />
              <p className={`text-[9px] font-bold ${powerLevel > 10 ? "text-destructive" : "text-primary"}`}>
                CLASSE-{powerLevel}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[7px] text-muted-foreground uppercase font-bold">Visto por último:</p>
            <p className="text-[9px] text-muted-foreground">{updatedAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CharacterActions({ 
  isDeleting, 
  onDelete 
}: { 
  isDeleting: boolean; 
  onDelete: () => void; 
}) {
  return (
    <div className="flex items-center justify-end mt-auto pt-1.5 border-t border-border relative z-10">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        disabled={isDeleting}
        className="flex items-center gap-1.5 px-2 py-1 bg-destructive/5 hover:bg-destructive/15 text-destructive border border-destructive/20 hover:border-destructive/40 rounded-md transition-all duration-200 disabled:opacity-50 group/del"
      >
        {isDeleting ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <>
            <Trash2 className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase">Eliminar</span>
          </>
        )}
      </button>
    </div>
  );
}

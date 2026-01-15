"use client";

import { memo } from "react";
import { 
  Sliders, 
  Tag, 
  BookOpen 
} from "lucide-react";
import { HubCollapsibleSection } from "./hub-collapsible-section";
import { PowerImageUpload } from "./power-image-upload";

interface HubGlobalConfigProps {
  expanded: boolean;
  onToggle: () => void;
  selectedDescriptors: string[];
  onToggleDescriptor: (d: string) => void;
  notes: string;
  onNotesChange: (n: string) => void;
  customDescriptors: string[];
  image?: { url: string; publicId: string };
  onImageChange: (image: { url: string; publicId: string } | undefined) => void;
  pendingImageFile?: File;
  onPendingImageChange: (file: File | undefined) => void;
}

export const HubGlobalConfig = memo(({
  expanded,
  onToggle,
  selectedDescriptors,
  onToggleDescriptor,
  notes,
  onNotesChange,
  customDescriptors,
  image,
  onImageChange,
  pendingImageFile,
  onPendingImageChange
}: HubGlobalConfigProps) => {
  return (
    <HubCollapsibleSection
      id="global-config"
      isOpen={expanded}
      onToggle={onToggle}
      icon={<Sliders className="h-4 w-4" />}
      variant="blue"
      title="Configurações Base"
      subtitle={
        <div className="flex gap-2 mt-1">
          {selectedDescriptors.map((d) => (
            <span
              key={d}
              className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded-full text-zinc-400 font-bold"
            >
              {d}
            </span>
          ))}
        </div>
      }
    >
      <div className="p-4 pt-0 border-t border-white/5 space-y-4">
        <div className="mt-3">
          <PowerImageUpload 
            image={image} 
            onImageChange={onImageChange} 
            pendingImageFile={pendingImageFile}
            onPendingImageChange={onPendingImageChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Tag className="h-3 w-3" /> Descritores Narrativos
          </label>
          <div className="flex flex-wrap gap-1.5">
            {customDescriptors.map((d) => (
              <button
                key={d}
                onClick={() => onToggleDescriptor(d)}
                className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border transition-all ${
                  selectedDescriptors.includes(d)
                    ? "bg-blue-500/20 border-blue-500 text-blue-300"
                    : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/30"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <BookOpen className="h-3 w-3" /> Notas de Execução
          </label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Instruções adicionais ou flavor text..."
            className="w-full bg-black/40 border border-white/10 p-2.5 text-[11px] min-h-[60px] resize-none focus:border-blue-500/30 transition-colors"
          />
        </div>
      </div>
    </HubCollapsibleSection>
  );
});

HubGlobalConfig.displayName = "HubGlobalConfig";

"use client";

import { useCallback, useRef } from "react";
import { Upload, Image as ImageIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";

interface PowerImageUploadProps {
  image?: { url: string; publicId: string };
  onImageChange: (image: { url: string; publicId: string } | undefined) => void;
  pendingImageFile?: File;
  onPendingImageChange: (file: File | undefined) => void;
}

export function PowerImageUpload({ 
  image, 
  onImageChange,
  pendingImageFile,
  onPendingImageChange
}: PowerImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = useCallback((file: File) => {
    // Validações básicas
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error("Imagem muito grande. Limite de 2MB.");
      return;
    }

    onPendingImageChange(file);
  }, [onPendingImageChange]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleSelectFile(file);
  };

  const removeImage = () => {
    onImageChange(undefined);
    onPendingImageChange(undefined);
  };

  const hasImage = !!image || !!pendingImageFile;

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
        <ImageIcon className="h-3 w-3" /> Imagem de Capa
      </label>
      
      <div className="relative group">
        {hasImage ? (
          <div className={`flex items-center justify-between h-10 px-3 border animate-in fade-in zoom-in-95 duration-200 ${
            pendingImageFile ? "border-blue-500/30 bg-blue-500/5" : "border-emerald-500/30 bg-emerald-500/5"
          }`}>
            <div className="flex items-center gap-2">
              <div className={`h-5 w-5 flex items-center justify-center ${
                pendingImageFile ? "bg-blue-500/20" : "bg-emerald-500/20"
              }`}>
                {pendingImageFile ? (
                  <Upload className="h-3 w-3 text-blue-500" />
                ) : (
                  <Check className="h-3 w-3 text-emerald-500" />
                )}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                pendingImageFile ? "text-blue-500/80" : "text-emerald-500/80"
              }`}>
                {pendingImageFile ? "Arquivo Selecionado" : "Imagem Carregada"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                className={`h-7 px-2 text-[9px] font-bold uppercase rounded-none ${
                    pendingImageFile ? "hover:bg-blue-500/10 text-blue-600" : "hover:bg-emerald-500/10 text-emerald-600"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                Trocar
              </Button>
              <div className="w-[1px] h-3 bg-white/10" />
              <Button
                variant="ghost"
                className="h-7 px-2 text-[9px] font-bold uppercase hover:bg-red-500/10 text-red-500 rounded-none"
                onClick={removeImage}
              >
                Remover
              </Button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="h-10 border border-dashed border-white/10 bg-black/20 flex items-center px-3 gap-3 cursor-pointer hover:bg-black/30 hover:border-blue-500/30 transition-all group"
          >
            <Upload className="h-3.5 w-3.5 text-zinc-500 group-hover:text-blue-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300">
              Adicionar Imagem de Capa
            </span>
            <span className="text-[9px] text-zinc-600 ml-auto">
              Máx 2MB
            </span>
          </div>
        )}
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={onFileChange}
          accept="image/*"
        />
      </div>
    </div>
  );
}

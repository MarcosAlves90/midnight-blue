"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PowerService } from "@/services/power-service";
import { toast } from "@/lib/toast";

interface PowerImageUploadProps {
  image?: { url: string; publicId: string };
  onImageChange: (image: { url: string; publicId: string } | undefined) => void;
}

export function PowerImageUpload({ image, onImageChange }: PowerImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    // Validações básicas
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error("Imagem muito grande. Limite de 2MB.");
      return;
    }

    setUploading(true);
    try {
      const result = await PowerService.uploadPowerCover(
        file, 
        image?.publicId
      );

      if (result) {
        onImageChange(result);
        toast.success("Imagem carregada com sucesso!");
      } else {
        toast.error("Falha ao carregar imagem.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar imagem.");
    } finally {
      setUploading(false);
    }
  }, [image, onImageChange]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const removeImage = () => {
    // Não deletamos do Cloudinary aqui para permitir desfazer ou cancelar o builder
    // Apenas removemos do estado local
    onImageChange(undefined);
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
        <ImageIcon className="h-3 w-3" /> Imagem de Capa
      </label>
      
      <div className="relative group">
        {image ? (
          <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/40">
            <Image 
              src={image.url} 
              alt="Capa do Poder" 
              fill
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Trocar"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={removeImage}
                disabled={uploading}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-video rounded-lg border-2 border-dashed border-white/10 bg-black/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-black/30 hover:border-blue-500/50 transition-all group"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            ) : (
              <>
                <div className="p-3 rounded-full bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                  <Upload className="h-5 w-5 text-zinc-500 group-hover:text-blue-500" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Clique para Upload
                </span>
                <span className="text-[9px] text-zinc-600">
                  Resolução sugerida: 1200x675 (16:9)
                </span>
              </>
            )}
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

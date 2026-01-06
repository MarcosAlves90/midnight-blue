import React from "react";
import { Search, Home, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Folder {
  id: string;
  name: string;
}

interface GalleryLayoutProps {
  title: string;
  description: React.ReactNode;
  searchPlaceholder?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  actions?: React.ReactNode;
  currentFolderId: string | null;
  folderPath: Folder[];
  onFolderClick: (folderId: string | null) => void;
  children: React.ReactNode;
}

export function GalleryLayout({
  title,
  description,
  searchPlaceholder = "Pesquisar...",
  searchQuery,
  onSearchChange,
  actions,
  currentFolderId,
  folderPath,
  onFolderClick,
  children,
}: GalleryLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">{title}</h1>
          <div className="text-muted-foreground">
            {description}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm font-mono overflow-x-auto pb-2 scrollbar-hide uppercase">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFolderClick(null)}
          className={cn(
            "h-8 px-2 flex items-center gap-1.5 uppercase",
            !currentFolderId ? "text-primary font-bold" : "text-muted-foreground"
          )}
        >
          <Home className="w-3.5 h-3.5" />
          RAIZ
        </Button>

        {folderPath.map((folder, index) => (
          <div key={`breadcrumb-${folder.id}`} className="flex items-center gap-2">
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFolderClick(folder.id)}
              className={cn(
                "h-8 px-2 flex items-center gap-1.5 uppercase",
                index === folderPath.length - 1 ? "text-primary font-bold" : "text-muted-foreground"
              )}
            >
              {folder.name.toUpperCase()}
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  FolderPlus, 
  ChevronRight,
  Home,
  Plus,
  StickyNote
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotesState, useNotesActions } from "./use-notes";
import { useSelectedCharacter } from "@/hooks/use-selected-character";
import { NoteCard } from "./note-card";
import { FolderCard } from "@/components/ui/custom/folder-card";
import { NewNoteDialog } from "./new-note-dialog";
import { NewFolderDialog } from "./new-folder-dialog";
import { DeleteFolderDialog } from "./delete-folder-dialog";
import { NoteEditorDialog } from "./note-editor-dialog";

export default function NotesGallery() {
  const { user } = useAuth();
  const { character, isLoading: isCharLoading } = useSelectedCharacter();
  const state = useNotesState();
  const { 
    setNotes, 
    setFolders,
    setIsLoading, 
    setError, 
    searchQuery,
    setSearchQuery,
    currentFolderId,
    setCurrentFolderId,
    noteDialogOpen,
    setNoteDialogOpen,
    folderDialogOpen,
    setFolderDialogOpen,
    deleteFolderDialogOpen,
    setDeleteFolderDialogOpen,
    folderToDelete,
    setFolderToDelete,
    selectedNote,
    editorOpen,
    setEditorOpen
  } = state;

  const { 
    listenToNotes,
    listenToFolders,
    handleCreateNote,
    handleUpdateNote,
    handleDeleteNote,
    handleCreateFolder,
    handleDeleteFolder,
    openEditor
  } = useNotesActions(user?.uid || null, character?.id || null, state);

  // Escuta mudanças em tempo real
  useEffect(() => {
    if (!user?.uid || !character?.id) {
      if (!isCharLoading && !character) {
        setIsLoading(false);
      }
      return;
    }

    let unsubscribeNotes: (() => void) | undefined;
    let unsubscribeFolders: (() => void) | undefined;

    try {
      setIsLoading(true);
      unsubscribeNotes = listenToNotes((notes) => {
        setNotes(notes);
        setError(null);
        setIsLoading(false);
      });

      unsubscribeFolders = listenToFolders((folders) => {
        setFolders(folders);
      });
    } catch (err) {
      console.error("Erro ao escutar mudanças:", err);
      setError("Erro ao carregar anotações");
      setIsLoading(false);
    }

    return () => {
      if (unsubscribeNotes) unsubscribeNotes();
      if (unsubscribeFolders) unsubscribeFolders();
    };
  }, [user?.uid, character, isCharLoading, listenToNotes, listenToFolders, setNotes, setFolders, setError, setIsLoading]);

  // Breadcrumb logic
  const getFolderPath = (folderId: string | null) => {
    const path = [];
    let currentId = folderId;
    while (currentId) {
      const folder = state.folders.find(f => f.id === currentId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parentId || null;
      } else {
        break;
      }
    }
    return path;
  };

  const folderPath = getFolderPath(currentFolderId);

  const filteredFolders = state.folders.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesParent = (f.parentId || null) === currentFolderId;
    return matchesSearch && matchesParent;
  });

  const filteredNotes = state.notes.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFolder = (note.folderId || null) === currentFolderId;
    
    return matchesSearch && matchesFolder;
  });

  const hasResults = filteredFolders.length > 0 || filteredNotes.length > 0;

  if (state.isLoading || isCharLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-3">
          <div className="animate-pulse text-primary font-mono">CARREGANDO TERMINAL DE NOTAS...</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center space-y-4">
        <StickyNote className="w-12 h-12 text-muted-foreground opacity-20" />
        <h2 className="text-xl font-bold uppercase tracking-tighter">Nenhum Personagem Selecionado</h2>
        <p className="text-muted-foreground max-w-xs">
          Selecione um personagem no menu lateral para visualizar ou criar anotações específicas para ele.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">Anotações</h1>
          <p className="text-muted-foreground">
            Notas de <span className="text-primary font-bold">{character.identity.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setFolderDialogOpen(true)} className="h-9">
            <FolderPlus className="w-4 h-4 mr-2" />
            Nova Pasta
          </Button>
          <Button size="sm" onClick={() => setNoteDialogOpen(true)} className="h-9">
            <Plus className="w-4 h-4 mr-2" />
            Nova Nota
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar em notas..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm font-mono overflow-x-auto pb-2 scrollbar-hide uppercase">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentFolderId(null)}
          className={cn(
            "h-8 px-2 flex items-center gap-1.5 uppercase",
            !currentFolderId ? "text-primary font-bold" : "text-muted-foreground"
          )}
        >
          <Home className="w-3.5 h-3.5" />
          RAIZ
        </Button>

        {folderPath.map((folder, index) => (
          <div key={folder.id} className="flex items-center gap-2">
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentFolderId(folder.id)}
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

      <NewNoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        onCreate={handleCreateNote}
        currentFolderId={currentFolderId}
      />

      <NewFolderDialog
        open={folderDialogOpen}
        onOpenChange={setFolderDialogOpen}
        onCreate={handleCreateFolder}
        parentId={currentFolderId}
      />

      <DeleteFolderDialog
        open={deleteFolderDialogOpen}
        folderName={folderToDelete?.name || ""}
        onOpenChange={setDeleteFolderDialogOpen}
        onConfirm={async () => {
          if (folderToDelete) {
            await handleDeleteFolder(folderToDelete.id);
            if (currentFolderId === folderToDelete.id) {
              setCurrentFolderId(folderToDelete.parentId || null);
            }
          }
        }}
      />

      <NoteEditorDialog
        note={selectedNote}
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSave={handleUpdateNote}
        onDelete={handleDeleteNote}
      />

      {state.error && (
        <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-lg text-sm font-mono">
          {state.error}
        </div>
      )}

      {state.notes.length === 0 && state.folders.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/10">
          <StickyNote className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-lg font-medium uppercase tracking-tighter">Nenhuma anotação ainda</h3>
          <p className="text-muted-foreground mb-6">Comece a organizar suas ideias agora mesmo.</p>
          <Button onClick={() => setNoteDialogOpen(true)}>
            Criar minha primeira nota
          </Button>
        </div>
      ) : !hasResults ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Search className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-lg font-medium">Nenhum item encontrado</h3>
          <p className="text-muted-foreground">Tente ajustar sua pesquisa ou filtro.</p>
          <Button variant="link" onClick={() => { setSearchQuery(""); setCurrentFolderId(null); }}>
            Limpar filtros
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {/* Render Folders */}
          {filteredFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              label="Acessar Notas"
              onClick={() => setCurrentFolderId(folder.id)}
              onDelete={() => {
                setFolderToDelete(folder);
                setDeleteFolderDialogOpen(true);
              }}
            />
          ))}

          {/* Render Notes */}
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => openEditor(note)}
              onDelete={() => handleDeleteNote(note.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

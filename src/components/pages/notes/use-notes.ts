import { useState, useCallback } from "react";
import { Note, NoteFolder, noteService } from "@/lib/note-service";

export function useNotesState() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<NoteFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<NoteFolder | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  return {
    notes, setNotes,
    folders, setFolders,
    isLoading, setIsLoading,
    error, setError,
    searchQuery, setSearchQuery,
    currentFolderId, setCurrentFolderId,
    noteDialogOpen, setNoteDialogOpen,
    folderDialogOpen, setFolderDialogOpen,
    deleteFolderDialogOpen, setDeleteFolderDialogOpen,
    folderToDelete, setFolderToDelete,
    selectedNote, setSelectedNote,
    editorOpen, setEditorOpen
  };
}

export function useNotesActions(
  userId: string | null,
  characterId: string | null,
  state: ReturnType<typeof useNotesState>
) {
  const { 
    setError, 
    setNoteDialogOpen,
    setFolderDialogOpen,
    setEditorOpen,
    setSelectedNote
  } = state;

  const listenToNotes = useCallback((callback: (notes: Note[]) => void) => {
    if (!userId || !characterId) return () => {};
    return noteService.listenToNotes(userId, characterId, callback);
  }, [userId, characterId]);

  const listenToFolders = useCallback((callback: (folders: NoteFolder[]) => void) => {
    if (!userId || !characterId) return () => {};
    return noteService.listenToFolders(userId, characterId, callback);
  }, [userId, characterId]);

  const handleCreateNote = async (title: string, content: string, folderId: string | null) => {
    if (!userId || !characterId) return;
    try {
      await noteService.createNote(userId, characterId, { title, content, folderId });
      setNoteDialogOpen(false);
    } catch (err) {
      console.error("Erro ao criar nota:", err);
      setError("Erro ao criar nota");
    }
  };

  const handleUpdateNote = async (noteId: string, updates: Partial<Note>) => {
    if (!userId) return;
    try {
      await noteService.updateNote(userId, noteId, updates);
    } catch (err) {
      console.error("Erro ao atualizar nota:", err);
      setError("Erro ao atualizar nota");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!userId) return;
    try {
      await noteService.deleteNote(userId, noteId);
    } catch (err) {
      console.error("Erro ao deletar nota:", err);
      setError("Erro ao deletar nota");
    }
  };

  const handleCreateFolder = async (name: string, parentId: string | null) => {
    if (!userId || !characterId) return;
    try {
      await noteService.createFolder(userId, characterId, name, parentId);
      setFolderDialogOpen(false);
    } catch (err) {
      console.error("Erro ao criar pasta:", err);
      setError("Erro ao criar pasta");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!userId) return;
    try {
      await noteService.deleteFolder(userId, folderId);
    } catch (err) {
      console.error("Erro ao deletar pasta:", err);
      setError("Erro ao deletar pasta");
    }
  };

  const handleMoveNote = async (noteId: string, folderId: string | null) => {
    if (!userId) return;
    try {
      await noteService.moveNoteToFolder(userId, noteId, folderId);
    } catch (err) {
      console.error("Erro ao mover nota:", err);
      setError("Erro ao mover nota");
    }
  };

  const openEditor = (note: Note) => {
    setSelectedNote(note);
    setEditorOpen(true);
  };

  return {
    listenToNotes,
    listenToFolders,
    handleCreateNote,
    handleUpdateNote,
    handleDeleteNote,
    handleCreateFolder,
    handleDeleteFolder,
    handleMoveNote,
    openEditor
  };
}

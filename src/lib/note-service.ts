import {
  doc,
  collection,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const USERS_COLLECTION = "users";
const NOTES_SUBCOLLECTION = "notes";
const FOLDERS_SUBCOLLECTION = "note_folders";

export interface Note {
  id: string;
  userId: string;
  characterId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  folderId?: string | null;
}

export interface NoteFolder {
  id: string;
  userId: string;
  characterId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string | null;
}

function toDateSafe(value: unknown): Date {
  const candidate = value as { toDate?: () => Date } | undefined;
  if (candidate && typeof candidate.toDate === "function") return candidate.toDate();
  if (value instanceof Date) return value;
  return new Date();
}

export const noteService = {
  listenToNotes: (userId: string, characterId: string, callback: (notes: Note[]) => void): Unsubscribe => {
    const notesRef = collection(db, USERS_COLLECTION, userId, NOTES_SUBCOLLECTION);
    const q = query(
      notesRef, 
      where("characterId", "==", characterId),
      orderBy("updatedAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: toDateSafe(data.createdAt),
          updatedAt: toDateSafe(data.updatedAt),
        } as Note;
      });
      callback(notes);
    });
  },

  listenToFolders: (userId: string, characterId: string, callback: (folders: NoteFolder[]) => void): Unsubscribe => {
    const foldersRef = collection(db, USERS_COLLECTION, userId, FOLDERS_SUBCOLLECTION);
    const q = query(
      foldersRef, 
      where("characterId", "==", characterId),
      orderBy("name", "asc")
    );

    return onSnapshot(q, (snapshot) => {
      const folders = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: toDateSafe(data.createdAt),
          updatedAt: toDateSafe(data.updatedAt),
        } as NoteFolder;
      });
      callback(folders);
    });
  },

  createNote: async (userId: string, characterId: string, note: Partial<Note>) => {
    const notesRef = collection(db, USERS_COLLECTION, userId, NOTES_SUBCOLLECTION);
    const docRef = await addDoc(notesRef, {
      ...note,
      userId,
      characterId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  updateNote: async (userId: string, noteId: string, updates: Partial<Note>) => {
    const noteRef = doc(db, USERS_COLLECTION, userId, NOTES_SUBCOLLECTION, noteId);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  deleteNote: async (userId: string, noteId: string) => {
    const noteRef = doc(db, USERS_COLLECTION, userId, NOTES_SUBCOLLECTION, noteId);
    await deleteDoc(noteRef);
  },

  createFolder: async (userId: string, characterId: string, name: string, parentId: string | null = null) => {
    const foldersRef = collection(db, USERS_COLLECTION, userId, FOLDERS_SUBCOLLECTION);
    const docRef = await addDoc(foldersRef, {
      name,
      parentId,
      userId,
      characterId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  deleteFolder: async (userId: string, folderId: string) => {
    const folderRef = doc(db, USERS_COLLECTION, userId, FOLDERS_SUBCOLLECTION, folderId);
    await deleteDoc(folderRef);
    
    // Optional: Move notes in this folder to root or delete them
    // For now, let's just leave them or handle in UI
  },

  updateFolder: async (userId: string, folderId: string, name: string) => {
    const folderRef = doc(db, USERS_COLLECTION, userId, FOLDERS_SUBCOLLECTION, folderId);
    await updateDoc(folderRef, {
      name,
      updatedAt: serverTimestamp(),
    });
  },

  moveNoteToFolder: async (userId: string, noteId: string, folderId: string | null) => {
    const noteRef = doc(db, USERS_COLLECTION, userId, NOTES_SUBCOLLECTION, noteId);
    await updateDoc(noteRef, {
      folderId,
      updatedAt: serverTimestamp(),
    });
  }
};

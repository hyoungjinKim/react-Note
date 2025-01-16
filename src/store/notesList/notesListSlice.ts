import { createSlice } from "@reduxjs/toolkit";
import notes from "../../notesData";
import { Note } from "../../types/note";

const getStoredNotes = (key: string, defaultValue: Note[]) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

const saveToLocalStorage = (key: string, data: Note[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

interface NoteState {
  mainNotes: Note[];
  archiveNotes: Note[];
  trashNotes: Note[];
  editNote: null | Note;
}

const initialState: NoteState = {
  mainNotes: getStoredNotes("mainNotes", [...notes]),
  archiveNotes: getStoredNotes("archiveNotes", []),
  trashNotes: getStoredNotes("trashNotes", []),
  editNote: null,
};

enum noteType {
  mainNotes = "mainNotes",
  archiveNotes = "archiveNotes",
  trashNotes = "trashNotes",
}

const notesListSlice = createSlice({
  name: "notesList",
  initialState,
  reducers: {
    setMainNotes: (state, { payload }) => {
      if (state.mainNotes.find(({ id }) => id === payload.id)) {
        state.mainNotes = state.mainNotes.map((note) =>
          note.id === payload.id ? payload : note
        );
      } else {
        state.mainNotes.push(payload);
      }
      saveToLocalStorage("mainNotes", state.mainNotes);
    },
    setTrashNotes: (state, { payload }) => {
      state.mainNotes = state.mainNotes.filter(({ id }) => id !== payload.id);
      state.archiveNotes = state.archiveNotes.filter(
        ({ id }) => id !== payload.id
      );
      state.trashNotes.push({ ...payload, isPinned: false });

      saveToLocalStorage("mainNotes", state.mainNotes);
      saveToLocalStorage("archiveNotes", state.archiveNotes);
      saveToLocalStorage("trashNotes", state.trashNotes);
    },
    setArchiveNotes: (state, { payload }) => {
      state.mainNotes = state.mainNotes.filter(({ id }) => id !== payload.id);
      state.archiveNotes.push({ ...payload, isPinned: false });

      saveToLocalStorage("mainNotes", state.mainNotes);
      saveToLocalStorage("archiveNotes", state.archiveNotes);
    },
    unArchiveNote: (state, { payload }) => {
      state.archiveNotes = state.archiveNotes.filter(
        ({ id }) => id !== payload.id
      );
      state.mainNotes.push(payload);

      saveToLocalStorage("mainNotes", state.mainNotes);
      saveToLocalStorage("archiveNotes", state.archiveNotes);
    },
    restoreNote: (state, { payload }) => {
      state.trashNotes = state.trashNotes.filter(({ id }) => id !== payload.id);
      state.mainNotes.push(payload);

      saveToLocalStorage("mainNotes", state.mainNotes);
      saveToLocalStorage("trashNotes", state.trashNotes);
    },
    deleteNote: (state, { payload }) => {
      state.trashNotes = state.trashNotes.filter(({ id }) => id !== payload.id);
      saveToLocalStorage("trashNotes", state.trashNotes);
    },
    setPinnedNotes: (state, { payload }) => {
      state.mainNotes = state.mainNotes.map((note) =>
        note.id === payload.id ? { ...note, isPinned: !note.isPinned } : note
      );
      saveToLocalStorage("mainNotes", state.mainNotes);
    },
    setEditNote: (state, { payload }) => {
      state.editNote = payload;
    },
    readNote: (state, { payload }) => {
      const { type, id } = payload;
      const setRead = (notes: noteType) => {
        state[notes] = state[notes].map((note: Note) =>
          note.id === id ? { ...note, isRead: !note.isRead } : note
        );
        saveToLocalStorage(notes, state[notes]);
      };

      if (type === "archive") {
        setRead(noteType.archiveNotes);
      } else if (type === "trash") {
        setRead(noteType.trashNotes);
      } else {
        setRead(noteType.mainNotes);
      }
    },
    removeTags: (state, { payload }) => {
      state.mainNotes = state.mainNotes.map((note) => ({
        ...note,
        tags: note.tags.filter(({ tag }) => tag !== payload.tag),
      }));

      saveToLocalStorage("mainNotes", state.mainNotes);
    },
  },
});

export const {
  setMainNotes,
  setTrashNotes,
  setArchiveNotes,
  unArchiveNote,
  restoreNote,
  deleteNote,
  setPinnedNotes,
  setEditNote,
  readNote,
  removeTags,
} = notesListSlice.actions;

export default notesListSlice.reducer;

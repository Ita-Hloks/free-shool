import type { LeaveNote } from "../components/type/leaveApplicationProp.ts";

const STORAGE_KEY = "leaveNotes";

export const getLeaveNotes = (): LeaveNote[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const setLeaveNotes = (notes: LeaveNote[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const saveLeaveNote = (note: LeaveNote) => {
  const existing = getLeaveNotes();
  existing.push(note);
  setLeaveNotes(existing);
};

export const getLeaveNoteById = (id: string): LeaveNote | undefined => {
  const notes = getLeaveNotes();
  return notes.find(note => note.id === id);
};

export const updateLeaveNote = (note: LeaveNote): boolean => {
  const notes = getLeaveNotes();
  const index = notes.findIndex(item => item.id === note.id);
  if (index === -1) {
    return false;
  }
  notes[index] = note;
  setLeaveNotes(notes);
  return true;
};

export const removeLeaveNoteById = (id: string): boolean => {
  const notes = getLeaveNotes();
  const next = notes.filter(note => note.id !== id);
  if (next.length === notes.length) {
    return false;
  }
  setLeaveNotes(next);
  return true;
};

type HistoryField = "studentName" | "location";

export const getHistoryValues = (field: HistoryField): string[] => {
  const notes = getLeaveNotes();
  const seen = new Set<string>();
  const values: string[] = [];

  notes.forEach(note => {
    const value = note[field]?.trim();
    if (value && !seen.has(value)) {
      seen.add(value);
      values.push(value);
    }
  });

  return values;
};

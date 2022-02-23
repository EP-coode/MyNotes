import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Note } from "../../api/interfaces/note";
import { NotesFilter } from "../../api/interfaces/notesFilter";
import { getNotes } from "../../api/Repositories/notes";

interface NotesSate {
  notes: Note[];
  page: number;
  status: "idle" | "loading" | "error" | "succes";
  error: any;
}

const initialState: NotesSate = {
  notes: [],
  page: 0,
  status: "idle",
  error: null,
};

export const fetchNotes = createAsyncThunk<
  Note[],
  { acces_token: string; filters: NotesFilter }
>("notes/fetchNotes", async ({ acces_token, filters }) => {
  const notes = await getNotes(acces_token, filters);
  return notes;
});

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchNotes.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchNotes.fulfilled, (state, action) => {
      state.status = "succes";
    });
    builder.addCase(fetchNotes.rejected, (state, action) => {
      state.status = "error";
    });
  }
});
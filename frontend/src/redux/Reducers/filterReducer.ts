import { createSlice } from "@reduxjs/toolkit";
import { NotesFilter } from "../../api/interfaces/notesFilter";

const initialState: NotesFilter = {
  limit: 15,
  page: 0,
  phrase: undefined,
  orderByDateAsc: false,
  categories: undefined,
};

export const filterSlice = createSlice({
  name: "notesFilters",
  initialState,
  reducers: {},
});

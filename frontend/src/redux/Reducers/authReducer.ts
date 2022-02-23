import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login } from "../../api/services/auth";
import client from "../../api/httpClient/client";
import { AuthResponse } from "../../api/interfaces/auth";
import { RootState } from "../store";

interface AuthState {
  userId: number;
  userEmail: string;
  refresh_token: string;
  acces_token: string;
  status: "idle" | "loading" | "error" | "succes";
}

const initialState: AuthState = {
  userId: -1,
  userEmail: "",
  refresh_token: "",
  acces_token: "",
  status: "idle",
};

const loginUser = createAsyncThunk<
  AuthResponse | any,
  {
    email: string;
    password: string;
  }
>("auth/loginUser", async ({ email, password }) => {
  return login("")
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export const {} = authSlice.actions;

export const selectAuth = (state: RootState) => state;

export default authSlice.reducer;

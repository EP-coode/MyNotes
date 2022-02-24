import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthResponse } from "../../api/interfaces/auth";
import { login, logout, refresh, register } from "../../api/services/auth";
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
  refresh_token: localStorage.getItem("rt") || "",
  acces_token: localStorage.getItem("at") || "",
  status: "idle",
};

const loginUser = createAsyncThunk<
  AuthResponse,
  {
    email: string;
    password: string;
  }
>("auth/loginUser", async ({ email, password }) => {
  const res = await login(email, password);
  localStorage.setItem("rt", res.refresh_token);
  localStorage.setItem("at", res.acces_token);
  return res;
});

const refreshUser = createAsyncThunk<AuthResponse, string>(
  "auth/refreshUser",
  async (refreshToken) => {
    const res = await refresh(refreshToken);
    localStorage.setItem("rt", res.refresh_token);
    localStorage.setItem("at", res.acces_token);
    return res;
  }
);

const logoutUser = createAsyncThunk<
  AuthResponse | any,
  any,
  { state: RootState }
>("auth/logoutUser", async (_, { getState }) => {
  const state = getState();
  return logout(state.auth.acces_token);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { acces_token, refresh_token } = action.payload;
        state.status = "succes";
        state.acces_token = acces_token;
        state.refresh_token = refresh_token;
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = "error";
      })
      .addCase(refreshUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        const { acces_token, refresh_token } = action.payload;
        state.status = "succes";
        state.acces_token = acces_token;
        state.refresh_token = refresh_token;
      })
      .addCase(refreshUser.rejected, (state) => {
        state.status = "error";
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succes";
        state.acces_token = "";
        state.refresh_token = "";
      })
      .addCase(logoutUser.rejected, (state) => {
        state.status = "error";
      });
  },
});

export const {} = authSlice.actions;

export const selectAuth = (state: RootState) => state;

export default authSlice.reducer;

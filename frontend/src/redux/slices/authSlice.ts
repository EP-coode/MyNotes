import { createSlice } from "@reduxjs/toolkit";

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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

  }
})
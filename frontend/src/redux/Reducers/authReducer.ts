import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { AuthResponse } from "../../api/interfaces/auth";
import { login, logout, refresh, register } from "../../api/services/auth";
import { RootState, store } from "../store";
import jwt_decode from "jwt-decode";

interface AuthState {
  userId: number;
  userEmail: string;
  refresh_token: string;
  acces_token: string;
  iat: number;
  exp: number;
  status: "loggedout" | "loading" | "error" | "loggedin";
}

const initialState: AuthState = {
  userId: -1,
  userEmail: "",
  refresh_token: localStorage.getItem("rt") || "",
  acces_token: localStorage.getItem("at") || "",
  iat: -1,
  exp: -1,
  status: "lo",
};

const loginUserAction =
  (
    email: string,
    password: string
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(authSlice.actions.loginInProgres());
    try {
      const res = await login(email, password);
      localStorage.setItem("rt", res.refresh_token);
      localStorage.setItem("at", res.acces_token);
      dispatch(authSlice.actions.loginSucces(res));
    } catch (err) {
      dispatch(authSlice.actions.loginFail())
    }
  };

const logoutUserAction =
  (): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    const state = getState();
    const res = await logout(state.auth.acces_token);
    localStorage.removeItem("rt");
    localStorage.removeItem("at");
  };

const refreshUserAction =
  (): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    const state = getState();
    const res = await refresh(state.auth.refresh_token);
    localStorage.setItem("rt", res.refresh_token);
    localStorage.setItem("at", res.acces_token);
  };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSucces: (state, action: PayloadAction<AuthResponse>) => {
      const { refresh_token, acces_token } = action.payload;
      state.acces_token = acces_token;
      state.refresh_token = refresh_token;
      const {
        sub,
        email,
        iat,
        exp,
      }: { sub: number; email: string; iat: number; exp: number } =
        jwt_decode(acces_token);
      state.userEmail = email;
      state.userId = sub;
      state.iat = iat;
      state.exp = exp;
      state.status = "succes";
    },
    logout: (state) => {
      // czy to jest bezpieczne???
      state = initialState;
      state.status = "idle";
    },
    loginInProgres: (state) => {
      state.status = "loading";
    },
    loginFail: (state) => {
      state.status = "error";
    },
  },
  extraReducers: (builder) => {},
});

export const {} = authSlice.actions;

export const selectAuth = (state: RootState) => state;

export default authSlice.reducer;

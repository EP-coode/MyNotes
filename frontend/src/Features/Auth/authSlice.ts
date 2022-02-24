import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
import { request } from "../../httpClient/client";
import { RootState } from "../../redux/store";
import { ErrorResponse } from "../Common/interfaces/errorResponse";
import { AuthRequest } from "./interfaces/authRequest";
import { AuthResponse } from "./interfaces/authResponse";

interface AuthState {
  userId: number;
  userEmail: string;
  iat: number;
  exp: number;
  refresh_token: string;
  acces_token: string;
  status: "loggedout" | "loading" | "error" | "loggedin";
  message: string[];
}

const initialState: AuthState = {
  userId: -1,
  userEmail: "",
  refresh_token: "",
  acces_token: "",
  iat: -1,
  exp: -1,
  status: "loggedout",
  message: [],
};

const login =
  (
    email: string,
    password: string
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(authSlice.actions.authInProgres());
    try {
      const payload = { email, password };
      const [data, ok] = await request<AuthResponse, AuthRequest>(
        "/auth/login",
        "POST",
        payload
      );

      if (ok) {
        dispatch(authSlice.actions.authSucces(data as AuthResponse));
      } else {
        const { error, statusCode, message } = data as ErrorResponse;
        dispatch(authSlice.actions.authFail(message));
      }
    } catch (err) {
      console.error(err);
      dispatch(authSlice.actions.authFail(["Unknown error"]));
    }
  };

const logout =
  (): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    const state = getState();
    const at = state.auth.acces_token;
    try {
      const [data, ok] = await request("/auth/logout", "POST", undefined, {
        Authorization: `Bearer ${at}`,
      });
      if (ok) {
        dispatch(authSlice.actions.logout());
      }
    } catch (err) {
      console.error(err);
    }
  };

const refresh =
  (): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    dispatch(authSlice.actions.authInProgres());
    try {
      const state = getState();
      const rt = state.auth.refresh_token;
      const [data, ok] = await request("/auth/refresh", "POST", undefined, {
        Authorization: `Bearer ${rt}`,
      });
      if (ok) {
        dispatch(authSlice.actions.authSucces(data as AuthResponse));
      }
    } catch (err) {
      console.error(err);
    }
  };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authSucces: (state, action: PayloadAction<AuthResponse>) => {
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
      state.status = "loggedin";
    },
    logout: (state) => {
      // czy to jest bezpieczne???
      state = initialState;
      state.status = "loggedout";
    },
    authInProgres: (state) => {
      state.status = "loading";
    },
    authFail: (state, action: PayloadAction<string[]>) => {
      state.message = action.payload;
      state.status = "error";
    },
  },
  extraReducers: (builder) => {},
});

export const {} = authSlice.actions;

export const selectAuth = (state: RootState) => state;

export default authSlice.reducer;

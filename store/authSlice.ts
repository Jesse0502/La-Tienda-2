import jwt from "jsonwebtoken";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "./store";
import axios from "axios";

export const handleSignup: any = createAsyncThunk("signup", async (payload) => {
  try {
    const res = await axios.post(`/api/auth`, { data: payload });
    return res;
  } catch (err) {
    return err;
  }
});

export const handleLogin: any = createAsyncThunk("login", async (payload) => {
  try {
    const res = await axios.post(`/api/auth/login`, { data: payload });
    return res;
  } catch (err) {
    return err;
  }
});

export interface UserInterface {
  email: string;
  id: string;
  name: string;
  iat: number;
  exp: number;
  profilePicture: string;
}

export interface AuthState {
  user: UserInterface | null;
}

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handleSignup.fulfilled, (state, action) => {
      const user: any = jwt.decode(action.payload.data.token);
      state.user = user;
    });
    builder.addCase(handleLogin.fulfilled, (state, action) => {
      const user: any = jwt.decode(action.payload.data.token);
      state.user = user;
    });
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;

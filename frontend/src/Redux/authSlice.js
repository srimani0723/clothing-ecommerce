import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";
import { mergeCartWithServer } from "./cartSlice";

const savedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  user: savedUser,
  loading: false,
  error: null,
};

// REGISTER (unchanged example)
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

// LOGIN: now also merges guest cart from localStorage after success
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      // 1) Login request
      const res = await api.post("/auth/login", data);

      // 2) Read guest cart from localStorage
      const raw = localStorage.getItem("cartItems");
      const localCartItems = raw ? JSON.parse(raw) : [];

      // 3) If guest cart not empty, merge into server cart
      if (localCartItems.length > 0) {
        await dispatch(mergeCartWithServer(localCartItems));
      }

      // 4) Return auth payload (user, token, etc.)
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// LOGOUT (unchanged example)
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/logout");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("user");
      });
  },
});

export default authSlice.reducer;

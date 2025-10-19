import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  rememberMe: false,
  credentials: { email: '', password: '' },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token, rememberMe } = action.payload;
      state.user = user;
      state.token = token;
      state.rememberMe = rememberMe;
      
      // Clear credentials if remember me is not checked
      if (!rememberMe) {
        state.credentials = { email: '', password: '' };
      }
    },
    setCredentials: (state, action) => {
      const { email, password } = action.payload;
      state.credentials = { email, password };
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
      
      // Clear credentials when unchecking remember me
      if (!action.payload) {
        state.credentials = { email: '', password: '' };
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, setCredentials, setRememberMe, logout } = authSlice.actions;

export const selectRememberMe = (state) => state.auth.rememberMe;
export const selectCredentials = (state) => state.auth.credentials;

export default authSlice.reducer;

// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
  isAdmin: JSON.parse(localStorage.getItem("isAdmin")) || false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
      localStorage.setItem("isAdmin", JSON.stringify(action.payload));
    },
  },
});

export const { setCurrentUser, setIsAdmin } = userSlice.actions;
export default userSlice.reducer;

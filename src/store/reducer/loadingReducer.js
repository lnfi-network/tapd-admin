import { createSlice } from "@reduxjs/toolkit";
export const loadingSlice = createSlice({
  name: "modal",
  initialState: {
    enableTradingLoading: false
  },
  reducers: {
    setEnableTradingLoading(state, action) {
      state.enableTradingLoading = action.payload;
    }
  }
});
export const { setEnableTradingLoading } = loadingSlice.actions;
export default loadingSlice.reducer;

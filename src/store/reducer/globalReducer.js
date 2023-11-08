import { createSlice } from "@reduxjs/toolkit";
import * as Lockr from "lockr";
export const globalSlice = createSlice({
  name: "global",
  initialState: {
    userName: Lockr.get('userName'),
    grpcHost: Lockr.get('grpcHost'),
    hosts: [],
    hasInitHost: true
  },
  reducers: {
    setUserName(state, action) {
      state.userName = action.payload;
      Lockr.set('userName', action.payload)
    },
    setGrpcHost(state, action) {
      state.grpcHost = action.payload;
      Lockr.set('grpcHost', action.payload)
    },
    handleInitHost(state, action) {
      state.hasInitHost = action.payload
    },
    setAllHosts(state, action) {
      state.hosts = action.payload
      if (!state.grpcHost && state.hosts.length > 0) {
        state.grpcHost = state.hosts[0];
        state.hasInitHost = true
        Lockr.set('grpcHost', state.hosts[0])
      }
    }
  }
});
export const { setUserName, setGrpcHost, setAllHosts, handleInitHost } = globalSlice.actions;
export default globalSlice.reducer;

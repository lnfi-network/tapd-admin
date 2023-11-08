import { configureStore } from "@reduxjs/toolkit";

import loadingReducer from "./reducer/loadingReducer";
import globalReducer from "./reducer/globalReducer";
const store = configureStore({
  reducer: {
    loadings: loadingReducer,
    global: globalReducer
  }
});
export default store;

import { configureStore } from "@reduxjs/toolkit";
import websocketSlice from "./web-sockets/websocket-slice";
import authSlice from "./auth/auth-slice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    websocket: websocketSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

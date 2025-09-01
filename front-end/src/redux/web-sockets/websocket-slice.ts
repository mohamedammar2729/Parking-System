/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  subscribedGateId: string | null;
  lastMessage: any;
  connectionAttempts: number;
  lastError: string | null;
  connectionStatus: "connected" | "connecting" | "disconnected" | "error";
}

const initialState: WebSocketState = {
  isConnected: false,
  isConnecting: false,
  subscribedGateId: null,
  lastMessage: null,
  connectionAttempts: 0,
  lastError: null,
  connectionStatus: "disconnected",
};

const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      state.connectionStatus = action.payload ? "connected" : "disconnected";
      if (action.payload) {
        state.lastError = null;
      }
    },
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.isConnecting = action.payload;
      state.connectionStatus = action.payload
        ? "connecting"
        : state.connectionStatus;
    },
    setSubscribedGate: (state, action: PayloadAction<string | null>) => {
      state.subscribedGateId = action.payload;
    },
    setLastMessage: (state, action: PayloadAction<any>) => {
      state.lastMessage = action.payload;
    },
    incrementConnectionAttempts: (state) => {
      state.connectionAttempts += 1;
    },
    resetConnectionAttempts: (state) => {
      state.connectionAttempts = 0;
    },
    setConnectionError: (state, action: PayloadAction<string>) => {
      state.lastError = action.payload;
      state.isConnected = false;
      state.connectionStatus = "error";
    },
    setConnectionStatus: (
      state,
      action: PayloadAction<WebSocketState["connectionStatus"]>
    ) => {
      state.connectionStatus = action.payload;
    },
  },
});

export const {
  setConnected,
  setConnecting,
  setSubscribedGate,
  setLastMessage,
  incrementConnectionAttempts,
  resetConnectionAttempts,
  setConnectionError,
  setConnectionStatus,
} = websocketSlice.actions;
export default websocketSlice.reducer;

/**
 * Simple WebSocket state management
 *
 * State:
 * - isConnected: boolean - WebSocket connection status
 * - lastMessage: any - Last received message from server
 * - connectionStatus: string - Connection state for UI (connected/connecting/disconnected/error)
 *
 * Actions:
 * - setConnected(boolean) - Set connection status
 * - setLastMessage(message) - Store last received message
 * - setConnectionStatus(status) - Set connection status for UI
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WebSocketState {
  isConnected: boolean;
  lastMessage: any;
  connectionStatus: "connected" | "connecting" | "disconnected" | "error";
}

const initialState: WebSocketState = {
  isConnected: false,
  lastMessage: null,
  connectionStatus: "disconnected",
};

const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      state.connectionStatus = action.payload ? "connected" : "disconnected";
    },
    setLastMessage: (state, action: PayloadAction<any>) => {
      state.lastMessage = action.payload;
    },
    setConnectionStatus: (
      state,
      action: PayloadAction<WebSocketState["connectionStatus"]>
    ) => {
      state.connectionStatus = action.payload;
    },
  },
});

export const { setConnected, setLastMessage, setConnectionStatus } =
  websocketSlice.actions;
export default websocketSlice.reducer;



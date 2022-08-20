import jwt from "jsonwebtoken";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import io from "socket.io-client";

export interface InitialState {
  websocket: any;
  chats: any;
  lastMsg: any;
}
// @ts-ignore
const socket = io.connect("http://localhost:5000");
const initialState: InitialState = {
  websocket: socket,
  chats: {},
  lastMsg: {},
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setWebSocket: (state, action) => {
      action.payload = state.websocket;
    },
    setChats: (state, action) => {
      if (Object.keys(state.chats).length !== action.payload.length) {
        action.payload.forEach((user: any) => {
          state.chats[user.id] = { ...user, chat: [] };
        });
      }
    },
    setChatHistory: (state, action) => {
      state.chats[action.payload.id].chat = action.payload.chat;
    },
    sendMsg: (state, action) => {
      let chatter = state.chats[action.payload.to];
      if (chatter) {
        state.chats[chatter.id] = {
          ...chatter,
          chat: [
            ...chatter.chat,
            {
              senderId: action.payload.from,
              recieverId: action.payload.to,
              msg: action.payload.msg,
              time: action.payload.time,
            },
          ],
        };
      }
    },
    recieveMsg: (state, action) => {
      let chatter = state.chats[action.payload.from];
      if (chatter && state.lastMsg !== JSON.stringify({ ...action.payload })) {
        state.chats[chatter.id] = {
          ...chatter,
          chat: Array.from(
            new Set([
              ...chatter.chat,
              {
                senderId: action.payload.from,
                recieverId: action.payload.to,
                msg: action.payload.msg,
                time: action.payload.time,
              },
            ])
          ),
        };
      }
      state.lastMsg = JSON.stringify({ ...action.payload });
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(handleSignup.fulfilled, (state, action) => {
    // });
  },
});

export const { setWebSocket, setChats, sendMsg, recieveMsg, setChatHistory } =
  chatSlice.actions;

export default chatSlice.reducer;

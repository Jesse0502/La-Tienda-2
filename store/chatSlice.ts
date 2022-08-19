import jwt from "jsonwebtoken";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import io from "socket.io-client";

export interface InitialState {
  websocket: any;
  chats: any;
}
// @ts-ignore
const socket = io.connect("http://localhost:5000");
const initialState: InitialState = {
  websocket: socket,
  chats: {},
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setWebSocket: (state, action) => {
      action.payload = state.websocket;
    },
    setChats: (state, action) => {
      action.payload.forEach((user: any) => {
        state.chats[user.id] = { ...user, chat: [] };
      });
      console.log(current(state.chats));
    },
    sendMsg: (state, action) => {
      console.log("sending msg....");
      let chatter = state.chats[action.payload.to];
      if (chatter) {
        state.chats[chatter.id] = {
          ...chatter,
          chat: [
            ...chatter.chat,
            {
              from: action.payload.from,
              msg: action.payload.msg,
              time: action.payload.time,
            },
          ],
        };
        console.log(current(state.chats));
      }
    },
    recieveMsg: (state, action) => {
      console.log("recieving msg....");
      let chatter = state.chats[action.payload.from];
      if (chatter) {
        state.chats[chatter.id] = {
          ...chatter,
          chat: Array.from(
            new Set([
              ...chatter.chat,
              {
                from: action.payload.from,
                msg: action.payload.msg,
                time: action.payload.time,
              },
            ])
          ),
        };
        console.log(current(state.chats));
      }
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(handleSignup.fulfilled, (state, action) => {
    // });
  },
});

export const { setWebSocket, setChats, sendMsg, recieveMsg } =
  chatSlice.actions;

export default chatSlice.reducer;

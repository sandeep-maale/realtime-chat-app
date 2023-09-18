import { createSlice } from '@reduxjs/toolkit';
import ChatRoom from '../../models/ChatRoom';

// Define initial state for the slices
let initialChatRoomsState: { chatRooms: ChatRoom[] } = { chatRooms: [] };


// Create a slice for managing chatRooms
export const chatRoomsSlice = createSlice({
  name: 'chatRooms',
  initialState: initialChatRoomsState,
  reducers: {
    setChatRooms: (state, action) => {
      const chatRooms: ChatRoom[] = action.payload || [];
      state.chatRooms = [...chatRooms];
    },
    addChatRoom: (state, action) => {
      const newChatRoom: ChatRoom = {
        users: [],
        roomId: 0,
        roomName: '',
        createTimeStamp: 0
      };
      state.chatRooms.push(newChatRoom);
    },
    updateChatRoom: (state, action) => {
      state.chatRooms = state.chatRooms.map((chatRoomObj) => {
        if (chatRoomObj.roomId === action.payload.roomId) {
          chatRoomObj = { ...action.payload };
        }
        return chatRoomObj
      });
    },
  },
});
import { createSlice } from '@reduxjs/toolkit';
import ChatRoom from '../../models/ChatRoom';

// Define initial state for the slices
const initialChatRoomState: { chatRoom: ChatRoom | null } = { chatRoom: null};


// Create a slice for managing users
export const currentChatRoomSlice = createSlice({
  name: 'currentChatRoom',
  initialState: initialChatRoomState,
  reducers: {
    setCurrentChatRoom: (state, action) => {
      if (action.payload?.chatRoom) {
        state.chatRoom = {...action.payload?.chatRoom};
      }
    }
  }
});
import { createSlice } from '@reduxjs/toolkit';
import Message from '../../models/Message';
// import Message from '../../models/Message';

// Define initial state for the slices
const initialUsersState: {messages:Message[]} = {messages:[]};


// Create a slice for managing messages
export const messageSlice = createSlice({
    name: 'messages',
    initialState: initialUsersState,
    reducers: {
      setMessages: (state, action) => {
        const messages: Message[] = action.payload || [];
        state.messages = messages;
      },
      addMessage: (state, action) => {
        const newMessage: Message = {...action.payload};
        state.messages.push(newMessage);
      }
    },
  });
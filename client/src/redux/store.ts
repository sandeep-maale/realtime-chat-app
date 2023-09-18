// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import User from '../models/User';
import ChatRoom from '../models/ChatRoom';
import { usersSlice } from './slices/userSlice';
import { chatRoomsSlice } from './slices/chatRoomSlice';
import { currentChatRoomSlice } from './slices/currentChatRoomSlice';
import { messageSlice } from './slices/messagesSlice';
import Message from '../models/Message';


export interface AppState {
    users: { users: User[] };
    chatRooms: { chatRooms: ChatRoom[] };
    currentChatRoom: { chatRoom: ChatRoom | null };
    messages: { messages: Message[] }
}

// Combine reducers
const rootReducer = combineReducers({
    users: usersSlice.reducer,
    chatRooms: chatRoomsSlice.reducer,
    currentChatRoom: currentChatRoomSlice.reducer,
    messages: messageSlice.reducer
});

// Create the Redux store
const store = configureStore({
    reducer: rootReducer,
});

export const { setUsers, addUser, updateUser } = usersSlice.actions;
export const { setChatRooms, addChatRoom, updateChatRoom } = chatRoomsSlice.actions;
export const { setCurrentChatRoom } = currentChatRoomSlice.actions;
export const { setMessages, addMessage } = messageSlice.actions;

export default store;

import { createSlice } from '@reduxjs/toolkit';
import User from '../../models/User';

// Define initial state for the slices
const initialUsersState: {users:User[]} = {users:[]};


// Create a slice for managing users
export const usersSlice = createSlice({
    name: 'users',
    initialState: initialUsersState,
    reducers: {
      setUsers: (state, action) => {
        const users: User[] = action.payload || [];
        state.users = users;
      },
      addUser: (state, action) => {
        const newUser: User = {...action.payload};
        state.users.push(newUser);
      },
      updateUser: (state, action) => {
        state.users = state.users.map((user) => {
          if (user.email === action.payload.email) {
            user.status = action.payload.status;
          }
          return user;
        });
      }
    },
  });
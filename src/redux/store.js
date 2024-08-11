import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import userBlogsReducer from './features/userBlogs'

export const store = configureStore({
  reducer: {
    User: userReducer,
    userBlogs : userBlogsReducer,
  },
})
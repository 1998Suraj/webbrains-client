import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'userBlogs',
  initialState: [],
  reducers: {
    setUserBlogs(state, action) {
        state.push(action.payload)
    },
  },
})

export const { setUserBlogs } = userSlice.actions
export default userSlice.reducer
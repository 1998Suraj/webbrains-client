import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'User',
  initialState: {},
  reducers: {
    setUserData(state, action) {
        return { ...action.payload };
    },
  },
})

export const { setUserData } = userSlice.actions
export default userSlice.reducer
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface Board {
  id: number;
  title: string;
}

interface State {
  boards: Board[];
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  boards: [],
  loading: true,
  error: null,
};

export const getBoards = createAsyncThunk(
  'state/getBoards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:2000/api/boards');
      if (!response.ok) {
        throw new Error('Failed to fetch boards');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const stateSlice = createSlice({
  name: 'stateSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBoards.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getBoards.fulfilled, (state, action) => {
      state.loading = false;
      state.boards = action.payload;
    });
    builder.addCase(getBoards.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default stateSlice.reducer;
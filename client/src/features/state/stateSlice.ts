import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface Board {
  id: number;
  title: string;
}

interface Column {
  id: number;
  title: string;
}

interface Todo {
  id: number;
  title: string;
  columnId: number;
}

interface Subtodo {
  title: string;
  isCompleted: boolean;
  todoId: number;
}

interface SelectedBoardState {
  id: number | null;
}
interface State {
  selectedBoard: SelectedBoardState;
  boards: Board[];
  columns: Column[];
  todos: Todo[];
  subtodos: Subtodo[];
  modal: string;
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  selectedBoard: { id: null },
  boards: [],
  columns: [],
  todos: [],
  subtodos: [],
  modal: "",
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

export const getColumns = createAsyncThunk(
  'state/getColumns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:2000/api/columns');
      if (!response.ok) {
        throw new Error('Failed to fetch columns');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
    }
  );

  export const getTodos = createAsyncThunk(
    'state/getTodos',
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch('http://localhost:2000/api/todos');
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        return data;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const getSubtodos = createAsyncThunk(
    'state/subtodos',
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch('http://localhost:2000/api/subtodos');
        if (!response.ok) {
          throw new Error('Failed to fetch subtodos');
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
  reducers: {
    selectedBoardState: (state, action) => {
      state.selectedBoard = action.payload;
    },
    swapModal: (state, action) => {
      state.modal = action.payload;
    } 
  },
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
    builder.addCase(getColumns.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getColumns.fulfilled, (state, action) => {
      state.loading = false;
      state.columns = action.payload;
    });
    builder.addCase(getColumns.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(getTodos.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTodos.fulfilled, (state, action) => {
      state.loading = false;
      state.todos = action.payload;
    });
    builder.addCase(getTodos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(getSubtodos.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getSubtodos.fulfilled, (state, action) => {
      state.loading = false;
      state.subtodos = action.payload;
    });
    builder.addCase(getSubtodos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { selectedBoardState, swapModal } = stateSlice.actions;

export default stateSlice.reducer;
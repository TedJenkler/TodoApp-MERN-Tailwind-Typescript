import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import { act } from 'react';

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

interface AddColumnsPayload {
  columns: [];
  boardId: string;
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

  export const addTodo = createAsyncThunk(
    'state/addtodo',
    async ({ title, description, status }, { rejectWithValue }) => {
      try {
        const response = await fetch('http://localhost:2000/api/todos/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description, status }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add todo');
        }
  
        const data = await response.json();
        return data;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const addSubtodos = createAsyncThunk(
    'state/addsubtodos',
    async ({ subTodos, todoId }: { subTodos: any[], todoId: string }, { rejectWithValue }) => {
      try {
        const response = await fetch('http://localhost:2000/api/subtodos/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subTodos, todoId }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add subtodos');
        }
  
        const data = await response.json();
        return data;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const updateTodo = createAsyncThunk(
    'state/updateTodo',
    async ({ title, description, status, id }: { title: string, description: string, status: string, id: string }, { rejectWithValue }) => {
      try {
        const response = await fetch(`http://localhost:2000/api/todos/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description, status })
        });
  
        if (!response.ok) {
          throw new Error('Failed to update todo');
        }
  
        const data = await response.json();
        return data;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const updateSubtodos = createAsyncThunk(
    'state/updateSubtodos',
    async ({ subTodos, todoId }: { subTodos: string[], todoId: string }, { rejectWithValue }) => {
      try {
        const response = await fetch(`http://localhost:2000/api/subtodos/${todoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subTodos }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update subtodos');
        }
  
        const data = await response.json();
        return data;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const addBoard = createAsyncThunk(
    'state/addBoard',
    async ({ name }: { name: string }, { rejectWithValue }) => {
      try {
        const response = await fetch('http://localhost:2000/api/boards/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        }); 
        if(!response.ok) {
          throw new Error('Failed to add board');
        }

        const data = await response.json();
        return data;
      }catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const addColumns = createAsyncThunk(
    'state/addColumns',
    async ({ columns, boardId }, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:2000/api/columns/many', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ columns, boardId }),
            });

            if (!response.ok) {
                throw new Error('Failed to add columns');
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
    builder.addCase(addTodo.pending, (state) => {
      state.loading = true;
      state.error = null
    });
    builder.addCase(addTodo.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(addTodo.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string;
    });
    builder.addCase(updateTodo.pending, (state) => {
      state.loading = true;
      state.error = null
    });
    builder.addCase(updateTodo.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(updateTodo.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string;
    });
    builder.addCase(updateSubtodos.pending, (state) => {
      state.loading = true;
      state.error = null
    });
    builder.addCase(updateSubtodos.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(updateSubtodos.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string;
    });
    builder.addCase(addSubtodos.pending, (state) => {
      state.loading = true;
      state.error = null
    });
    builder.addCase(addSubtodos.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(addSubtodos.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string;
    });
    builder.addCase(addBoard.pending, (state) => {
      state.loading = true;
      state.error = null
    });
    builder.addCase(addBoard.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(addBoard.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string;
    });
    builder.addCase(addColumns.pending, (state) => {
      state.loading = true;
      state.error = null
    });
    builder.addCase(addColumns.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(addColumns.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string;
    });
  },
});

export const { selectedBoardState, swapModal } = stateSlice.actions;

export default stateSlice.reducer;
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
  darkmode: boolean;
  menu: boolean;
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
  darkmode: false,
  menu: false,
  loading: true,
  error: null,
};
interface BoardResponse {
  id: number;
  title: string;
}

interface ColumnResponse {
  id: number;
  title: string;
}

interface TodoResponse {
  id: number;
  title: string;
  columnId: number;
}

interface SubtodoResponse {
  title: string;
  isCompleted: boolean;
  todoId: number;
}

interface GetBoardsPayload {
  boards: BoardResponse[];
}

interface GetColumnsPayload {
  boards: BoardResponse[];
  columns: ColumnResponse[];
}

interface GetTodosPayload {
  todos: TodoResponse[];
}

interface GetSubtodosPayload {
  todos: TodoResponse[];
  subtodos: SubtodoResponse[];
  allSubtodos: SubtodoResponse[];
}

interface ErrorPayload {
  message: string;
}

interface UpdateTodoPayload {
  todo: any;
  status: string;
  id: string;
}

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

export const editBoard = createAsyncThunk(
  'state/editBoard',
  async ({ id, name }: { id: string, name: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:2000/api/boards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit board');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const editColumns = createAsyncThunk(
  'state/editColumns',
  async ({ columns, boardId }: { columns: Column[], boardId: String }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:2000/api/columns`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ columns, boardId }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit columns');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBoard = createAsyncThunk(
  'state/deleteBoard',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:2000/api/boards/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete board');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'state/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:2000/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleSubtodo = createAsyncThunk(
  'state/toggleSubtodo',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:2000/api/subtodos/toggle/${id}`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Failed to toggle subtodo');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTodoById = createAsyncThunk(
  'state/updateTodoById',
  async ({ todo, status, id }: UpdateTodoPayload, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:2000/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...todo, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
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
    },
    toggleDarkmode: (state, action) => {
      state.darkmode = action.payload;
    },
    toggleMenu: (state, action) => {
      state.menu = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBoards.fulfilled, (state, action: { payload: GetBoardsPayload }) => {
        state.loading = false;
        state.boards = action.payload.boards;
        state.error = null;
      })
      .addCase(getColumns.fulfilled, (state, action: { payload: GetColumnsPayload }) => {
        state.loading = false;
        state.columns = action.payload.columns;
        state.error = null;
      })
      .addCase(getTodos.fulfilled, (state, action: { payload: GetTodosPayload }) => {
        state.loading = false;
        state.todos = action.payload.todos;
        state.error = null;
      })
      .addCase(getSubtodos.fulfilled, (state, action: { payload: GetSubtodosPayload }) => {
        state.loading = false;
        state.subtodos = action.payload.subtodos;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action: { payload: GetTodosPayload }) => {
        state.loading = false;
        state.todos = action.payload.todos
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action: { payload: GetTodosPayload }) => {
        state.loading = false;
        state.todos = action.payload.todos
        state.error = null;
      })
      .addCase(addSubtodos.fulfilled, (state, action: { payload: GetSubtodosPayload }) => {
        state.loading = false
        state.todos = action.payload.todos
        state.subtodos = action.payload.allSubtodos;
        state.error = null
      })
      .addCase(updateSubtodos.fulfilled, (state, action: { payload: GetSubtodosPayload }) => {
        state.loading = false
        state.todos = action.payload.todos
        state.subtodos = action.payload.allSubtodos;
        state.error = null
      })
      .addCase(toggleSubtodo.fulfilled, (state, action: { payload: GetSubtodosPayload }) => {
        state.loading = false
        state.subtodos = action.payload.allSubtodos
        state.error = null
      })
      .addCase(toggleSubtodo.pending, (state) => {
        // Nothing
      })
      .addCase(editBoard.fulfilled, (state, action: { payload: GetBoardsPayload }) => {
        state.loading = false
        state.boards = action.payload.boards
        state.error = null
      })
      .addCase(addBoard.fulfilled, (state, action: { payload: GetBoardsPayload }) => {
        state.loading = false
        state.boards = action.payload.boards
        state.error = null
      })
      .addCase(addColumns.fulfilled, (state, action: { payload: GetColumnsPayload }) => {
        state.loading = false;
        state.boards = action.payload.boards
        state.columns = action.payload.columns;
        state.error = null;
      })
      .addCase(editColumns.fulfilled, (state, action: { payload: GetColumnsPayload }) => {
        state.loading = false;
        state.boards = action.payload.boards
        state.columns = action.payload.columns;
        state.error = null;
      })
      .addCase(updateTodoById.fulfilled, (state, action: { payload: GetTodosPayload }) => {
        state.loading = false;
        state.todos = action.payload.todos
        state.error = null;
      })
      .addCase(deleteBoard.fulfilled, (state, action: { payload: GetBoardsPayload }) => {
        state.loading = false;
        state.boards = action.payload.boards
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action: { payload: GetTodosPayload }) => {
        state.loading = false;
        state.todos = action.payload.todos
        state.error = null;
      })
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/pending' && action.type !== 'state/toggleSubtodo/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: { payload: ErrorPayload }) => {
          state.loading = false;
          state.error = action.payload.message;
        }
      );
  }
});

export const { selectedBoardState, swapModal, toggleDarkmode, toggleMenu } = stateSlice.actions;

export default stateSlice.reducer;
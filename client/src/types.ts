export interface Todo {
  _id: string;
  id: string;
  title: string;
  description: string;
  status: string;
  subtodos: any;
}

export interface Subtodo {
  _id?: string;
  id?: string;
  todoId?: string;
  title: string;
  isCompleted: boolean;
}
  
  export interface Column {
    _id?: string;
    id?: string;
    name: string;
    boardId: string;
    title?: string;
  }
  
  export interface Board {
    name: string;
    columns: Column[];
  }
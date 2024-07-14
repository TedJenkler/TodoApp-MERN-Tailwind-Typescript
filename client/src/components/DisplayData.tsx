import blue from '../assets/blue.png';
import purple from '../assets/purple.png';
import green from '../assets/green.png';
import { useDispatch, useSelector } from 'react-redux';
import { swapModal } from '../features/state/stateSlice';

interface Column {
  _id: string;
  name: string;
  boardId: string;
  todos: string[];
}

interface Todo {
  _id: string;
  title: string;
  status: string;
  subtodos: string[];
}

interface Subtodo {
  _id: string;
  title: string;
  isCompleted: boolean;
}

function DisplayData() {
  const boards = useSelector((state: any) => state.stateSlice.boards.boards);
  const columns = useSelector((state: any) => state.stateSlice.columns.columns);
  const todos = useSelector((state: any) => state.stateSlice.todos.todos);
  const subtodos = useSelector((state: any) => state.stateSlice.subtodos.subtodos);
  const dispatch = useDispatch();

  const selectedBoardId = useSelector((state: any) => state.stateSlice.selectedBoard);

  const filteredColumns: Column[] = columns.filter((column: Column) => column.boardId === selectedBoardId);

  const handleTodoModal = (id: string) => {
    console.log(id)
    dispatch(swapModal("todo" + id))
  } 

  return (
    <main className='flex bg-darkbg h-screen px-4 py-6 overflow-x-auto gap-6'>
      {filteredColumns.length > 0 && (
        <>
          {filteredColumns.map((column: Column, index: number) => (
            <section className='min-w-[17.5rem]' key={index}>
              <div className='flex items-center gap-3'>
                {index === 0 && <img className='h-4 w-4' src={blue} alt='dot' />}
                {index === 1 && <img className='h-4 w-4' src={purple} alt='dot' />}
                {index === 2 && <img className='h-4 w-4' src={green} alt='dot' />}
                <h2 className='hs text-mediumgrey'>{column.name.toUpperCase()} ({column.todos.length})</h2>
              </div>
              {todos.filter((todo: Todo) => todo.status === column._id).map((todo: Todo) => (
                <div key={todo._id} onClick={() => {handleTodoModal(todo._id)}} className='flex flex-col w-full mt-5 bg-darkgrey rounded-lg px-4 py-6'>
                  <h3 className='text-white hm w-full'>{todo.title}</h3>
                  <div className='flex items-center gap-2 text-mediumgrey'>
                    {todo.subtodos.length > 0 && (
                      <p>{subtodos.filter((subtodo: Subtodo) => todo.subtodos.includes(subtodo._id) && subtodo.isCompleted).length} of {todo.subtodos.length} subtasks</p>
                    )}
                    {todo.subtodos.length === 0 && (
                      <p>No subtasks</p>
                    )}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </>
      )}
        <button className='h-screen min-w-[17.5rem] bg-darkgrey rounded-md mt-[2.188rem] hxl text-mediumgrey'>
          + New Column
        </button>
    </main>
  );
}

export default DisplayData;
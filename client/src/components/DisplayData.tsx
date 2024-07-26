import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { swapModal, updateTodoById } from '../features/state/stateSlice';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Todo, Subtodo, Column } from '../types';
import { AppDispatch } from '../store';
import Sidebar from './Sidebar';
import EmptyCol from './EmptyCol';
import blue from '../assets/blue.png';
import purple from '../assets/purple.png';
import green from '../assets/green.png';

const ItemType = 'TODO_ITEM';

interface DraggableTodoProps {
  todo: Todo & { isDarkMode: boolean };
  onClick: () => void;
}

interface DroppableColumnProps {
  column: Column & { dotIcon: any; todos: Todo[] };
  children: React.ReactNode;
  onDrop: (todoId: string, newColumnId: any) => any;
}

const DraggableTodo: React.FC<DraggableTodoProps> = ({ todo, onClick }) => {
  const subtodos = useSelector((state: any) => state.stateSlice.subtodos);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { id: todo._id, status: todo.status },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={`flex flex-col mt-5 ${isDragging ? 'opacity-50' : ''} ${todo.isDarkMode ? 'bg-darkgrey text-white ' : 'bg-white text-black'} rounded-lg px-4 w-[17.5rem] py-6 cursor-pointer hover:text-mainpurple`}
    >
      <h3 className='hm w-full'>{todo.title}</h3>
      <div className='flex items-center gap-2 text-mediumgrey'>
        {todo.subtodos.length > 0 ? (
          <p className='bm'>
            {subtodos?.filter((subtodo: Subtodo) => todo.subtodos.includes(subtodo._id) && subtodo.isCompleted).length}{' '}
            of {todo.subtodos.length} subtasks
          </p>
        ) : (
          <p>No subtasks</p>
        )}
      </div>
    </div>
  );
};

const DroppableColumn: React.FC<DroppableColumnProps> = ({ column, children, onDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item: any) => onDrop(item.id, column._id),
  }));

  return (
    <section ref={drop} className='min-w-[17.5rem]'>
      <div className='flex items-center gap-3'>
        <img className='h-4 w-4' src={column.dotIcon} alt='dot' />
        <h2 className='hs text-mediumgrey'>
          {column.name.toUpperCase()} ({column.todos.length})
        </h2>
      </div>
      {children}
    </section>
  );
};

const DisplayData = () => {
  const dispatch: AppDispatch = useDispatch();
  const columns = useSelector((state: any) => state.stateSlice.columns);
  const todos = useSelector((state: any) => state.stateSlice.todos);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);
  const selectedBoardId = useSelector((state: any) => state.stateSlice.selectedBoard);
  const menu = useSelector((state: any) => state.stateSlice.menu);

  const filteredColumns: Column[] = useMemo(
    () => columns?.filter((column: Column) => column.boardId === selectedBoardId),
    [columns, selectedBoardId]
  );

  const handleTodoModal = (id: string) => {
    dispatch(swapModal("todo" + id));
  };

  const handleColumn = () => {
    dispatch(swapModal("editBoard" + selectedBoardId));
  };

  const handleDrop = (todoId: string, newColumnId: string) => {
    const selectedTodo = todos.find((item: any) => item._id === todoId);
    if (selectedTodo) {
      dispatch(updateTodoById({ todo: selectedTodo, status: newColumnId, id: todoId }));
    }
    console.log(`Todo ${todoId} dropped into column ${newColumnId}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='flex h-screen overflow-hidden'>
        <Sidebar />
        <main
          className={`flex flex-1 ${isDarkMode ? 'bg-darkbg' : 'bg-lightbg'} ${menu ? "md:ml-[16.2rem]" : "md:ml-[3.3rem]"} md:mt-[5rem] h-full px-4 py-6 overflow-auto gap-6 transition-all duration-300 ease-in-out`}
        >
          {filteredColumns.length > 0 ? (
            filteredColumns.map((column: Column, index: number) => (
              <DroppableColumn
                key={column._id}
                column={{
                  ...column,
                  dotIcon: index === 0 ? blue : index === 1 ? purple : green,
                  todos: todos.filter((todo: Todo) => todo.status === column._id),
                }}
                onDrop={handleDrop}
              >
                {todos
                  .filter((todo: Todo) => todo.status === column._id)
                  .map((todo: Todo) => (
                    <DraggableTodo
                      key={todo._id}
                      todo={{ ...todo, isDarkMode }}
                      onClick={() => handleTodoModal(todo._id)}
                    />
                  ))}
              </DroppableColumn>
            ))
          ) : (
            <EmptyCol />
          )}
          {filteredColumns.length > 0 ? <div onClick={handleColumn} className={`flex mt-[2.188rem] items-center justify-center min-w-[17.5rem] ${isDarkMode ? "bg-darkgrey" : "bg-speciallight" } rounded-md`}>
            <p className='hxl text-mediumgrey'>+ New Column</p>
          </div> : null}
        </main>
      </div>
    </DndProvider>
  );
};

export default DisplayData;
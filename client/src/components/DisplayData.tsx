import React, { useState, useMemo } from 'react';
import blue from '../assets/blue.png';
import purple from '../assets/purple.png';
import green from '../assets/green.png';
import greyboardicon from '../assets/greyboardicon.png';
import whiteboardicon from '../assets/whiteboardicon.png';
import purpleboardicon from '../assets/purpleboardicon.png';
import slashedeye from '../assets/slashedeye.png';
import eye from '../assets/eye.png';
import EmptyCol from './EmptyCol';
import ToggleTheme from './ToggleTheme';
import { useDispatch, useSelector } from 'react-redux';
import { selectedBoardState, swapModal, toggleMenu, updateTodoById } from '../features/state/stateSlice';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = 'TODO_ITEM';

const DraggableTodo = ({ todo, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { id: todo._id, status: todo.status },
    collect: (monitor) => ({
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
            {todo.subtodos.filter(subtodo => subtodo.isCompleted).length} of {todo.subtodos.length} subtasks
          </p>
        ) : (
          <p>No subtasks</p>
        )}
      </div>
    </div>
  );
};

const DroppableColumn = ({ column, children, onDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item) => onDrop(item.id, column._id),
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
  const [hoveredBoardId, setHoveredBoardId] = useState<string | null>(null);
  const boards = useSelector((state: any) => state.stateSlice.boards);
  const columns = useSelector((state: any) => state.stateSlice.columns);
  const todos = useSelector((state: any) => state.stateSlice.todos);
  const subtodos = useSelector((state: any) => state.stateSlice.subtodos);
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);
  const selectedBoardId = useSelector((state: any) => state.stateSlice.selectedBoard);
  const menu = useSelector((state: any) => state.stateSlice.menu);

  const filteredColumns: Column[] = useMemo(() =>
    columns?.filter((column: Column) => column.boardId === selectedBoardId),
    [columns, selectedBoardId]
  );

  const handleTodoModal = (id: string) => {
    dispatch(swapModal("todo" + id));
  };

  const handleColumn = () => {
    dispatch(swapModal("editBoard" + selectedBoardId));
  };

  const changeBoard = (id: string) => {
    dispatch(selectedBoardState(id));
  };

  const handleModal = () => {
    dispatch(swapModal("addBoard"));
    dispatch(toggleMenu(false));
  };

  const closeMenu = () => {
    dispatch(toggleMenu(true));
  };

  const handleDrop = (todoId: string, newColumnId: string) => {
    const selectedTodo = todos.find(item => item._id === todoId);
    if (selectedTodo) {
      dispatch(updateTodoById({ todo: selectedTodo, status: newColumnId, id: todoId }));
    }
    console.log(`Todo ${todoId} dropped into column ${newColumnId}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='flex h-screen overflow-hidden md:mt-[5rem]'>
        {menu ? (
          <div className={`hidden absolute md:flex md:fixed flex-col justify-between h-[92%] min-w-[16.313rem] pt-8 ${isDarkMode ? 'bg-darkgrey' : 'bg-white'} transition-all duration-300 ease-in-out`}>
            <div>
              <h1 className='mx-6 text-mediumgrey text-xs font-bold tracking-[2.4px] mb-5'>
                ALL BOARDS ({boards.length})
              </h1>
              {boards?.map((board: any) => (
                <div
                  key={board._id}
                  className={`flex items-center h-12 w-[15rem] px-6 gap-2 rounded-r-[6.25rem] ${board._id === selectedBoardId ? "bg-mainpurple text-white" : `text-mediumgrey hover:text-mainpurple ${isDarkMode ? "hover:bg-white" : "hover:bg-mainpurple/25" }`} cursor-pointer`}
                  onClick={() => changeBoard(board._id)}
                  onMouseEnter={() => setHoveredBoardId(board._id)}
                  onMouseLeave={() => setHoveredBoardId(null)}
                >
                  <img
                    className='h-4 w-4'
                    src={board._id === selectedBoardId ? whiteboardicon : hoveredBoardId === board._id ? purpleboardicon : greyboardicon}
                    alt='board icon'
                  />
                  <p className='hm'>
                    {board.name}
                  </p>
                </div>
              ))}
              <div className='flex items-center h-12 w-[15rem] pl-6 gap-2'>
                <img className='h-4 w-4' src={purpleboardicon} alt='purpleboardicon' />
                <button onClick={handleModal} className='hm text-mainpurple'>+ Create New Board</button>
              </div>
            </div>
            <div>
              <ToggleTheme />
              <div onClick={() => dispatch(toggleMenu(false))} className={`flex items-center h-12 w-[15rem] px-6 gap-[0.625rem] ${isDarkMode ? "hover:bg-white" : "hover:bg-mainpurple/25"} rounded-r-[6.25rem]`}>
                <img className='h-4 w-4' src={slashedeye} alt='sidebar toggle' />
                <button className='hm text-mainpurple'>Hide Sidebar</button>
              </div>
            </div>
          </div>
        ) : (
          <div className={`hidden absolute md:flex md:fixed flex-col justify-end h-[92%] w-[3.5rem] ${isDarkMode ? "bg-darkbg" : "bg-lightbg"} transition-all duration-300 ease-in-out`}>
            <button onClick={closeMenu} className='flex bg-mainpurple mb-8 w-[3.5rem] h-12 rounded-r-[6.25rem] px-[1.125rem] items-center hover:bg-mainpurplehover'>
              <img src={eye} alt='openmenu' />
            </button>
          </div>
        )}
        <main className={`flex flex-1 ${isDarkMode ? 'bg-darkbg' : 'bg-lightbg'} ${menu ? "md:ml-[16.2rem]" : "md:ml-[3.5rem]"} h-full px-4 py-6 overflow-auto gap-6 transition-all duration-300 ease-in-out`}>
          {filteredColumns.length > 0 ? (
            filteredColumns.map((column: Column, index: number) => (
              <DroppableColumn
                key={column._id}
                column={{
                  ...column,
                  dotIcon: index === 0 ? blue : index === 1 ? purple : green,
                  todos: todos.filter((todo: Todo) => todo.status === column._id)
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
        </main>
      </div>
    </DndProvider>
  );
};

export default DisplayData;
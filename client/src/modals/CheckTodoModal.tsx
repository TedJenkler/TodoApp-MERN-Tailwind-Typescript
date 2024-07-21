import { useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatusSelect from '../components/StatusSelect';
import { swapModal, toggleSubtodo } from '../features/state/stateSlice';
import settings from '../assets/settings.png';
import checkbox from '../assets/checkbox.png';
import emptycheckbox from '../assets/emptycheckbox.png';
import emptycheckboxdark from '../assets/emptycheckboxdark.png';
import useClickOutside from '../hooks/useClickOutside';

interface Subtodo {
  _id: string;
  title: string;
  todoId: string;
  isCompleted: boolean;
}

interface Todo {
  _id: string;
  title: string;
  description: string;
  status: string;
  subtodos: Subtodo[];
}

function CheckTodoModal() {
  const modal = useSelector((state: any) => state.stateSlice.modal);
  const todos = useSelector((state: any) => state.stateSlice.todos);
  const subtodos = useSelector((state: any) => state.stateSlice.subtodos);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);

  const id: string = modal.slice(4);

  const selectedTodo = todos.find((todo: Todo) => todo._id === id);
  const subtodoList = subtodos.filter((subtodo: Subtodo) => subtodo.todoId === id);

  const [toggle, setToggle] = useState<boolean>(false);
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  const choiceRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, "modal");
  useClickOutside(choiceRef, "toggle", setToggle);

  const handleToggle = useCallback((subtodoId: string) => {
    dispatch(toggleSubtodo(subtodoId));
  }, [dispatch]);

  const choiceTodoPopup = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  const editModal = () => {
    dispatch(swapModal(`edittodo${id}`));
  };

  const deleteModal = () => {
    dispatch(swapModal(`deletetodo${id}`));
  };

  return (
    <div ref={modalRef} className={`z-50 w-[21.438rem] absolute ${isDarkMode ? 'bg-darkgrey' : 'bg-white'} bottom-1/2 translate-y-1/2 right-1/2 translate-x-1/2 p-6 rounded-md md:w-[30rem] md:p-8`}>
      <div className='relative'>
        <div className='flex justify-between items-center'>
          <h1 className={`mb-6 hl ${isDarkMode ? 'text-white' : 'text-black'}`}>{selectedTodo ? selectedTodo.title : null}</h1>
          <img onClick={choiceTodoPopup} className='h-5 w-[0.289rem] cursor-pointer' src={settings} alt='settings' />
        </div>
        {toggle && (
          <div ref={choiceRef} className={`absolute justify-between z-50 top-8 right-4 flex flex-col w-[12rem] h-[5.875rem] ${isDarkMode ? "bg-darkbg" : "bg-white"} rounded-lg p-4`}>
            <p className={`text-mediumgrey bl cursor-pointer`} onClick={editModal}>Edit Task</p>
            <p className={`text-red bl cursor-pointer`} onClick={deleteModal}>Delete Task</p>
          </div>
        )}
      </div>
      <p className={`mb-6 text-mediumgrey bl ${isDarkMode ? 'text-white' : 'text-black'}`}>{selectedTodo?.description ? selectedTodo.description : null}</p>
      <h2 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-black'} mb-4`}>
        Subtasks ({subtodoList.filter((item) => item.isCompleted).length} of {subtodoList.length})
      </h2>
      <div className='custom-scrollbar flex flex-col'>
        {subtodoList.map((item) => (
          <div key={item._id} className={`w-full h-[3.688rem] mb-2 rounded flex items-center p-2 ${isDarkMode ? 'bg-darkbg hover:bg-mainpurple/25' : 'bg-lightbg hover:bg-mainpurple/25'} md:h-full cursor-pointer`} onClick={() => handleToggle(item._id)}>
            <img src={isDarkMode ? item.isCompleted ? checkbox : emptycheckboxdark : item.isCompleted ? checkbox : emptycheckbox} alt='checkbox' className='w-4 h-4 mr-2' />
            <span className={`text-xs font-bold ml-2 ${isDarkMode ? 'text-white' : 'text-black'} ${item.isCompleted ? 'line-through text-mediumgrey' : ''}`}>{item.title}</span>
          </div>
        ))}
      </div>
      <StatusSelect todo={selectedTodo} />
    </div>
  );
}

export default CheckTodoModal;
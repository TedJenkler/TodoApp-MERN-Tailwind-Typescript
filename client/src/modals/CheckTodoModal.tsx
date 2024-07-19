import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatusSelect from '../components/StatusSelect';
import { swapModal } from '../features/state/stateSlice';
import settings from '../assets/settings.png';
import checkbox from '../assets/checkbox.png';
import emptycheckbox from '../assets/emptycheckbox.png';
import emptycheckboxdark from '../assets/emptycheckboxdark.png';

interface Subtodo {
  _id: string;
  title: string;
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
  const [data, setData] = useState<Todo | null>(null);
  const [children, setChildren] = useState<Subtodo[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [toggle, setToggle] = useState<boolean>(false);
  const dispatch = useDispatch();
  const id: string = modal.slice(4);
  const modalRef = useRef<HTMLDivElement>(null);
  const choiceRef = useRef<HTMLDivElement>(null);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        dispatch(swapModal(''));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutsideChoice = (event: MouseEvent) => {
      if (choiceRef.current && !choiceRef.current.contains(event.target as Node)) {
        setToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideChoice);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideChoice);
    };
  }, [toggle]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todoResponse = await fetch(`http://localhost:2000/api/todos/${id}`);
        if (!todoResponse.ok) {
          throw new Error('Failed to fetch todo data');
        }
        const todoData = await todoResponse.json();
        setData(todoData.todo);

        const subtodosResponse = await fetch(`http://localhost:2000/api/subtodos/${id}`);
        if (!subtodosResponse.ok) {
          throw new Error('Failed to fetch subtodos data');
        }
        const subtodosData = await subtodosResponse.json();
        setChildren(subtodosData.subtodos);
      } catch (error: any) {
        setError(error);
      }
    };

    fetchData();
  }, [id]);

  const handleToggle = useCallback(async (subtodoId: string) => {
    try {
      const response = await fetch(`http://localhost:2000/api/subtodos/toggle/${subtodoId}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle subtodo');
      }

      const updatedSubtodo = await response.json();
      setChildren((prevChildren) =>
        prevChildren.map((item) =>
          item._id === subtodoId ? { ...item, isCompleted: !item.isCompleted } : item
        )
      );
    } catch (error) {
      console.error('Error toggling subtodo:', error);
    }
  }, []);

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
          <h1 className={`mb-6 hl ${isDarkMode ? 'text-white' : 'text-black'}`}>{data ? data.title : null}</h1>
          <img onClick={choiceTodoPopup} className='h-5 w-[0.289rem] cursor-pointer' src={settings} alt='settings' />
        </div>
        {toggle && (
          <div ref={choiceRef} className={`absolute justify-between z-50 top-8 right-4 flex flex-col w-[12rem] h-[5.875rem] ${isDarkMode ? "bg-darkbg" : "bg-white"} rounded-lg p-4`}>
            <p className={`text-mediumgrey bl cursor-pointer`} onClick={editModal}>Edit Task</p>
            <p className={`text-red bl cursor-pointer`} onClick={deleteModal}>Delete Task</p>
          </div>
        )}
      </div>
      <p className={`mb-6 text-mediumgrey bl ${isDarkMode ? 'text-white' : 'text-black'}`}>{data?.description ? data.description : null}</p>
      <h2 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-black'} mb-4`}>
        Subtasks ({children.filter((item) => item.isCompleted).length} of {children.length})
      </h2>
      <div className='custom-scrollbar flex flex-col'>
        {children.map((item) => (
          <div key={item._id} className={`w-full h-[3.688rem] mb-2 rounded flex items-center p-2 ${isDarkMode ? 'bg-darkbg hover:bg-mainpurple/25' : 'bg-lightbg hover:bg-mainpurple/25'} md:h-full cursor-pointer`} onClick={() => handleToggle(item._id)}>
            <img src={isDarkMode ? item.isCompleted ? checkbox : emptycheckboxdark : item.isCompleted ? checkbox : emptycheckbox} alt='checkbox' className='w-4 h-4 mr-2' />
            <span className={`text-xs font-bold ml-2 ${isDarkMode ? 'text-white' : 'text-black'} ${item.isCompleted ? 'line-through text-mediumgrey' : ''}`}>{item.title}</span>
          </div>
        ))}
      </div>
      <StatusSelect todo={data} />
    </div>
  );
}

export default CheckTodoModal;
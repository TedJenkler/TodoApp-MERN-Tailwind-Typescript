import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatusSelect from '../components/StatusSelect';
import { swapModal } from '../features/state/stateSlice';
import settings from '../assets/settings.png';
import checkbox from '../assets/checkbox.png';
import emptycheckbox from '../assets/emptycheckbox.png';

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
    setToggle(!toggle);
  };

  const editModal = () => {
    dispatch(swapModal(`edittodo${id}`));
  };

  const deleteModal = () => {
    dispatch(swapModal(`deletetodo${id}`));
  };

  return (
    <div ref={modalRef} className={`w-[21.438rem] absolute ${isDarkMode ? 'bg-darkgrey' : 'bg-white'} top-[12.938rem] right-1/2 translate-x-1/2 p-6 rounded-md`}>
      <div className='flex justify-between items-center'>
        <h1 className={`mb-6 hl ${isDarkMode ? 'text-white' : 'text-black'}`}>{data ? data.title : null}</h1>
        <img onClick={choiceTodoPopup} className='h-5 w-[0.289rem]' src={settings} alt='settings' />
        {toggle && (
          <div ref={choiceRef} className='absolute z-50 top-20 right-4 flex flex-col w-[12rem] h-[5.875rem] bg-darkbg rounded-lg p-4'>
            <p className={`text-mediumgrey bl ${isDarkMode ? 'text-white' : 'text-black'}`} onClick={editModal}>Edit Task</p>
            <p className={`text-red bl ${isDarkMode ? 'text-white' : 'text-black'}`} onClick={deleteModal}>Delete Task</p>
          </div>
        )}
      </div>
      <p className={`mb-6 text-mediumgrey bl ${isDarkMode ? 'text-white' : 'text-black'}`}>{data?.description ? data.description : null}</p>
      <h2 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-black'} mb-4`}>
        Subtasks ({children.filter((item) => item.isCompleted).length} of {children.length})
      </h2>
      <div className='flex flex-col'>
        {children.map((item) => (
          <div key={item._id} className={`w-full h-[3.688rem] mb-2 rounded flex items-center p-2 ${isDarkMode ? 'bg-darkbg' : 'bg-lightbg'}`} onClick={() => handleToggle(item._id)}>
            <img src={item.isCompleted ? checkbox : emptycheckbox} alt='checkbox' className='w-4 h-4 mr-2' />
            <span className={`text-xs font-bold ml-2 ${isDarkMode ? 'text-white' : 'text-black'} ${item.isCompleted ? 'line-through text-mediumgrey' : ''}`}>{item.title}</span>
          </div>
        ))}
      </div>
      <StatusSelect todo={data} />
    </div>
  );
}

export default CheckTodoModal;
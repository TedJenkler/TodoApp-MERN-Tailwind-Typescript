import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatusSelect from '../components/StatusSelect';
import { swapModal } from '../features/state/stateSlice';

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
  subtodos: string[];
}

function CheckTodoModal() {
  const modal = useSelector((state: any) => state.stateSlice.modal);
  const [data, setData] = useState<Todo | null>(null);
  const [children, setChildren] = useState<Subtodo[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const dispatch = useDispatch();
  let id: string = modal.slice(4);
  const modalRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        dispatch(swapModal(""));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSubtodos = async () => {
      try {
        const response = await fetch(`http://localhost:2000/api/subtodos/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setChildren(result.subtodos);
      } catch (error: any) {
        setError(error);
      }
    };

    fetchSubtodos();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:2000/api/todos/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.todo);
      } catch (error: any) {
        setError(error);
      }
    };

    fetchData();
  }, [id]);

  const handleToggle = useCallback(async (subtodoId: string) => {
    try {
      console.log('Toggling subtodo:', subtodoId);
  
      const response = await fetch(`http://localhost:2000/api/subtodos/toggle/${subtodoId}`, {
        method: 'PATCH',
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log('Toggle success. Updated subtodo:', result);
  
      setChildren((prevChildren) =>
        prevChildren.map((item) =>
          item._id === subtodoId ? { ...item, isCompleted: !item.isCompleted } : item
        )
      );
  
      return result;
    } catch (error) {
      console.error('Error toggling subtodo:', error);
    }
  }, []);

  return (
    <div ref={modalRef} className="w-[21.438rem] absolute bg-darkgrey top-[12.938rem] right-1/2 translate-x-1/2 p-6">
      <div>
        <h1 className="text-white mb-6 hl">{data ? data.title : null}</h1>
      </div>
      <p className="mb-6 text-mediumgrey bl">{data?.description ? data.description : null}</p>
      <h2 className="text-xs font-bold text-white mb-4">
        Subtasks ({children.filter((item) => item.isCompleted).length} of {children.length})
      </h2>
      <div className='flex flex-col'>
        {children.map((item) => (
          <label key={item._id} htmlFor={`check-${item._id}`} className='w-full h-[3.688rem] bg-darkbg mb-2 rounded flex items-center p-2'>
            <input
              id={`check-${item._id}`}
              onChange={() => handleToggle(item._id)}
              value={item._id}
              type="checkbox"
              className='mr-2'
              checked={item.isCompleted}
            />
            <span className="text-white text-xs font-bold">{item.title}</span>
          </label>
        ))}
      </div>
      <StatusSelect todo={data} />
    </div>
  );
}

export default CheckTodoModal;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import arrowdown from "../assets/arrowdown.png";
import { updateTodoById, getTodoById } from "../features/state/stateSlice";
import { AppDispatch } from "../store";
import { Todo } from '../types'

interface StatusSelectProps {
  todo: Todo;
}

const StatusSelect: React.FC<StatusSelectProps> = ({ todo }) => {
  const board = useSelector((state: any) => state.stateSlice.selectedBoard);
  const columns = useSelector((state: any) => state.stateSlice.columns);
  const selectedColumns = columns.filter((column: any) => column.boardId === board);
  const modal = useSelector((state: any) => state.stateSlice.modal);
  const id = modal.slice(4);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);
  const dispatch: AppDispatch = useDispatch();

  const [status, setStatus] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const getTodoStatusById = async (id: any) => {
    dispatch(getTodoById(id))
  };

  useEffect(() => {
    const fetchStatus = async () => {
      const todoStatus = await getTodoStatusById(id);
      setStatus(todoStatus);
    };

    fetchStatus();
  }, [id]);

  const handleSelect = () => {
    setOpenMenu(!openMenu);
  }

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setOpenMenu(false);
    dispatch(updateTodoById({todo: todo, status: newStatus, id: id}))
  };

  return (
    <div className="relative">
      <label className={`text-xs mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Current Status</label>
      <div
        onClick={handleSelect}
        className={`flex justify-between items-center w-full h-10 border border-mediumgrey/25 py-2 px-4 cursor-pointer ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'}`}
      >
        <p className="bl">{status ? selectedColumns.find((column: any) => column._id === status)?.name : null}</p>
        <img className={`h-2 w-2 transform transition-transform duration-300 ease-in-out ${openMenu ? "rotate-180" : "rotate-0"}`} src={arrowdown} alt="arrowdown" />
      </div>
      {openMenu &&
        <div className={`absolute top-[4.375rem] w-full ${isDarkMode ? 'bg-darkgrey' : 'bg-white'} rounded-lg shadow-lg mt-1 z-10`}>
          {selectedColumns.map((column: any) => (
            <div
              key={column._id}
              className={`flex items-center px-4 h-[2.438rem] cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              onClick={() => handleStatusChange(column._id)}
            >
              <p className={`bl ${isDarkMode ? 'text-white' : 'text-black'}`}>{column.name}</p>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

export default StatusSelect;
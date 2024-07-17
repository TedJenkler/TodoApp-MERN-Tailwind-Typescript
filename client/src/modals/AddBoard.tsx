import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BoardRepeater from '../components/ColumnRepeater';
import { addBoard, addColumns, swapModal } from '../features/state/stateSlice';

interface Column {
  name: string;
  boardId: string;
}

interface Board {
  name: string;
  columns: Column[];
}

const AddBoard: React.FC = () => {
  const [formData, setFormData] = useState<Board>({ name: '', columns: [] });
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
  };

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
  }, [dispatch]);

  const handleColumnsChange = (columns: Column[]) => {
    setFormData({ ...formData, columns: columns });
  };

  const handleSubmit = async () => {
    try {
      const action = await dispatch(addBoard({ name: formData.name }));
      if (addBoard.fulfilled.match(action)) {
        const boardId = action.payload.board._id;
        const columnsWithBoardId = formData.columns.map(column => ({ ...column, boardId: boardId }));
        await dispatch(addColumns({ columns: columnsWithBoardId, boardId }));
      } else {
        console.error('Failed to create board', action.payload);
      }
    } catch (error) {
      console.error('An error occurred while creating the board:', error);
    }
  };

  return (
    <div ref={modalRef} className={`absolute flex flex-col w-[21.438rem] rounded-md p-6 right-1/2 translate-x-1/2 top-[17.438rem] ${isDarkMode ? 'bg-darkgrey' : 'bg-white'}`}>
      <h1 className={`${isDarkMode ? 'text-white' : 'text-black'} hl mb-6`}>Add New Board</h1>
      <div className="mb-6">
        <label className={`${isDarkMode ? 'text-white' : 'text-black'} text-xs font-bold mb-2`}>Board Name</label>
        <input
          className={`w-full h-10 border border-mediumgrey/25 rounded bl px-4 py-2 ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'}`}
          type="text"
          value={formData.name}
          onChange={handleBoardNameChange}
        />
      </div>
      <BoardRepeater value={formData.columns} onChange={handleColumnsChange} />
      <button onClick={handleSubmit} className="bg-mainpurple text-white py-2 rounded-[1.25rem] text-[0.813rem] font-bold leading-[1.438rem] mt-4">
        Create New Board
      </button>
    </div>
  );
}

export default AddBoard;
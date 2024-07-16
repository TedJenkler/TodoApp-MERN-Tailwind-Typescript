import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import BoardRepeater from '../components/ColumnRepeater';
import { addBoard, addColumns } from '../features/state/stateSlice';
import { swapModal } from '../features/state/stateSlice';

interface Column {
  name: string;
  boardId: string;
}

interface Board {
  name: string;
  columns: Column[];
}

function AddBoard() {
  const [formData, setFormData] = useState<Board>({
    name: '',
    columns: [],
  });

  const dispatch = useDispatch();

  const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      name: e.target.value,
    });
  };
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
  })

  const handleColumnsChange = (columns: Column[]) => {
    setFormData({
      ...formData,
      columns: columns,
    });
  };

  const handleSubmit = async () => {
    try {
      const action = await dispatch(addBoard({ name: formData.name }));
  
      console.log(action);
  
      if (addBoard.fulfilled.match(action)) {
        const boardId = action.payload.board._id;
        console.log('Board created:', boardId);
  
        const columnsWithBoardId = formData.columns.map(column => ({
          ...column,
          boardId: boardId
        }));
  
        await dispatch(addColumns({ columns: columnsWithBoardId, boardId }));
      } else {
        console.error('Failed to create board', action.payload);
      }
    } catch (error) {
      console.error('An error occurred while creating the board:', error);
    } finally {
      console.log(formData);
    }
  };

  return (
    <div ref={modalRef} className="absolute flex flex-col w-[21.438rem] bg-darkgrey rounded-md p-6 right-1/2 translate-x-1/2 top-[17.438rem]">
      <h1 className="text-white hl mb-6">Add New Board</h1>
      <div className="mb-6">
        <label className="text-xs text-white font-bold mb-2">Board Name</label>
        <input
          className="w-full h-10 border border-mediumgrey/25 rounded bl bg-darkgrey px-4 py-2 text-white"
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

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BoardRepeater from '../components/ColumnRepeater';
import { editBoard, editColumns } from '../features/state/stateSlice';
import { swapModal } from '../features/state/stateSlice';

interface Column {
  name: string;
  boardId: string;
}

interface Board {
  name: string;
  columns: Column[];
}

function EditBoard() {
  const [formData, setFormData] = useState<Board>({
    name: '',
    columns: [],
  });

  const selectedBoard = useSelector((state: any) => state.stateSlice.modal).slice(9)
  const columns = useSelector((state: any) => state.stateSlice.columns.columns);
  const selectedColumns = columns?.filter((column: Column) => column.boardId === selectedBoard);
  const selectedBoardData = useSelector((state: any) => state.stateSlice.boards.boards.find((board: any) => board._id === selectedBoard));
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);

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
    if (selectedBoardData) {
      setFormData({
        name: selectedBoardData.name || '',
        columns: selectedColumns
      });
    }
  }, [selectedBoardData]);

  const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      name: e.target.value,
    });
  };

  const handleColumnsChange = (columns: Column[]) => {
    setFormData({
      ...formData,
      columns: columns,
    });
  };

  const handleSubmit = async () => {
    try {
      const action = await dispatch(editBoard({ id: selectedBoard, name: formData.name }));

      if (editBoard.fulfilled.match(action)) {
        console.log('Board edited successfully');

        const columnsWithBoardId = formData.columns.map(column => ({
          ...column,
          boardId: selectedBoard,
        }));

        dispatch(editColumns({ columns: columnsWithBoardId, boardId: selectedBoard }));
      } else {
        console.error('Failed to edit board', action.payload);
      }
    } catch (error) {
      console.error('An error occurred while editing the board:', error);
    }
  };

  console.log('formData:', formData);

  return (
    <div ref={modalRef} className={`absolute flex flex-col w-[21.438rem] ${isDarkMode ? 'bg-darkgrey' : 'bg-white'} rounded-md p-6 right-1/2 translate-x-1/2 top-[15.563rem]`}>
      <h1 className={`${isDarkMode ? 'text-white' : 'text-black'} hl mb-6`}>Edit Board</h1>
      <div className="mb-6">
        <label className={`text-xs ${isDarkMode ? 'text-white' : 'text-black'} font-bold mb-2`}>Board Name</label>
        <input
          className={`w-full h-10 border border-mediumgrey/25 rounded bl ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'} px-4 py-2`}
          type="text"
          value={formData.name}
          onChange={handleBoardNameChange}
        />
      </div>
      <BoardRepeater value={selectedColumns} onChange={handleColumnsChange} />
      <button
        onClick={handleSubmit}
        className="bg-mainpurple text-white py-2 rounded-[1.25rem] text-[0.813rem] font-bold leading-[1.438rem] mt-4"
      >
        Save Changes
      </button>
    </div>
  );
}

export default EditBoard;
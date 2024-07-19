import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BoardRepeater from '../components/ColumnRepeater';
import { editBoard, editColumns, swapModal } from '../features/state/stateSlice';

interface Column {
  name: string;
  boardId: string;
}

interface Board {
  name: string;
  columns: Column[];
}

const EditBoard: React.FC = () => {
  const [formData, setFormData] = useState<Board>({
    name: '',
    columns: [],
  });

  const selectedBoardId = useSelector((state: any) => state.stateSlice.modal.slice(9));
  const columns = useSelector((state: any) => state.stateSlice.columns.columns);
  const selectedBoardData = useSelector((state: any) => 
    state.stateSlice.boards.boards.find((board: any) => board._id === selectedBoardId)
  );
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
      const selectedColumns = columns.filter((column: Column) => column.boardId === selectedBoardId);
      setFormData({
        name: selectedBoardData.name || '',
        columns: selectedColumns || [],
      });
    }
  }, [selectedBoardData, selectedBoardId, columns]);

  const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevData => ({
      ...prevData,
      name: e.target.value,
    }));
  };

  const handleColumnsChange = (columns: Column[]) => {
    setFormData(prevData => ({
      ...prevData,
      columns: columns,
    }));
  };

  const handleSubmit = async () => {
    try {
      const action = await dispatch(editBoard({ id: selectedBoardId, name: formData.name }));

      if (editBoard.fulfilled.match(action)) {
        console.log('Board edited successfully');

        const columnsWithBoardId = formData.columns.map(column => ({
          ...column,
          boardId: selectedBoardId,
        }));

        await dispatch(editColumns({ columns: columnsWithBoardId, boardId: selectedBoardId }));
      } else {
        console.error('Failed to edit board', action.payload);
      }
    } catch (error) {
      console.error('An error occurred while editing the board:', error);
    }
  };

  return (
    <div
      ref={modalRef}
      className={`absolute bottom-1/2 translate-y-1/2 w-[21.438rem] z-50 p-6 translate-x-1/2 right-1/2 ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'} rounded-md md:w-[30rem] md:p-8 md:max-h-[80vh]`}
    >
      <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(80vh - 6rem)' }}>
        <h1 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Edit Board</h1>
        <div className="mb-6">
          <label className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Board Name</label>
          <input
            className={`w-full h-10 px-4 py-2 border border-mediumgrey/25 rounded ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'}`}
            type="text"
            value={formData.name}
            onChange={handleBoardNameChange}
          />
        </div>
        <BoardRepeater value={formData.columns} onChange={handleColumnsChange} />
        <button
          onClick={handleSubmit}
          className={`bg-mainpurple text-white text-[0.813rem] w-full h-10 font-bold leading-[1.438rem] rounded-[1.25rem] mt-4 ${isDarkMode ? 'hover:bg-mainpurple-dark' : 'hover:bg-mainpurple-light'}`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditBoard;
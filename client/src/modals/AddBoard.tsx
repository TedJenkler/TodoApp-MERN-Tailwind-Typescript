import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ColumnRepeater from '../components/ColumnRepeater';
import { addBoard, addColumns, swapModal } from '../features/state/stateSlice';
import useClickOutside from '../hooks/useClickOutside';
import { RootState, AppDispatch } from '../store';
import { Column, Board } from '../types';

const AddBoard: React.FC = () => {
  const [formData, setFormData] = useState<Board>({ name: '', columns: [] });
  const [formError, setFormError] = useState<{ name: boolean; columns: boolean }>({ name: false, columns: false });
  const dispatch = useDispatch<AppDispatch>();
  const isDarkMode = useSelector((state: RootState) => state.stateSlice.darkmode);
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, "modal");

  const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleColumnsChange = (columns: Column[], hasErrors: boolean) => {
    setFormData({ ...formData, columns });
    setFormError(prevError => ({ ...prevError, columns: hasErrors }));
  };

  const handleSubmit = async () => {
    if (!formData.name || formData.name.trim() === '') {
      setFormError({ ...formError, name: true });
      return;
    }

    if (formError.columns) {
      return;
    }

    setFormError({ name: false, columns: false });

    try {
      const action = await dispatch(addBoard({ name: formData.name }));
      if (addBoard.fulfilled.match(action)) {
        const boardId = action.payload.board._id;
        const columnsWithBoardId: Column[] = formData.columns.map(column => ({
          ...column,
          boardId,
          title: column.name
        }));
        await dispatch(addColumns({ columns: columnsWithBoardId, boardId }));
        dispatch(swapModal(''));
      } else {
        console.error('Failed to create board', action.payload);
      }
    } catch (error) {
      console.error('An error occurred while creating the board:', error);
    }
  };

  return (
    <div
      ref={modalRef}
      className={`absolute bottom-1/2 translate-y-1/2 w-[21.438rem] z-50 p-6 translate-x-1/2 right-1/2 ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'} rounded-md md:w-[30rem] md:p-8 md:max-h-[80vh]`}
    >
      <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(80vh - 6rem)' }}>
        <h1 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Add New Board</h1>
        <div className="mb-6">
          <div className='relative'>
            <label className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Board Name</label>
            <input
              className={`w-full h-10 px-4 py-2 border focus:border-mainpurple rounded-[0.25rem] ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'} ${formError.name ? "border-red" : "border-mediumgrey/25"} outline-none`}
              type="text"
              placeholder='e.g. Web Design'
              value={formData.name}
              onChange={handleBoardNameChange}
            />
            {formError.name && (
              <span className='absolute whitespace-nowrap right-4 top-[1.938rem] text-red bl'>Can’t be empty</span>
            )}
          </div>
        </div>
        <ColumnRepeater value={formData.columns} onChange={handleColumnsChange} />
        <button
          onClick={handleSubmit}
          className={`bg-mainpurple hover:bg-mainpurplehover text-white text-[0.813rem] w-full h-10 font-bold leading-[1.438rem] rounded-[1.25rem] mt-4`}
          disabled={formError.columns}
        >
          Create New Board
        </button>
      </div>
    </div>
  );
};

export default AddBoard;
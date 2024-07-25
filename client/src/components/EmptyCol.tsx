import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { swapModal } from '../features/state/stateSlice';
import Sidebar from './Sidebar';

const EmptyCol: React.FC = () => {
  const selectedBoard = useSelector((state: any) => state.stateSlice.selectedBoard);
  const boards = useSelector((state: any) => state.stateSlice.boards);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);
  const dispatch = useDispatch();

  const addBoardModal = () => {
    dispatch(swapModal('addBoard'))
  };

  const editBoardModal = () => {
    dispatch(swapModal('editBoard' + selectedBoard));
  };

  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar />
      <main className={`bg-${isDarkMode ? 'dark' : 'light'}bg w-screen h-full flex flex-col items-center justify-center overflow-hidden px-10`}>
        <h1 className={`hl text-center ${isDarkMode ? 'text-mediumgrey' : 'text-mediumgrey'} mb-6`}>
          {boards.length > 0 ? "This board is empty. Create a new column to get started." : "No Board Created. Create a new board to get started." }
        </h1>
        <button onClick={boards.length > 0 ? editBoardModal : addBoardModal} className={`bg-mainpurple h-12 w-[10.875rem] rounded-3xl text-white hm hover:bg-mainpurplehover`}>
          {boards.length > 0 ? "+ Add New Column" : "+ Add ur first Board"}
        </button>
      </main>
    </div>
  );
};

export default EmptyCol;
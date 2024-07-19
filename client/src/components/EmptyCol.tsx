import { useSelector, useDispatch } from 'react-redux';
import { swapModal } from '../features/state/stateSlice';

function EmptyCol() {
  const selecedBoard = useSelector((state: any) => state.stateSlice.selectedBoard);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);
  const dispatch = useDispatch();

  const editBoardModal = () => {
    dispatch(swapModal('editBoard' + selecedBoard));
  }

  return (
    <main className={`bg-${isDarkMode ? 'dark' : 'light'}bg w-screen h-full flex flex-col items-center justify-center overflow-hidden px-10`}>
      <h1 className={`hl text-center ${isDarkMode ? 'text-mediumgrey' : 'text-mediumgrey'} mb-6`}>
        This board is empty. Create a new column to get started.
      </h1>
      <button onClick={editBoardModal} className={`bg-mainpurple h-12 w-[10.875rem] rounded-3xl ${isDarkMode ? 'text-white' : 'text-white'} hm hover:bg-mainpurplehover`}>
        + Add New Column
      </button>
    </main>
  );
}

export default EmptyCol;

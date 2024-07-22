import { useState, useEffect, useRef, MouseEvent } from 'react';
import menu from '../assets/menu.png';
import settings from '../assets/settings.png';
import plus from '../assets/plus.png';
import CustomSelect from './CustomSelect';
import { useSelector, useDispatch } from 'react-redux';
import { selectedBoardState, swapModal } from '../features/state/stateSlice';

function Nav() {
  const boards = useSelector((state: any) => state.stateSlice.boards);
  const columns = useSelector((state: any) => state.stateSlice.columns);
  const theme = useSelector((state: any) => state.stateSlice.darkmode);
  const dispatch = useDispatch();
  const choiceRef = useRef<HTMLDivElement>(null);

  const initialSelected = boards[0]?._id;
  const [selectedBoard, setSelectedBoardLocally] = useState<number | undefined>(initialSelected);
  const [choiceBoardPopup, setChoiceBoardPopup] = useState<boolean>(false);
  const [hasColumns, setHasColumns] = useState<boolean>(columns?.some((column: any) => column.boardId === initialSelected));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (choiceRef.current && !choiceRef.current.contains(event.target as Node)) {
        setChoiceBoardPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedBoardLocally(initialSelected);
    setHasColumns(columns?.some((column: any) => column.boardId === initialSelected));
  }, [initialSelected, columns]);

  const onChangeBoard = (boardId: number) => {
    setSelectedBoardLocally(boardId);
    dispatch(selectedBoardState(boardId));
    setHasColumns(columns.some((column: any) => column.boardId === boardId));
  };

  const addModuleBtn = () => {
    if (!hasColumns) return;
    dispatch(swapModal("add"));
  };

  const EditModal = () => {
    dispatch(swapModal("editBoard" + selectedBoard));
    setChoiceBoardPopup(false);
  };

  const deleteModal = () => {
    dispatch(swapModal("deleteBoard" + selectedBoard));
    setChoiceBoardPopup(false);
  };

  const handleChoice = () => {
    setChoiceBoardPopup(!choiceBoardPopup);
  };

  return (
    <nav className={`flex justify-between items-center ${theme ? "bg-darkgrey" : "bg-white"} h-16 py-5 px-4`}>
      <div className='flex items-center gap-4'>
        <img className='h-[1.563rem] w-6' src={menu} alt='mobile menu' />
        <CustomSelect options={boards} value={selectedBoard} onChange={onChangeBoard} />
      </div>
      <div className='flex gap-4 items-center'>
        <div
          onClick={addModuleBtn}
          className={`flex items-center gap-4 cursor-pointer`}
        >
          <a
            className={`flex items-center justify-center h-8 w-12 rounded-3xl ${hasColumns ? "bg-mainpurple hover:bg-mainpurplehover" : "bg-mainpurple/25 cursor-not-allowed"}`}
          >
            <img className="h-3 w-3" src={plus} alt='plus' />
          </a>
        </div>
        <div>
          <img onClick={handleChoice} className='h-4 w-1 cursor-pointer' src={settings} alt='settings' />
          {choiceBoardPopup && (
            <div ref={choiceRef} className={`absolute flex flex-col items-center justify-between w-[12rem] h-[5.875rem] p-4 rounded-lg top-[3.75rem] right-6 ${theme ? 'bg-darkbg' : 'bg-white text-black'}`}>
              <p onClick={EditModal} className='cursor-pointer text-mediumgrey'>Edit Board</p>
              <p onClick={deleteModal} className='cursor-pointer text-red'>Delete Board</p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
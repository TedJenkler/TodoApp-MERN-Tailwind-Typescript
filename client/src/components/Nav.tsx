import React, { useState, useEffect } from 'react';
import menu from '../assets/menu.png';
import settings from '../assets/settings.png';
import plus from '../assets/plus.png';
import CustomSelect from './CustomSelect';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectedBoardState } from '../features/state/stateSlice';

function Nav() {
  const boards = useSelector((state: any) => state.stateSlice.boards.boards);
  const dispatch = useDispatch();

  const initialSelected = boards[0]._id
  const [selectedBoard, setSelectedBoardLocally] = useState<number>(initialSelected);

  useEffect(() => {
    setSelectedBoardLocally(initialSelected);
  }, [initialSelected]);

  const onChangeBoard = (boardId: number) => {
    setSelectedBoardLocally(boardId);
    dispatch(selectedBoardState(boardId));
  };

  return (
    <nav className='flex justify-between items-center bg-darkgrey h-16 py-5 px-4'>
      <div className='flex items-center gap-4'>
        <img className='h-6 w-6' src={menu} alt='mobilemenu'/>
        <CustomSelect options={boards} value={selectedBoard} onChange={onChangeBoard} />
      </div>
      <div className='flex items-center gap-4'>
        <a className='flex items-center justify-center h-8 w-12 rounded-3xl bg-mainpurple'><img className="h-3 w-3" src={plus} alt='plus' /></a>
        <img className='h-4 w-1' src={settings} alt='settings'/>
      </div>
    </nav>
  );
}

export default Nav;
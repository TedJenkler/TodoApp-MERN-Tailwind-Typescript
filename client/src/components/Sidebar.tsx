import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedBoardState, swapModal, toggleMenu } from '../features/state/stateSlice';
import ToggleTheme from './ToggleTheme';
import greyboardicon from '../assets/greyboardicon.png';
import whiteboardicon from '../assets/whiteboardicon.png';
import purpleboardicon from '../assets/purpleboardicon.png';
import slashedeye from '../assets/slashedeye.png';
import eye from '../assets/eye.png';

const Sidebar: React.FC = () => {
  const [hoveredBoardId, setHoveredBoardId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const boards = useSelector((state: any) => state.stateSlice.boards);
  const selectedBoardId = useSelector((state: any) => state.stateSlice.selectedBoard);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);
  const menu = useSelector((state: any) => state.stateSlice.menu);

  const changeBoard = (id: any) => {
    dispatch(selectedBoardState(id));
  };

  const handleModal = () => {
    dispatch(swapModal("addBoard"));
    dispatch(toggleMenu(false));
  };

  const closeMenu = () => {
    dispatch(toggleMenu(true));
  };

  return (
    <>
      {menu ? (
        <div
          className={`hidden absolute md:flex md:fixed flex-col justify-between h-[92%] top-20 min-w-[16.313rem] pt-8 ${isDarkMode ? 'bg-darkgrey' : 'bg-white'} transition-all duration-300 ease-in-out`}
        >
          <div>
            <h1 className='mx-6 text-mediumgrey text-xs font-bold tracking-[2.4px] mb-5'>
              ALL BOARDS ({boards.length})
            </h1>
            {boards?.map((board: any) => (
              <div
                key={board._id}
                className={`flex items-center h-12 w-[15rem] px-6 gap-2 rounded-r-[6.25rem] ${board._id === selectedBoardId ? "bg-mainpurple text-white" : `text-mediumgrey hover:text-mainpurple ${isDarkMode ? "hover:bg-white" : "hover:bg-mainpurple/25" }`} cursor-pointer`}
                onClick={() => changeBoard(board._id)}
                onMouseEnter={() => setHoveredBoardId(board._id)}
                onMouseLeave={() => setHoveredBoardId(null)}
              >
                <img
                  className='h-4 w-4'
                  src={board._id === selectedBoardId ? whiteboardicon : hoveredBoardId === board._id ? purpleboardicon : greyboardicon}
                  alt='board icon'
                />
                <p className='hm'>
                  {board.name}
                </p>
              </div>
            ))}
            <div className='flex items-center h-12 w-[15rem] pl-6 gap-2'>
              <img className='h-4 w-4' src={purpleboardicon} alt='purpleboardicon' />
              <button onClick={handleModal} className='hm text-mainpurple'>+ Create New Board</button>
            </div>
          </div>
          <div>
            <ToggleTheme />
            <div
              onClick={() => dispatch(toggleMenu(false))}
              className={`flex items-center h-12 w-[15rem] px-6 gap-[0.625rem] ${isDarkMode ? "hover:bg-white" : "hover:bg-mainpurple/25"} rounded-r-[6.25rem]`}
            >
              <img className='h-4 w-4' src={slashedeye} alt='sidebar toggle' />
              <button className='hm text-mainpurple'>Hide Sidebar</button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`hidden absolute md:flex md:fixed flex-col justify-end md:mt-[5rem] h-[92%] w-[3.5rem] ${isDarkMode ? "bg-darkbg" : "bg-lightbg"} transition-all duration-300 ease-in-out`}
        >
          <button
            onClick={closeMenu}
            className='flex bg-mainpurple mb-8 w-[3.5rem] h-12 rounded-r-[6.25rem] px-[1.125rem] items-center hover:bg-mainpurplehover'
          >
            <img src={eye} alt='openmenu' />
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
import React, { useState, useEffect, useRef } from 'react';
import arrowdown from '../assets/arrowdown.png';
import whiteboardicon from '../assets/whiteboardicon.png';
import greyboardicon from '../assets/greyboardicon.png';
import purpleboardicon from '../assets/purpleboardicon.png';
import ToggleTheme from './ToggleTheme';
import { useDispatch, useSelector } from 'react-redux';
import { swapModal } from '../features/state/stateSlice';

interface Option {
  _id: number;
  name: string;
}

interface CustomSelectProps {
  options: Option[];
  value: number;
  onChange: (option: number) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode); // Assuming darkmode state is correctly managed

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: Option) => {
    onChange(option._id);
    setIsOpen(false);
  };

  const getNameById = (id: number) => {
    const option = options.find((option) => option._id === id);
    return option ? option.name : '';
  };

  const addBoardModal = () => {
    dispatch(swapModal('addBoard'));
    setIsOpen(false);
  }

  return (
    <div ref={selectRef} className="relative">
      <div onClick={() => setIsOpen(!isOpen)} className="flex items-center w-[9.938rem] h-[1.438rem] cursor-pointer">
        <p className={`${isDarkMode ? "text-white" : "text-black"} hl whitespace-nowrap`}>{getNameById(value)}</p>
        <img className={`h-2 w-2 ml-2 transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform duration-300 ease-in-out`} src={arrowdown} alt="arrowdown" />
      </div>
      {isOpen && (
        <div className={`absolute top-[3.5rem] left-0 ${isDarkMode ? "bg-darkgrey" : "bg-white"} w-[16.5rem] rounded-lg`}>
          <h1 className={`px-6 pt-4 pb-5 ${isDarkMode ? "text-white" : "text-black"} text-xs font-bold tracking-[0.15rem]`}>ALL BOARDS ({options.length})</h1>
          {options.map((option) => (
            <div key={option._id} className={`flex items-center gap-2 cursor-pointer w-[15rem] h-12 rounded-r-[6.25rem] py-4 px-6 ${option._id === value ? 'font-bold text-white bg-mainpurple' : 'text-mediumgrey'}`} onClick={() => handleOptionClick(option)}>
              <img src={option._id === value ? whiteboardicon : greyboardicon} alt='icon' />
              <p className='hm'>{option.name}</p>
            </div>
          ))}
          <button className='flex justify-start items-center gap-2 w-[15rem] h-12 py-4 px-6 mb-4'>
            <img src={purpleboardicon} alt='icon' />
            <p onClick={addBoardModal} className='text-mainpurple hm'>+ Create New Board</p>
          </button>
          <ToggleTheme />
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
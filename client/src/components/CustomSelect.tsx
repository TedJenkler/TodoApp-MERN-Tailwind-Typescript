import React, { useState, useEffect, useRef } from 'react';
import arrowdown from '../assets/arrowdown.png';

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

  return (
    <div ref={selectRef} className="relative">
      <div onClick={() => setIsOpen(!isOpen)} className="flex items-center w-[9.938rem] h-[1.438rem] cursor-pointer">
        <p className="text-white hl whitespace-nowrap">{getNameById(value)}</p>
        <img className={`h-2 w-2 ml-2 transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform duration-300 ease-in-out`} src={arrowdown} alt="arrowdown" />
      </div>
      {isOpen && (
        <div className="absolute top-[2rem] left-0 bg-white w-[21.875rem] p-4 shadow-md">
          {options.map((option) => (
            <p key={option._id} className={`cursor-pointer ${option._id === value ? 'font-bold' : ''}`} onClick={() => handleOptionClick(option)}>
              {option.name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
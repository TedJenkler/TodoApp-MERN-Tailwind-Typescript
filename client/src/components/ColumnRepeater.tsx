import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import x from "../assets/x.png";
import redx from "../assets/redx.png";

interface Column {
  name: string;
  boardId: string;
}

interface ColumnRepeaterProps {
  value: Column[];
  onChange: (columns: Column[], hasErrors: boolean) => void;
}

const ColumnRepeater: React.FC<ColumnRepeaterProps> = ({ value, onChange }) => {
  const [repeater, setRepeater] = useState<Column[]>(value || []);
  const [errorRepeater, setErrorRepeater] = useState<boolean[]>([]);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);

  useEffect(() => {
    setRepeater(value);
    setErrorRepeater(value.map(column => !column.name.trim()));
  }, [value]);

  const handleRepeat = () => {
    const newColumn: Column = { name: "", boardId: "" };
    const newRepeater = [...repeater, newColumn];
    const newErrorRepeater = [...errorRepeater, true];
    setRepeater(newRepeater);
    setErrorRepeater(newErrorRepeater);
    onChange(newRepeater, newErrorRepeater.some(error => error));
  };

  const handleChange = (index: number, newName: string) => {
    const newRepeater = repeater.map((column, i) =>
      i === index ? { ...column, name: newName } : column
    );
    const newErrorRepeater = errorRepeater.map((error, i) =>
      i === index ? !newName.trim() : error
    );
    setRepeater(newRepeater);
    setErrorRepeater(newErrorRepeater);
    onChange(newRepeater, newErrorRepeater.some(error => error));
  };

  const handleRemove = (index: number) => {
    const newRepeater = repeater.filter((_, i) => i !== index);
    const newErrorRepeater = errorRepeater.filter((_, i) => i !== index);
    setRepeater(newRepeater);
    setErrorRepeater(newErrorRepeater);
    onChange(newRepeater, newErrorRepeater.some(error => error));
  };

  return (
    <div>
      <label className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Columns</label>
      {repeater.map((column, index) => (
        <div key={index} className="flex items-center justify-between mb-2 w-full relative">
          <input
            type="text"
            value={column.name}
            onChange={(e) => handleChange(index, e.target.value)}
            className={`rounded-[0.25rem] w-[16.5rem] h-10 px-4 py-2 border focus:border-mainpurple ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'} ${errorRepeater[index] ? 'border-red' : 'border-mediumgrey/25'} md:w-[24rem] outline-none`}
          />
          {errorRepeater[index] && (
            <span className="absolute right-10 text-red bl">Can't be empty</span>
          )}
          <img
            src={errorRepeater[index] ? redx : x}
            alt="Remove column"
            onClick={() => handleRemove(index)}
            className="h-[0.938rem] w-[0.938rem] cursor-pointer"
          />
        </div>
      ))}
      <button
        onClick={handleRepeat}
        className={`mt-3 ${isDarkMode ? 'text-mainpurple bg-white' : 'text-mainpurple bg-lightbg'} w-full py-2 rounded-[1.25rem] text-[0.813rem] font-bold leading-[1.438rem]`}
      >
        + Add New Column
      </button>
    </div>
  );
};

export default ColumnRepeater;
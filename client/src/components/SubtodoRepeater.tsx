import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import x from '../assets/x.png';
import redx from '../assets/redx.png';
import { Subtodo } from "../types";

interface SubtodoRepeaterProps {
  subTodos: Subtodo[];
  onChange: (newSubTodos: Subtodo[], hasError: boolean) => void;
}

const SubtodoRepeater: React.FC<SubtodoRepeaterProps> = ({ subTodos, onChange }) => {
  const [repeater, setRepeater] = useState<Subtodo[]>(subTodos || []);
  const [errorRepeater, setErrorRepeater] = useState<boolean[]>([]);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);

  useEffect(() => {
    if (subTodos) {
      setRepeater(subTodos);
      setErrorRepeater(subTodos.map(subTodo => !subTodo.title?.trim()));
    }
  }, [subTodos]);

  const addEmpty = () => {
    const newSubTodo: Subtodo = { title: "", isCompleted: false };
    const newRepeater = [...repeater, newSubTodo];
    const newErrorRepeater = [...errorRepeater, true];
    setRepeater(newRepeater);
    setErrorRepeater(newErrorRepeater);
    onChange(newRepeater, newErrorRepeater.some(error => error));
  };

  const handleSubtodoChange = (index: number, value: string) => {
    setRepeater(prevRepeater => {
      const newRepeater = prevRepeater.map((subTodo, i) =>
        i === index ? { ...subTodo, title: value } : subTodo
      );
      setErrorRepeater(prevErrors => {
        const newErrorRepeater = [...prevErrors];
        newErrorRepeater[index] = !value.trim();
        onChange(newRepeater, newErrorRepeater.some(error => error));
        return newErrorRepeater;
      });
      return newRepeater;
    });
  };

  const handleRemoveSubtodo = (index: number) => {
    setRepeater(prevRepeater => {
      const newRepeater = prevRepeater.filter((_, i) => i !== index);
      setErrorRepeater(prevErrors => {
        const newErrorRepeater = prevErrors.filter((_, i) => i !== index);
        onChange(newRepeater, newErrorRepeater.some(error => error));
        return newErrorRepeater;
      });
      return newRepeater;
    });
  };

  return (
    <div>
      <label className={`text-xs font-bold mb-2 overflow-auto ${isDarkMode ? 'text-white' : 'text-black'}`}>Subtasks</label>
      {repeater.map((subTodo, index) => (
        <div key={index} className="flex items-center justify-between mb-2 w-full relative">
          <input
            type="text"
            value={subTodo.title}
            onChange={(e) => handleSubtodoChange(index, e.target.value)}
            className={`rounded-[0.25rem] w-[16.5rem] h-10 px-4 py-2 border focus:border-mainpurple ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'} ${errorRepeater[index] ? "border-red" : "border-mediumgrey/25"} md:w-[24rem] outline-none`}
          />
          {errorRepeater[index] && (
            <span className="absolute right-10 text-red bl">Can't be empty</span>
          )}
          <img
            src={errorRepeater[index] ? redx : x}
            alt="Remove subtask"
            onClick={() => handleRemoveSubtodo(index)}
            className="h-[0.938rem] w-[0.938rem] cursor-pointer"
          />
        </div>
      ))}
      <button
        onClick={addEmpty}
        className={`mt-3 ${isDarkMode ? 'text-mainpurple bg-white' : 'text-mainpurple bg-lightbg'} w-full py-2 rounded-[1.25rem] text-[0.813rem] font-bold leading-[1.438rem]`}
      >
        Add Subtask
      </button>
    </div>
  );
};

export default SubtodoRepeater;
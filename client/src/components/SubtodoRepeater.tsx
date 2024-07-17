import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import x from '../assets/x.png';

interface Subtodo {
  title: string;
  isCompleted: boolean;
}

interface SubtodoRepeaterProps {
  subTodos: Subtodo[];
  onChange: (subTodos: Subtodo[]) => void;
}

const SubtodoRepeater: React.FC<SubtodoRepeaterProps> = ({ subTodos, onChange }) => {
  const [repeater, setRepeater] = useState<Subtodo[]>(subTodos || []);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);

  useEffect(() => {
    if (subTodos) {
      setRepeater(subTodos);
    }
  }, [subTodos]);

  const addEmpty = () => {
    const newSubTodo: Subtodo = { title: "", isCompleted: false };
    const newRepeater = [...repeater, newSubTodo];
    setRepeater(newRepeater);
    onChange(newRepeater);
  };

  const handleSubtodoChange = (index: number, value: string) => {
    const newRepeater = [...repeater];
    newRepeater[index].title = value;
    setRepeater(newRepeater);
    onChange(newRepeater);
  };

  const handleRemoveSubtodo = (index: number) => {
    const newRepeater = repeater.filter((_, i) => i !== index);
    setRepeater(newRepeater);
    onChange(newRepeater);
  };

  return (
    <div>
      <label className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Subtasks</label>
      {repeater.map((subTodo, index) => (
        <div key={index} className="flex items-center justify-between mb-2 w-full">
          <input
            type="text"
            value={subTodo.title}
            onChange={(e) => handleSubtodoChange(index, e.target.value)}
            className={`rounded-[0.25rem] w-[16.5rem] h-10 px-4 py-2 border border-mediumgrey/25 ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'}`}
          />
          <img
            src={x}
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
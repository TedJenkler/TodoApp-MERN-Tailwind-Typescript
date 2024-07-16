import React, { useState } from "react";
import x from '../assets/x.png'

interface Subtodo {
  title: string;
  isCompleted: boolean;
}

interface SubtodoRepeaterProps {
  subTodos: Subtodo[];
  onChange: (subTodos: Subtodo[]) => void;
}

const SubtodoRepeater: React.FC<SubtodoRepeaterProps> = ({ subTodos, onChange }) => {
  const [repeater, setRepeater] = useState<Subtodo[]>(subTodos);

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
      <label className="text-xs font-bold text-white mb-2">Subtasks</label>
      {repeater.map((subTodo, index) => (
        <div key={index} className="flex items-center justify-between mb-2 w-full">
          <input
            type="text"
            value={subTodo.title}
            onChange={(e) => handleSubtodoChange(index, e.target.value)}
            className="rounded-[0.25rem] w-[16.5rem] h-10 px-4 py-2 border border-mediumgrey/25 bg-darkgrey text-mediumgrey"
          />
          <img src={x} alt="x" onClick={() => handleRemoveSubtodo(index)} className="h-[0.938rem] w-[0.938rem]" />
        </div>
      ))}
      <button onClick={addEmpty} className="mt-3 text-mainpurple bg-white w-full py-2 rounded-[1.25rem] text-[0.813rem] font-bold leading-[1.438rem]">Add Subtask</button>
    </div>
  );
}

export default SubtodoRepeater;
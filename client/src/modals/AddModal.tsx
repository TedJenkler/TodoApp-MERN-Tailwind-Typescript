import React, { ChangeEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubtodoRepeater from "../components/SubtodoRepeater";
import StatusSelectNew from "../components/StatusSelectNew";
import { addTodo, addSubtodos, swapModal } from "../features/state/stateSlice";
import useClickOutside from "../hooks/useClickOutside";
import { RootState, AppDispatch } from '../store';
import { Subtodo } from '../types'
const AddModal: React.FC = () => {
  interface Column {
    _id: string;
    boardId: string;
    name: string;
  }
  interface Todo {
    title: string;
    description: string;
    subTodos: Subtodo[];
    status: string;
  }

  const dispatch = useDispatch<AppDispatch>();
  const selectedBoard = useSelector((state: any) => state.stateSlice.selectedBoard) as string;
  const columns = useSelector((state: any) => state.stateSlice.columns) as Column[];
  const modalRef = useRef<HTMLDivElement>(null);
  const isDarkMode = useSelector((state: RootState) => state.stateSlice.darkmode);

  const initialStatus = columns.find((item: Column) => item.boardId === selectedBoard);

  const [formData, setFormData] = useState<Todo>({
    title: "",
    description: "",
    subTodos: [],
    status: initialStatus ? initialStatus._id : "",
  });

  const [formError, setFormError] = useState<{ title: boolean; subtasks: boolean }>({
    title: false,
    subtasks: false,
  });

  useClickOutside(modalRef, "modal");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubtodosChange = (subTodos: Subtodo[], hasErrors: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      subTodos,
    }));
    setFormError((prevError) => ({
      ...prevError,
      subtasks: hasErrors,
    }));
  };

  const handleStatus = (status: string) => {
    setFormData((prevData) => ({
      ...prevData,
      status,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setFormError((prevError) => ({ ...prevError, title: true }));
      return;
    }

    if (formError.subtasks) {
      return;
    }

    const { title, description, status, subTodos } = formData;

    const selectedColumn = columns.find((column: Column) => column.name === status || column._id === status);
    if (!selectedColumn) {
      console.error(`Column with ID '${status}' not found in columns.`);
      return;
    }

    const nameToId = selectedColumn._id;

    try {
      const resultAction = await dispatch(addTodo({ title, description, status: nameToId })) as any;

      if (addTodo.rejected.match(resultAction)) {
        console.error('Failed to add todo:', resultAction.error.message);
        return;
      }

      const payload = resultAction.payload as { todo: { _id: string } };
      if (!payload || !payload.todo || !payload.todo._id) {
        console.error('Invalid payload structure:', resultAction.payload);
        return;
      }

      const todoId = payload.todo._id;

      await dispatch(addSubtodos({ subTodos, todoId }));

      setFormData({
        title: "",
        description: "",
        subTodos: [],
        status: initialStatus ? initialStatus._id : "",
      });
    } catch (error) {
      console.error('Failed to add todo', error);
    }

    dispatch(swapModal(""));
  };

  return (
    <div
      ref={modalRef}
      className={`absolute bottom-1/2 translate-y-1/2 w-[21.438rem] z-50 p-6 translate-x-1/2 right-1/2 ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'} rounded-md md:w-[30rem] md:p-8 md:max-h-[80rem]`}
    >
      <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(80vh - 6rem)' }}>
        <h1 className={`hl mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Add New Task</h1>
        <div className="flex flex-col mb-6">
          <div className="relative">
            <label htmlFor="title" className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Title</label>
            <input
              id="title"
              placeholder="e.g. Take coffee break"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full h-10 px-4 py-2 border focus:border-mainpurple rounded-[0.25rem] ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'} ${formError.title ? "border-red" : "border-mediumgrey/25"} outline-none`}
            />
            {formError.title && (
              <span className='absolute whitespace-nowrap right-4 top-[1.938rem] text-red bl'>Can’t be empty</span>
            )}
          </div>
        </div>
        <div className="flex flex-col mb-6">
          <label htmlFor="description" className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Description</label>
          <textarea
            id="description"
            placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`rounded-[0.25rem] h-[7rem] px-4 py-2 border border-mediumgrey/25 focus:border-mainpurple ${isDarkMode ? 'bg-darkgrey text-mediumgrey' : 'bg-white text-black'} outline-none`}
          />
        </div>
        <div className="mb-6">
          <SubtodoRepeater subTodos={formData.subTodos} onChange={handleSubtodosChange} />
        </div>
        <div className="mb-6">
          <StatusSelectNew handleStatus={handleStatus} />
        </div>
        <button
          onClick={handleSubmit}
          className={`bg-mainpurple hover:bg-mainpurplehover text-white text-[0.813rem] w-full h-10 font-bold leading-[1.438rem] rounded-[1.25rem]`}
          disabled={formError.subtasks}
        >
          Create Task
        </button>
      </div>
    </div>
  );
};

export default AddModal;
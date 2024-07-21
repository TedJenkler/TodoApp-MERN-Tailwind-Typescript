import React, { ChangeEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubtodoRepeater from "../components/SubtodoRepeater";
import StatusSelectNew from "../components/StatusSelectNew";
import { addTodo, addSubtodos, swapModal } from "../features/state/stateSlice";
import useClickOutside from "../hooks/useClickOutside";

interface Todo {
  title: string;
  description: string;
  subTodos: Subtodo[];
  status: string;
}

const AddModal: React.FC = () => {
  const dispatch = useDispatch();
  const selectedBoard = useSelector((state: any) => state.stateSlice.selectedBoard);
  const columns = useSelector((state: any) => state.stateSlice.columns);
  const modalRef = useRef<HTMLDivElement>(null);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);

  const initialStatus = columns.find((item) => item.boardId === selectedBoard);

  const [formData, setFormData] = useState<Todo>({
    title: "",
    description: "",
    subTodos: [],
    status: initialStatus._id,
  });
  const [formError, setFormError] = useState({ title: false, subtasks: false });

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

  const handleSubmit = () => {
    if (!formData.title || formData.title.trim() === '') {
      setFormError((prevError) => ({ ...prevError, title: true }));
      return;
    }

    if (formError.subtasks) {
      return;
    }

    const { title, description, status, subTodos } = formData;

    const selectedColumn = columns.find((column: any) => column.name === status || column._id === status);
    if (!selectedColumn) {
      console.error(`Column with name '${status}' not found in columns.`);
      return;
    }

    const nameToId = selectedColumn._id;

    dispatch(addTodo({ title, description, status: nameToId }))
      .then((resultAction) => {
        const todoId = resultAction.payload.todo._id;
        console.log('Todo created with ID:', todoId);
        dispatch(addSubtodos({ subTodos, todoId }));
        setFormData({
          title: "",
          description: "",
          subTodos: [],
          status: initialStatus._id,
        });
      })
      .catch((error: any) => {
        console.error('Failed to add todo', error);
      });

    console.log("Form submitted", formData);
  };

  return (
    <div ref={modalRef} className={`absolute bottom-1/2 translate-y-1/2 w-[21.438rem] z-50 p-6 translate-x-1/2 right-1/2 ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'} rounded-md md:w-[30rem] md:p-8 md:max-h-[80rem]`}>
      <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(80vh - 6rem)' }}>
        <h1 className={`hl mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Add New Task</h1>
        <div className="flex flex-col mb-6">
          <div className="relative">
            <label htmlFor="title" className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Title</label>
            <input
              id="title"
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
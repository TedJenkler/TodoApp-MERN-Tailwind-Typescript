import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubtodoRepeater from "../components/SubtodoRepeater";
import StatusSelectNew from "../components/StatusSelectNew";
import { addTodo, addSubtodos, swapModal } from "../features/state/stateSlice";

interface Todo {
  title: string;
  description: string;
  subTodos: string[];
  status: string;
}

const AddModal: React.FC = () => {
  const dispatch = useDispatch();
  const columns = useSelector((state: any) => state.stateSlice.columns.columns);
  const modalRef = useRef<HTMLDivElement>(null);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);

  const initialStatus = columns.length > 0 ? columns[0].name : '';

  const [formData, setFormData] = useState<Todo>({
    title: "",
    description: "",
    subTodos: [],
    status: initialStatus,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        dispatch(swapModal(""));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubtodosChange = (subTodos: string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      subTodos,
    }));
  };

  const handleStatus = (status: string) => {
    setFormData((prevData) => ({
      ...prevData,
      status,
    }));
  };

  const handleSubmit = () => {
    const { title, description, status, subTodos } = formData;

    const selectedColumn = columns.find((column: any) => column.name === status || column._id === status);
    if (!selectedColumn) {
      console.error(`Column with name '${status}' not found in columns.`);
      return;
    }

    const nameToId = selectedColumn._id;

    dispatch(addTodo({ title, description, status: nameToId }))
      .then((resultAction) => {
        const todoId = resultAction.payload.todo._id
        console.log('Todo created with ID:', todoId);
        dispatch(addSubtodos({ subTodos, todoId }));
        setFormData({
          title: "",
          description: "",
          subTodos: [],
          status: initialStatus,
        });
      })
      .catch((error: any) => {
        console.error('Failed to add todo', error);
      });

    console.log("Form submitted", formData);
  };

  return (
    <div ref={modalRef} className={`absolute top-[9.75rem] w-[21.438rem] p-6 translate-x-1/2 right-1/2 ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'} rounded-md`}>
      <h1 className={`hl mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Add New Task</h1>
      <div className="flex flex-col mb-6">
        <label htmlFor="title" className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Title</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={`rounded-[0.25rem] h-10 px-4 py-2 border border-mediumgrey/25 ${isDarkMode ? 'bg-darkgrey text-mediumgrey' : 'bg-white text-black'}`}
        />
      </div>
      <div className="flex flex-col mb-6">
        <label htmlFor="description" className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className={`rounded-[0.25rem] h-[7rem] px-4 py-2 border border-mediumgrey/25 ${isDarkMode ? 'bg-darkgrey text-mediumgrey' : 'bg-white text-black'}`}
        />
      </div>
      <div className="mb-6">
        <SubtodoRepeater subTodos={formData.subTodos} onChange={handleSubtodosChange} />
      </div>
      <div className="mb-6">
        <StatusSelectNew handleStatus={handleStatus} />
      </div>
      <button onClick={handleSubmit} className={`bg-mainpurple text-white text-[0.813rem] w-full h-10 font-bold leading-[1.438rem] rounded-[1.25rem] ${isDarkMode ? 'hover:bg-mainpurple-dark' : 'hover:bg-mainpurple-light'}`}>Create Task</button>
    </div>
  );
}

export default AddModal;

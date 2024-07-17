import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatusSelectNew from "../components/StatusSelectNew";
import SubtodoRepeater from "../components/SubtodoRepeater";
import { swapModal, updateTodo, updateSubtodos } from "../features/state/stateSlice";

interface Todo {
  title: string;
  description: string;
  subTodos: string[];
  status: string;
}

const EditModal: React.FC = () => {
  const todoId = useSelector((state: any) => state.stateSlice.modal).slice(8);
  const [formData, setFormData] = useState<Todo>({
    title: "",
    description: "",
    subTodos: [],
    status: ""
  });

  const dispatch = useDispatch();
  const columns = useSelector((state: any) => state.stateSlice.columns.columns);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);
  const modalRef = React.useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await fetch(`http://localhost:2000/api/todos/${todoId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch todo');
        }
        const data = await response.json();
        setFormData(data.todo);
      } catch (error: any) {
        console.log('Cannot fetch todo', error);
      }
    };

    if (todoId) {
      fetchTodo();
    }
  }, [todoId]);

  useEffect(() => {
    const fetchSubtodos = async () => {
      try {
        const response = await fetch(`http://localhost:2000/api/subtodos/${todoId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch subtodos');
        }
        const data = await response.json();
        setFormData(prevData => ({
          ...prevData,
          subTodos: data.subtodos
        }));
      } catch (error: any) {
        console.log('Failed to fetch subtodos', error);
        setFormData(prevData => ({
          ...prevData,
          subTodos: []
        }));
      }
    };

    if (todoId) {
      fetchSubtodos();
    }
  }, [todoId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubtodosChange = (subTodos: string[]) => {
    setFormData(prevData => ({
      ...prevData,
      subTodos: subTodos,
    }));
  };

  const handleStatus = (status: string) => {
    setFormData(prevData => ({
      ...prevData,
      status,
    }));
  };

  const handleSubmit = () => {
    const { title, description, status, subTodos } = formData;

    const selectedColumn = columns.find((column: any) => column.name === status || column._id === status);
    if (!selectedColumn) {
      console.error(`Column with name or _id '${status}' not found in columns.`);
      return;
    }

    const nameToId = selectedColumn._id;

    dispatch(updateTodo({
      id: todoId,
      title,
      description,
      status: nameToId,
    }))
      .then(() => {
        dispatch(updateSubtodos({ subTodos, todoId }));
        dispatch(swapModal(""));
      })
      .catch((error: any) => {
        console.error('Failed to update todo', error);
      });

    console.log("Form submitted", formData);
  };

  return (
    <div
      ref={modalRef}
      className={`absolute top-[9.75rem] w-[21.438rem] p-6 ${isDarkMode ? 'bg-darkgrey' : 'bg-white'} translate-x-1/2 right-1/2 rounded-md`}
    >
      <h1 className={`hl mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Edit Task</h1>
      <div className="flex flex-col mb-6">
        <label htmlFor="title" className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Title</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`rounded-[0.25rem] h-10 px-4 py-2 border border-mediumgrey/25 ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'}`}
        />
      </div>
      <div className="flex flex-col mb-6">
        <label htmlFor="description" className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`rounded-[0.25rem] h-[7rem] px-4 py-2 border border-mediumgrey/25 ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'}`}
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
        className={`flex items-center justify-center ${isDarkMode ? 'bg-mainpurple text-white' : 'bg-mainpurple text-white'} text-[0.813rem] w-full h-10 font-bold leading-[1.438rem] rounded-[1.25rem]`}
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditModal;
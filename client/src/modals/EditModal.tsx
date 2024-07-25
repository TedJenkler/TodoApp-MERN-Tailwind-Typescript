import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubtodoRepeater from "../components/SubtodoRepeater";
import StatusSelectNew from "../components/StatusSelectNew";
import { swapModal, updateTodo, updateSubtodos, getTodoById } from "../features/state/stateSlice";
import useClickOutside from "../hooks/useClickOutside";
import { AppDispatch, RootState } from "../store";

interface Todo {
  title: string;
  description: string;
  subTodos: string[];
  status: string;
}

interface Subtodo {
  id: string;
  todoId: string;
  title: string;
  completed: boolean;
}

interface Column {
  _id: string;
  name: string;
}

const EditModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const todoId = useSelector((state: any) => state.stateSlice.modal?.slice(8));
  const columns = useSelector((state: any) => state.stateSlice.columns);
  const subtodos = useSelector((state: any) => state.stateSlice.subtodos);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Todo>({
    title: "",
    description: "",
    subTodos: [],
    status: ""
  });
  const [formError, setFormError] = useState({ title: false, subtasks: false });

  useClickOutside(modalRef, "modal");

  useEffect(() => {
    if (todoId) {
      dispatch(getTodoById(todoId))
        .then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            const todoData: any = response.payload;
            const selectedSubtodos = subtodos.filter((item: Subtodo) => item.todoId === todoId);
            setFormData({
              ...todoData.todo,
              subTodos: selectedSubtodos.map((subtodo: any) => subtodo),
            });
          } else {
            console.error("Failed to fetch todo");
          }
        })
        .catch((error) => console.error("Error fetching todo:", error));
    }
  }, [todoId, subtodos, dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubtodosChange = (subTodos: string[], hasErrors: boolean) => {
    setFormData(prevData => ({
      ...prevData,
      subTodos,
    }));
    setFormError(prevError => ({
      ...prevError,
      subtasks: hasErrors,
    }));
  };

  const handleStatus = (status: string) => {
    setFormData(prevData => ({
      ...prevData,
      status,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      setFormError(prevError => ({ ...prevError, title: true }));
      return;
    }

    if (formError.subtasks) {
      return;
    }

    const { title, description, status, subTodos } = formData;

    const selectedColumn = columns.find((column: Column) => column.name === status || column._id === status);
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
    <div ref={modalRef} className={`absolute bottom-1/2 translate-y-1/2 w-[21.438rem] z-50 p-6 translate-x-1/2 right-1/2 ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'} rounded-md md:w-[30rem] md:p-8 md:max-h-[80vh]`}>
      <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(80vh - 6rem)' }}>
        <h1 className={`hl mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Edit Task</h1>
        <div className="flex flex-col mb-6">
          <div className="relative">
            <label htmlFor="title" className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Title</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
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
            onChange={handleChange}
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
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditModal;
import { useEffect, useRef } from "react";
import { deleteTodo, swapModal } from "../features/state/stateSlice";
import { useDispatch, useSelector } from "react-redux";

function DeleteTodo() {
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const todoid = useSelector((state: any) => state.stateSlice.modal);
  const id = todoid.slice(10);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        dispatch(swapModal(""));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  const handleDelete = () => {
    dispatch(deleteTodo(id));
    dispatch(swapModal(""));
  };

  return (
    <div
      ref={modalRef}
      className={`absolute w-[21.438rem] p-6 right-1/2 translate-x-1/2 top-[21.438rem] rounded-md ${
        isDarkMode ? "bg-darkgrey" : "bg-white"
      }`}
    >
      <h1 className={`${isDarkMode ? "text-red" : "text-black"} hl mb-6`}>
        Delete this task?
      </h1>
      <p className="text-mediumgrey bl mb-6">
        Are you sure you want to delete the ‘Build settings UI’ task and its
        subtasks? This action cannot be reversed.
      </p>
      <button
        onClick={handleDelete}
        className={`rounded-[1.25rem] h-10 w-full font-bold ${
          isDarkMode
            ? "bg-red text-white"
            : "bg-red text-white"
        } mb-4`}
      >
        Delete
      </button>
      <button
        onClick={() => {
          dispatch(swapModal(""));
        }}
        className={`rounded-[1.25rem] h-10 w-full font-bold ${
          isDarkMode
            ? "bg-white text-mainpurple"
            : "bg-lightbg text-mainpurple"
        }`}
      >
        Cancel
      </button>
    </div>
  );
}

export default DeleteTodo;
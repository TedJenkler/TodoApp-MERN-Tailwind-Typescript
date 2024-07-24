import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { swapModal, deleteBoard } from "../features/state/stateSlice";
import useClickOutside from "../hooks/useClickOutside";
import { AppDispatch } from "../store";

function DeleteBoard() {
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const id = useSelector((state: any) => state.stateSlice.selectedBoard);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);

  useClickOutside(modalRef, "modal");

  const handleDelete = () => {
    if (id) {
      dispatch(deleteBoard(id));
    }
    dispatch(swapModal(""));
  };

  return (
    <div
      ref={modalRef}
      className={`absolute w-[21.438rem] z-50 p-6 rounded-md bottom-1/2 translate-y-1/2 right-1/2 translate-x-1/2 ${
        isDarkMode ? 'bg-darkgrey' : 'bg-white'
      } md:w-[30rem] md:p-8`}
    >
      <div>
        <h1 className='text-red hl mb-6'>
          Delete this board?
        </h1>
        <p className="text-mediumgrey bl mb-6">
          Are you sure you want to delete this board? This action will remove all
          columns and tasks and cannot be reversed.
        </p>
      </div>
      <div className="md:flex md:gap-4">
        <button
          onClick={handleDelete}
          className={`bg-red hover:bg-redhover h-10 w-full rounded-[1.25rem] text-white font-bold mb-4`}
        >
          Delete
        </button>
        <button
          onClick={() => {
            dispatch(swapModal(''));
          }}
          className={`${isDarkMode ? 'bg-white hover:bg-mainpurple/25' : 'bg-lightbg hover:bg-mainpurple/25'} h-10 w-full rounded-[1.25rem] text-mainpurple font-bold`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteBoard;
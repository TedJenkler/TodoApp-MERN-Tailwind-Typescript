import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { swapModal, deleteBoard } from "../features/state/stateSlice";

function DeleteBoard() {
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const id = useSelector((state: any) => state.stateSlice.selectedBoard);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        dispatch(swapModal(''));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch]);

  const handleDelete = () => {
    dispatch(deleteBoard(id));
  };

  return (
    <div ref={modalRef} className="absolute w-[21.438rem] p-6 bg-darkgrey rounded-md right-1/2 translate-x-1/2 top-[21.438rem]">
      <h1 className="text-red hl mb-6">Delete this board?</h1>
      <p className="text-mediumgrey bl mb-6">Are you sure you want to delete this board? This action will remove all columns and tasks and cannot be reversed.</p>
      <button onClick={handleDelete} className="bg-red h-10 w-full rounded-[1.25rem] text-white font-bold mb-4">Delete</button>
      <button onClick={() => { dispatch(swapModal("")) }} className="bg-white h-10 w-full rounded-[1.25rem] text-mainpurple font-bold">Cancel</button>
    </div>
  );
}

export default DeleteBoard;
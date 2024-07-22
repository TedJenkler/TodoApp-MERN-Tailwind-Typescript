import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBoards, getColumns, getTodos, getSubtodos, selectedBoardState } from "./features/state/stateSlice";
import { AppDispatch, RootState } from "./store";
import Nav from "./components/Nav";
import NavDesktop from "./components/NavDesktop";
import LoadingPage from "./LoadingPage";
import EmptyCol from "./components/EmptyCol";
import DisplayData from "./components/DisplayData";
import CheckTodoModal from "./modals/CheckTodoModal";
import AddModal from "./modals/AddModal";
import EditModal from "./modals/EditModal";
import AddBoard from "./modals/AddBoard";
import EditBoard from "./modals/EditBoard";
import DeleteBoard from "./modals/DeleteBoard";
import DeleteTodo from "./modals/DeleteTodo";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const boards = useSelector((state: any) => state.stateSlice.boards);
  const columns = useSelector((state: any) => state.stateSlice.columns);
  const loading = useSelector((state: RootState) => state.stateSlice.loading);
  const modal = useSelector((state: any) => state.stateSlice.modal);
  const theme = useSelector((state: any) => state.stateSlice.darkmode);

  useEffect(() => {
    dispatch(getBoards());
    dispatch(getColumns());
    dispatch(getTodos());
    dispatch(getSubtodos());
  }, [dispatch]);

  useEffect(() => {
    if (boards?.length > 0) {
      dispatch(selectedBoardState(boards[0]?._id));
    }
  }, [boards, dispatch]);

  if (loading || !boards) {
    return (
      <div className="App">
        <LoadingPage />
      </div>
    );
  }

  const regex = /^todo[a-zA-Z0-9_-]{5,}$/;
  const regex2 = /^edittodo[a-zA-Z0-9_-]{5,}$/;
  const regex3 = /^deletetodo[a-zA-Z0-9_-]{5,}$/;

  return (
    <div className={`App h-screen overflow-x-hidden ${theme ? 'bg-darkbg' : 'bg-lightbg'}`}>
      {modal === "" ? 
      <div className="md:hidden md:absolute">
        <Nav />
      </div>
      :
      <div className="md:hidden md:absolute brightness-50">
        <Nav />
      </div>
      }
      {modal === "" ? 
      <div className="hidden absolute md:flex md:relative">
        <NavDesktop />
      </div>
      :
      <div className="hidden absolute md:flex md:relative brightness-50">
        <NavDesktop />
      </div>
      }
      {typeof modal === 'string' && regex.test(modal) ? <CheckTodoModal /> : null}
      {typeof modal === 'string' && regex2.test(modal) ? <EditModal /> : null}
      {typeof modal === 'string' && modal === 'add' ? <AddModal /> : null}
      {typeof modal === 'string' && modal === 'addBoard' ? <AddBoard /> : null}
      {typeof modal === 'string' && modal.includes('editBoard') ? <EditBoard /> : null}
      {typeof modal === 'string' && modal.includes('deleteBoard') ? <DeleteBoard /> : null}
      {typeof modal === 'string' && regex3.test(modal) ? <DeleteTodo /> : null}
      {modal === "" ? !columns || columns.length === 0 ? <EmptyCol /> : <DisplayData /> :
      <div className="brightness-50">
        {!columns || columns.length === 0 ? <EmptyCol /> : <DisplayData />}
      </div>
      }
        
    </div>
  );
}

export default App;
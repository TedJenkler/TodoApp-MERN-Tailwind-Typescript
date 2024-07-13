import Nav from "./components/Nav";
import { useDispatch, useSelector } from "react-redux";
import { getBoards, getColumns, getTodos, getSubtodos } from "./features/state/stateSlice";
import { AppDispatch, RootState } from "./store";
import { useEffect } from "react";
import LoadingPage from "./LoadingPage";
import EmptyCol from "./components/EmptyCol";
import DisplayData from "./components/DisplayData";
import { selectedBoardState } from "./features/state/stateSlice";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const boards = useSelector((state: any) => state.stateSlice.boards.boards);
  const columns = useSelector((state: any) => state.stateSlice.columns.columns);
  const todos = useSelector((state: any) => state.stateSlice.todos.todos);
  const subtodos = useSelector((state: any) => state.stateSlice.subtodos.subtodos);
  const loading = useSelector((state: RootState) => state.stateSlice.loading);

  useEffect(() => {
    dispatch(getBoards());
    dispatch(getColumns());
    dispatch(getTodos());
    dispatch(getSubtodos());
  }, [dispatch]);

  if (loading || !boards || !columns || !todos || !subtodos) {
    return (
      <div className="App">
        <LoadingPage />
      </div>
    );
  } else {
    dispatch(selectedBoardState(boards[0]._id));
  }

  return (
    <div className="App">
      <Nav />
      {boards.length === 0 ? <EmptyCol /> : <DisplayData />}
    </div>
  );
}

export default App;
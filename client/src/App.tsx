import Nav from "./components/Nav";
import { useDispatch, useSelector } from "react-redux";
import { getBoards } from "./features/state/stateSlice";
import { AppDispatch, RootState } from "./store";
import { useEffect } from "react";
import LoadingPage from "./LoadingPage";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const boards = useSelector((state: RootState) => state.stateSlice.boards);
  const loading = useSelector((state: RootState) => state.stateSlice.loading);

  useEffect(() => {
    dispatch(getBoards());
  }, [dispatch]);

  return (
    <div className="App">
      {loading ? (
        <LoadingPage />
      ) : (
        <div>
          <Nav />
        </div>
      )}
    </div>
  );
}

export default App;
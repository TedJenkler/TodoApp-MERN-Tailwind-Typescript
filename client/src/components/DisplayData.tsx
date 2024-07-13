import blue from '../assets/blue.png';
import purple from '../assets/purple.png';
import green from '../assets/green.png';
import { useSelector } from 'react-redux';

function DisplayData() {
  const boards = useSelector((state: any) => state.stateSlice.boards.boards);
  const columns = useSelector((state: any) => state.stateSlice.columns.columns);
  const todos = useSelector((state: any) => state.stateSlice.todos.todos);
  const selectedBoardId = useSelector((state: any) => state.stateSlice.selectedBoard);

  const filteredColumns = columns.filter(column => column.boardId === selectedBoardId);

  return (
    <main className='bg-darkbg h-screen px-4 py-6'>
      {filteredColumns.length > 0 && (
        <>
          {filteredColumns.map((column: any, index: number) => (
            <section key={index}>
              <div className='flex items-center gap-3'>
                {index === 0 && <img className='h-4 w-4' src={blue} alt='dot' />}
                {index === 1 && <img className='h-4 w-4' src={purple} alt='dot' />}
                {index === 2 && <img className='h-4 w-4' src={green} alt='dot' />}
                <h2 className='hs text-mediumgrey'>{column.name.toUpperCase()} ({column.todos.length})</h2>
              </div>
              {todos.filter(todo => todo.status === column._id).map(todo => (
                <div key={todo._id} className='flex items-center gap-3 mt-4'>
                  <h3 className='text-white'>{todo.title}</h3>
                </div>
              ))}
            </section>
          ))}
        </>
      )}
    </main>
  );
}

export default DisplayData;
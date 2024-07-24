import { useSelector } from "react-redux";
import downarrow from "../assets/arrowdown.png";
import { useState } from "react";

interface StatusSelectNewProps {
  handleStatus: (status: string) => void;
}

const StatusSelectNew: React.FC<StatusSelectNewProps> = ({ handleStatus }) => {
  const selectedBoard = useSelector((state: any) => state.stateSlice.selectedBoard);
  const columns = useSelector((state: any) => state.stateSlice.columns);
  const isDarkMode = useSelector((state: any) => state.stateSlice.darkmode);
  
  const selectedColumns = columns.filter((item: any) => item.boardId === selectedBoard);
  
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(selectedColumns[0]?.name || '');

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setOpenMenu(false);
    handleStatus(status);
  };

  console.log(handleStatus)
  console.log(selectedStatus)

  return (
    <>
      <div onClick={() => setOpenMenu(!openMenu)} className="flex flex-col justify-center relative">
        <label className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Status</label>
        <div className={`flex items-center justify-between w-full h-10 border border-mediumgrey/25 rounded-[0.25rem] px-4 py-2 cursor-pointer ${isDarkMode ? 'bg-darkgrey text-white' : 'bg-white text-black'}`}>
          <p className="bl">{selectedStatus}</p>
          <img className={`h-2 w-2 transform transition-transform delay-300 ease-in-out ${openMenu ? "rotate-180" : "rotate-0"}`} src={downarrow} alt="downarrow" />
        </div>
        {openMenu && (
          <div className={`absolute top-full mt-2 w-full border border-mediumgrey/25 rounded-[0.25rem] z-10 ${isDarkMode ? 'bg-darkgrey' : 'bg-white'}`}>
            {selectedColumns.map((item: any) => (
              <div key={item.id} className={`px-4 py-2 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`} onClick={() => handleStatusSelect(item.name)}>
                <p className={`${isDarkMode ? 'text-white' : 'text-black'}`}>{item.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default StatusSelectNew;
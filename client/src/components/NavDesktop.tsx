import React, { useState, useEffect, useRef } from 'react';
import settings from '../assets/settings.png';
import logo from '../assets/logodesktop.png';
import lightlogo from "../assets/logodesktoplight.png";
import { useDispatch, useSelector } from 'react-redux';
import { swapModal, toggleMenu } from '../features/state/stateSlice';

function NavDesktop() {
    const dispatch = useDispatch();
    const boards = useSelector((state: any) => state.stateSlice.boards.boards);
    const toggle = useSelector((state: any) => state.stateSlice.menu);
    const theme = useSelector((state: any) => state.stateSlice.darkmode);
    const selectedBoard = useSelector((state: any) => state.stateSlice.selectedBoard);
    const [choiceBoardPopup, setChoiceBoardPopup] = useState<boolean>(false);
    const choiceRef = useRef<HTMLDivElement>(null);

    const boardName = boards?.find((item) => item._id === selectedBoard);

    const handleMenu = () => {
        dispatch(toggleMenu(!toggle));
    };

    const handleAddModal = () => {
        dispatch(swapModal("add"));
    };

    const EditModal = () => {
        dispatch(swapModal("editBoard" + selectedBoard));
        setChoiceBoardPopup(false);
    };

    const deleteModal = () => {
        dispatch(swapModal("deleteBoard" + selectedBoard));
        setChoiceBoardPopup(false);
    };

    const handleChoice = () => {
        setChoiceBoardPopup(!choiceBoardPopup);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (choiceRef.current && !choiceRef.current.contains(event.target as Node)) {
                setChoiceBoardPopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`relative flex justify-between items-center h-[5.063rem] w-full pr-6 py-7 ${theme ? 'bg-darkgrey text-white' : 'bg-white text-black'}`}>
            <div className='flex items-center gap-6'>
                <div onClick={handleMenu} className={`flex items-center border-r transition-transform ${toggle ? 'w-[16.313rem] h-[5.063rem]' : 'w-[12.563rem] h-[5.063rem]'} ${theme ? 'bg-darkgrey text-white border-mediumgrey/25' : 'bg-white text-black border-mediumgrey/25'} pl-6`}>
                    <div className='flex items-center h-[5.063rem] w-[16.313rem]'>
                        <img src={theme ? logo : lightlogo} alt='logo' />
                    </div>
                </div>
                <h1 className={`text-xl font-bold ${theme ? 'text-white' : 'text-black'}`}>{boardName?.name}</h1>
            </div>
            <div className='flex items-center gap-6'>
                <button onClick={handleAddModal} className='bg-mainpurple h-12 w-[10.25rem] rounded-3xl text-white'>+ Add New Task</button>
                <div className="relative">
                    <img onClick={handleChoice} className='cursor-pointer h-5 w-[0.289rem]' src={settings} alt='settings' />
                    {choiceBoardPopup && (
                        <div ref={choiceRef} className={`absolute flex flex-col items-center justify-between w-[12rem] h-[5.875rem] p-4 rounded-lg top-[3.75rem] right-0 ${theme ? 'bg-darkgrey text-white' : 'bg-white text-black'}`}>
                            <p onClick={EditModal} className='cursor-pointer'>Edit Board</p>
                            <p onClick={deleteModal} className='cursor-pointer text-red'>Delete Board</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NavDesktop;
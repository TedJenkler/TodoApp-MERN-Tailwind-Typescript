import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { swapModal } from "../features/state/stateSlice";

function useClickOutside(ref: React.RefObject<HTMLElement>, mode: String, onChange?: (value: boolean) => void) {
    const dispatch = useDispatch();
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(ref.current && !ref.current.contains(event.target as Node)) {
                if(mode === "modal") {
                    dispatch(swapModal(""));
                }
                if(mode === "toggle") {
                    if(onChange) {
                        onChange(false)
                    }
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }

    }, [dispatch, mode, onChange, ref])
}

export default useClickOutside
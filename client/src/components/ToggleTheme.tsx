import moon from "../assets/moon.png";
import sun from "../assets/sun.png";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toggleDarkmode } from "../features/state/stateSlice";

function ToggleTheme() {
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsChecked(true);
      dispatch(toggleDarkmode(true));
    } else {
      setIsChecked(false);
      dispatch(toggleDarkmode(false));
    }
  }, [dispatch]);

  const toggleTheme = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (newChecked) {
      localStorage.setItem("theme", "dark");
      dispatch(toggleDarkmode(true));
    } else {
      localStorage.setItem("theme", "light");
      dispatch(toggleDarkmode(false));
    }
  };

  return (
    <div className="flex justify-center pb-4 px-4">
      <div className={`flex items-center justify-center ${isChecked ? 'bg-darkbg' : 'bg-lightbg'} h-12 w-full rounded-md gap-6`}>
        <img src={sun} alt="lightmode" />
        <div className="flex items-center">
          <input
            type="checkbox"
            id="toggle"
            className="hidden"
            checked={isChecked}
            onChange={toggleTheme}
          />
          <label
            htmlFor="toggle"
            className="flex items-center cursor-pointer"
          >
            <div className="relative">
              <div className="w-10 h-5 bg-mainpurple rounded-full shadow-inner"></div>
              <div
                className={`toggle-dot absolute bottom-1/2 translate-y-1/2 w-4 h-4 bg-white rounded-full shadow ${
                  isChecked ? "right-1 bg-white" : "left-1 bg-white"
                } transition`}
              ></div>
            </div>
          </label>
        </div>
        <img src={moon} alt="darkmode" />
      </div>
    </div>
  );
}

export default ToggleTheme;
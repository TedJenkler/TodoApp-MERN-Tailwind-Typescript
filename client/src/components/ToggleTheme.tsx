import moon from "../assets/moon.png";
import sun from "../assets/sun.png";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkmode } from "../features/state/stateSlice";

function ToggleTheme() {
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();
  const menu = useSelector((state: any) => state.stateSlice.menu);
  const mobilemenu = useSelector((state: any) => state.stateSlice.menuMobile);

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
            onChange={menu || mobilemenu ? toggleTheme : undefined}
          />
          <label
            htmlFor="toggle"
            className="flex items-center cursor-pointer"
          >
            <div className="relative">
              <div className="w-10 h-5 bg-mainpurple rounded-full shadow-inner hover:bg-mainpurplehover"></div>
              <label
                htmlFor="toggle"
                className={`toggle-dot absolute bottom-1/2 translate-y-1/2 w-4 h-4 bg-white rounded-full shadow ${
                  isChecked ? "right-[3px] bg-white" : "left-[3px] bg-white"
                } transition`}
              ></label>
            </div>
          </label>
        </div>
        <img src={moon} alt="darkmode" />
      </div>
    </div>
  );
}

export default ToggleTheme;
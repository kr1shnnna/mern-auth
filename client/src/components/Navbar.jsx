import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
const Navbar = () => {

  const navigate=useNavigate();
  
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} className="w-32 sm:w-32" />

      <button
        className="
    flex
    items-center
    gap-2

    px-7
    py-2.5

    rounded-full

    bg-white/5
    backdrop-blur-xl

    border
    border-white/25

    text-white
    font-semibold

    shadow-[0_8px_32px_rgba(31,38,135,0.2)]

    hover:bg-white/15
    hover:border-pink-300/40
    hover:shadow-[0_8px_40px_rgba(255,192,203,0.25)]
    hover:scale-105

    transition-all
    duration-300
  "
      >
        Login
        <img src={assets.arrow_icon} className="w-4 h-4 invert" alt="arrow" />
      </button>
    </div>
  );
};

export default Navbar;

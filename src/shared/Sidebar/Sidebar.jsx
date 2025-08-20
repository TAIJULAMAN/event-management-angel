/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";
import { FaRegBookmark, FaRegUser } from "react-icons/fa";
import { IoMdInformationCircleOutline, IoMdSettings } from "react-icons/io";
import {
  IoBagAddOutline,
  IoCloseSharp,
  IoLogInOutline,
} from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { SlArrowDown } from "react-icons/sl";
import { GoQuestion } from "react-icons/go";
import { TbBrandWechat } from "react-icons/tb";
import { CiBoxList } from "react-icons/ci";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path;

  return (
    <div
      className={`fixed lg:static bg-[#EDF1ED] text-[#0D0D0D] w-[70%] sm:w-[70%] md:w-[15%] lg:w-[15%] h-screen overflow-y-auto py-5 md:py-0 z-50 transition-transform ${isOpen ? "translate-x-0 top-0 left-0 " : "-translate-x-full"
        } lg:translate-x-0`}
    >
      {/* Close Button (Mobile Only) */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 lg:hidden text-white bg-[#0D0D0D] focus:outline-none p-2 rounded-full"
      >
        <IoCloseSharp />
      </button>

      {/* Sidebar Menu */}
      <ul className="mt-10 px-5 text-[10px]">
        {/* Dashboard Page */}
        <Link to="/">
          <li
            className={`flex items-center gap-2 cursor-pointer transition-all duration-300 ease-in-out ${isActive("/")
              ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
              : ""
              }`}
          >
            <RxDashboard className="w-5 h-5" />
            <p className="text-lg font-semibold">Dashboard</p>
          </li>
        </Link>

        {/* User Management */}
        <Link to="/user-details">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${isActive("/user-details")
              ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
              : ""
              }`}
          >
            <FaRegUser className="w-5 h-5" />
            <p className="text-lg font-semibold">User Management</p>
          </li>
        </Link>
        {/* Event Management */}
        <Link to="">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${isActive("/user-details")
              ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
              : ""
              }`}
          >
            <CiBoxList className="w-5 h-5" />
            <p className="text-lg font-semibold">Event Management</p>
          </li>
        </Link>
        {/* Group Management */}
        <Link to="">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${isActive("/user-details")
              ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
              : ""
              }`}
          >
            <CiBoxList className="w-5 h-5" />
            <p className="text-lg font-semibold">Group Management</p>
          </li>
        </Link>
        {/* Chat Management */}
        <Link to="/chat-management">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${isActive("/user-details")
              ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
              : ""
              }`}
          >
            <CiBoxList className="w-5 h-5" />
            <p className="text-lg font-semibold">Chat Management</p>
          </li>
        </Link>
        {/*  Service */}
        <Link to="/media-social">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${isActive("/services")
              ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
              : ""
              }`}
          >
            <IoBagAddOutline className="w-5 h-5" />
            <p className="text-lg font-semibold">Media & Social</p>
          </li>
        </Link>
        {/* Add Roles */}
        <Link to="/roles">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${isActive("/roles")
              ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
              : ""
              }`}
          >
            <IoBagAddOutline className="w-5 h-5" />
            <p className="text-lg font-semibold">Interactivity</p>
          </li>
        </Link>

        {/* Chat */}
        <Link to="/chat">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${isActive("/chat")
              ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
              : ""
              }`}
          >
            <TbBrandWechat className="w-5 h-5" />
            <p className="text-lg font-semibold">Support Chat</p>
          </li>
        </Link>

        <Link to="/privacy-policy">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${isActive("/privacy-policy")
              ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
              : ""
              }`}
          >
            <MdOutlinePrivacyTip className="w-5 h-5 text-lg font-semibold" />
            <p className="text-lg font-semibold">Privacy Policy</p>
          </li>
        </Link>

        <Link to="/terms-and-condition">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${isActive("/terms-and-condition")
              ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
              : ""
              }`}
          >
            <FaRegBookmark className="w-5 h-5 text-lg font-semibold" />
            <p className="text-lg font-semibold">Terms and Conditions</p>
          </li>
        </Link>



      </ul>

      {/* Logout Button */}
      <div className="absolute mt-8 md:mt-20 mmd:mt-20 w-full px-5">
        <Link to="/sign-in">
          <button
            className="flex items-center gap-4 w-full py-3 rounded-lg bg-[#89D0C9] text-white px-3 py-3 rounded-lg duration-200 text-white justify-center "
          >
            <IoLogInOutline className="w-5 h-5 font-bold" />
            <span>Logout</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

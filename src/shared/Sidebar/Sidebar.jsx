/* eslint-disable react/prop-types */
import  { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegBookmark } from "react-icons/fa";
import {
  IoBagAddOutline,
  IoCloseSharp,
  IoLogOutOutline,
} from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineEventNote, MdOutlinePrivacyTip } from "react-icons/md";
import { TbBrandWechat, TbReport } from "react-icons/tb";
import { LuUsers } from "react-icons/lu";
import { TiMediaFastForwardOutline } from "react-icons/ti";
import { Modal } from "antd";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/Slice/authSlice";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path;

  const showLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsLogoutModalOpen(false);
    navigate("/sign-in");
  };

  const handleCancel = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div
      className={`fixed lg:static bg-[#EDF1ED] text-[#0D0D0D] w-[70%] sm:w-[70%] md:w-[15%] lg:w-[15%] h-screen overflow-y-auto py-5 md:py-0 z-50 transition-transform ${
        isOpen ? "translate-x-0 top-0 left-0 " : "-translate-x-full"
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
            className={`flex items-center gap-2 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/")
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
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/user-details")
                ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
                : ""
            }`}
          >
            <LuUsers className="w-5 h-5" />
            <p className="text-lg font-semibold">User Management</p>
          </li>
        </Link>
        {/* Event Management */}
        <Link to="/event-management">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/event-management")
                ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
                : ""
            }`}
          >
            <MdOutlineEventNote className="w-5 h-5" />
            <p className="text-lg font-semibold">Event Management</p>
          </li>
        </Link>
        {/*  Media & Social*/}
        <Link to="/all-event-groups">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/all-event-groups")
                ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
                : ""
            }`}
          >
            <TiMediaFastForwardOutline className="w-5 h-5" />
            <p className="text-lg font-semibold">All Event Groups</p>
          </li>
        </Link>
        {/* all-event-chatroom */}
        <Link to="/all-event-chatroom">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/all-event-chatroom")
                ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
                : ""
            }`}
          >
            <IoBagAddOutline className="w-5 h-5" />
            <p className="text-lg font-semibold">All Event Chatroom</p>
          </li>
        </Link>

        {/* Chat */}
        <Link to="/chat">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/chat")
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
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/privacy-policy")
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
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/terms-and-condition")
                ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
                : ""
            }`}
          >
            <FaRegBookmark className="w-5 h-5 text-lg font-semibold" />
            <p className="text-lg font-semibold">Terms and Conditions</p>
          </li>
        </Link>
        <Link to="/reports">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/reports")
                ? "bg-[#89D0C9] text-white px-3 py-3 rounded-lg"
                : ""
            }`}
          >
            <TbReport className="w-5 h-5 text-lg font-semibold" />
            <p className="text-lg font-semibold">Reports</p>
          </li>
        </Link>
      </ul>

      {/* Logout Button */}
      <div className="absolute mt-8 md:mt-20 mmd:mt-20 w-full px-5">
        <button
          onClick={showLogoutModal}
          className="flex items-center gap-3 w-full py-3 rounded-lg bg-[#89D0C9] hover:bg-[#7ac4bd] px-3 duration-200 text-white justify-center"
        >
          <IoLogOutOutline className="w-5 h-5 font-bold" />
          <span className="text-base font-medium">Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        open={isLogoutModalOpen}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Logout"
        cancelText="Cancel"
        okButtonProps={{
          className: "bg-[#89D0C9] hover:bg-[#7ac4bd] border-none",
        }}
      >
        <div className="py-4">
          <p className="text-gray-700">Are you sure you want to logout?</p>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;

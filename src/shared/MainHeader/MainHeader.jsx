/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../../redux/api/profileApi";
import { getImageUrl } from "../../config/envConfig";
import defaultIMG from "../../assets/defaultImg";

const MainHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { data: profileData, isLoading } = useGetProfileQuery();
  
  // Default avatar URL
  const defaultAvatar = `${defaultIMG}`;

  return (
    <div className="relative w-full">
      <header className="bg-[#EDF1ED] shadow-sm">
        <div className="flex justify-between items-center px-5 md:px-10 h-[80px]">
          <div onClick={() => navigate("/")}>
            {/* <img
              src="/header.png"
              className="w-[72px] h-[50px]"
              alt="User Avatar"
            /> */}
            <h1 className="text-3xl text-[#0D0D0D] font-bold">LOGO</h1>
          </div>
          <div className="flex">
            <div
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 cursor-default"
            >
              <img
                src={getImageUrl(profileData?.data?.photo) || defaultAvatar}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
                className="w-8 md:w-12 h-8 md:h-12 object-cover rounded-full"
                alt={profileData?.data?.name || 'User'}
              />
              <div className="hidden md:block">
                <h3 className="text-[#0D0D0D] text-lg font-semibold">
                  {isLoading ? 'Loading...' : profileData?.data?.name || 'User'}
                </h3>
                {profileData?.data?.role && (
                  <p className="text-sm text-gray-500">{profileData.data.role}</p>
                )}
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default MainHeader;

import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../redux/api/profileApi";
import { notification } from 'antd';
import EditProfile from "./EditProfile";
import ChangePass from "./ChangePass";
import { getImageUrl } from "../../config/envConfig";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("editProfile");
  const { data: profileData, refetch } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await updateProfile(formData).unwrap();
      
      if (response?.success) {
        notification.success({
          message: 'Success',
          description: 'Profile image updated successfully',
          placement: 'topRight',
        });
        refetch(); // Refresh profile data
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error?.data?.message || 'Failed to update profile image',
        placement: 'topRight',
      });
    }
  };
  
  // Set a default profile image if none exists
  const profileImage = getImageUrl(profileData?.data?.photo) || 'https://avatar.iran.liara.run/public/44';

  return (
    <div className="overflow-y-auto">
      <div className="px-5 pb-5 h-full">
        <h3 className="font-semibold pb-5 text-xl text-[#242424]">
          Admin Profile(Super Admin)
        </h3>
        <div className="mx-auto flex flex-col justify-center items-center">
          {/* Profile Picture Section */}
          <div className="flex justify-center items-center bg-[#00c0b5] mt-5 text-white w-[900px] mx-auto p-5 gap-5 rounded-lg">
            <div className="relative">
              <div className="w-[122px] h-[122px] bg-gray-300 rounded-full border-4 border-white shadow-xl flex justify-center items-center overflow-hidden">
                <img
                  src={profileImage}
                  alt="profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://avatar.iran.liara.run/public/44';
                  }}
                />
                {/* Upload Icon */}
                <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer">
                  <label htmlFor="profilePicUpload" className="cursor-pointer">
                    <FaCamera className="text-[#575757]" />
                  </label>
                  <input 
                    type="file" 
                    id="profilePicUpload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-xl md:text-3xl font-bold">{profileData?.data?.name || 'User'}</p>
              <p className="text-xl font-semibold">Admin</p>
            </div>
          </div>

          {/* Tab Navigation Section */}
          <div className="flex justify-center items-center gap-5 text-md md:text-xl font-semibold my-5">
            <p
              onClick={() => setActiveTab("editProfile")}
              className={`cursor-pointer pb-1 ${
                activeTab === "editProfile"
                  ? "text-[#00c0b5] border-b-2 border-[#00c0b5]"
                  : "text-[#6A6D76]"
              }`}
            >
              Edit Profile
            </p>
            <p
              onClick={() => setActiveTab("changePassword")}
              className={`cursor-pointer pb-1 ${
                activeTab === "changePassword"
                  ? "text-[#00c0b5] border-b-2 border-[#00c0b5]"
                  : "text-[#6A6D76]"
              }`}
            >
              Change Password
            </p>
          </div>

          {/* Tab Content Section */}
          <div className="flex justify-center items-center p-5 rounded-md">
            <div className="w-full max-w-3xl">
              {activeTab === "editProfile" && <EditProfile />}
              {activeTab === "changePassword" && <ChangePass />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

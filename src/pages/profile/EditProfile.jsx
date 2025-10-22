import { useEffect, useState } from 'react';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../redux/api/profileApi';
import { notification } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';

function EditProfile() {
  const { data: profileData, isLoading, isError } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    dateOfBirth: '',
    photo: null
  });
  // const [preview, setPreview] = useState('');
  // const [fileList, setFileList] = useState([]);

  // Set form data when profile is loaded
  useEffect(() => {
    if (profileData?.data) {
      const { name, phoneNumber, dateOfBirth } = profileData.data;
      setFormData({
        name: name || '',
        phoneNumber: phoneNumber || '',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : ''
      });
      // if (photo) {
      //   setPreview(photo);
      // }
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleFileChange = (info) => {
  //   if (info.file) {
  //     const file = info.file.originFileObj;
  //     if (file) {
  //       setFormData(prev => ({
  //         ...prev,
  //         photo: file
  //       }));
  //       setPreview(URL.createObjectURL(file));
  //       setFileList([info.file]);
  //     }
  //   }
  //   return false; // Prevent default upload behavior
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      if (formData.photo && typeof formData.photo !== 'string') {
        formDataToSend.append('file', formData.photo);
      }

      const response = await updateProfile(formDataToSend).unwrap();
      
      if (response?.success) {
        notification.success({
          message: 'Success',
          description: 'Profile updated successfully',
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      notification.error({
        message: 'Error',
        description: error?.data?.message || 'Failed to update profile',
        placement: 'topRight',
      });
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading profile...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error loading profile</div>;

  return (
    <div className="bg-white px-5 md:px-20 w-[715px] mx-auto py-8 rounded-md">
      <p className="text-[#0D0D0D] text-center font-bold text-2xl mb-8">
        Edit Your Profile
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo Upload */}
        {/* <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 mb-4">
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleFileChange}
              fileList={fileList}
            >
              <div className="relative">
                <img
                  src={preview || `${defaultIMG}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="absolute bottom-0 right-0 bg-[#00c0b5] text-white rounded-full p-2 cursor-pointer">
                  <UploadOutlined className="h-5 w-5" />
                </div>
              </div>
            </Upload>
          </div>
          <span className="text-sm text-gray-500">Click on the icon to change photo</span>
        </div> */}

        {/* Name Field */}
        <div>
          <label className="block text-lg text-[#0D0D0D] mb-2 font-semibold">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-[#6A6D76] rounded-md outline-none focus:border-[#00c0b5] transition-colors"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Phone Number Field */}
        <div>
          <label className="block text-lg text-[#0D0D0D] mb-2 font-semibold">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-[#6A6D76] rounded-md outline-none focus:border-[#00c0b5] transition-colors"
            placeholder="Enter your phone number"
            required
          />
        </div>

        {/* Date of Birth Field */}
        <div>
          <label className="block text-lg text-[#0D0D0D] mb-2 font-semibold">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-[#6A6D76] rounded-md outline-none focus:border-[#00c0b5] transition-colors"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-[#00c0b5] hover:bg-[#00a89e] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;

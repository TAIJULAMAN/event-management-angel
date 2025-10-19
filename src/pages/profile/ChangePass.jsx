import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useChangeAdminPasswordMutation } from "../../redux/api/profileApi";
import { notification } from 'antd';

function ChangePass() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    oldpassword: '',
    newpassword: '',
    confirmPassword: ''
  });
  const [changePassword, { isLoading }] = useChangeAdminPasswordMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newpassword !== formData.confirmPassword) {
      notification.error({
        message: 'Error',
        description: 'New password and confirm password do not match',
        placement: 'topRight',
      });
      return;
    }

    try {
      const response = await changePassword({
        oldpassword: formData.oldpassword,
        newpassword: formData.newpassword
      }).unwrap();

      if (response?.success) {
        notification.success({
          message: 'Success',
          description: response?.data?.message || 'Password updated successfully',
          placement: 'topRight',
        });
        // Reset form
        setFormData({
          oldpassword: '',
          newpassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error?.data?.message || 'Failed to change password',
        placement: 'topRight',
      });
    }
  };

  return (
    <div className="bg-white px-5 md:px-20 w-[715px] mx-auto py-8 rounded-md">
      <p className="text-[#0D0D0D] text-center font-bold text-2xl mb-8">
        Change Password
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
      {/* Current Password Field */}
<div className="w-full">
  <label
    htmlFor="oldpassword"
    className="block text-lg text-[#0D0D0D] mb-2 font-semibold"
  >
    Current Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="oldpassword"
      value={formData.oldpassword}
      onChange={handleInputChange}
      placeholder="Enter current password"
      className="w-full px-4 py-3 border-2 border-[#6A6D76] rounded-md outline-none focus:border-[#00c0b5] transition-colors"
      required
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6D76]"
    >
      {showPassword ? (
        <IoEyeOffOutline className="w-5 h-5" />
      ) : (
        <IoEyeOutline className="w-5 h-5" />
      )}
    </button>
  </div>
</div>

{/* New Password Field */}
<div className="w-full">
  <label
    htmlFor="newpassword"
    className="block text-lg text-[#0D0D0D] mb-2 font-semibold"
  >
    New Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="newpassword"
      value={formData.newpassword}
      onChange={handleInputChange}
      placeholder="Enter new password"
      className="w-full px-4 py-3 border-2 border-[#6A6D76] rounded-md outline-none focus:border-[#00c0b5] transition-colors"
      required
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6D76]"
    >
      {showPassword ? (
        <IoEyeOffOutline className="w-5 h-5" />
      ) : (
        <IoEyeOutline className="w-5 h-5" />
      )}
    </button>
  </div>
</div>

{/* Confirm New Password Field */}
<div className="w-full">
  <label
    htmlFor="confirmPassword"
    className="block text-lg text-[#0D0D0D] mb-2 font-semibold"
  >
    Confirm New Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleInputChange}
      placeholder="Confirm new password"
      className="w-full px-4 py-3 border-2 border-[#6A6D76] rounded-md outline-none focus:border-[#00c0b5] transition-colors"
      required
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6D76]"
    >
      {showPassword ? (
        <IoEyeOffOutline className="w-5 h-5" />
      ) : (
        <IoEyeOutline className="w-5 h-5" />
      )}
    </button>
  </div>
</div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00c0b5] hover:bg-[#00a89e] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Changing...' : 'Save & Change'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePass;
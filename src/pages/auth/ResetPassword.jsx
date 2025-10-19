import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/api/authApi";
import { notification } from "antd";
import { jwtDecode } from "jwt-decode";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      notification.error({
        message: "Error",
        description: "Passwords do not match",
        placement: "topRight",
      });
      return;
    }

    if (newPassword.length < 6) {
      notification.error({
        message: "Error",
        description: "Password must be at least 6 characters long",
        placement: "topRight",
      });
      return;
    }

    if (!token) {
      notification.error({
        message: "Error",
        description: "Verification token is missing. Please try the reset process again.",
        placement: "topRight",
      });
      navigate("/forgot-password");
      return;
    }

    try {
      // Decode the JWT token to get the user ID
      const decoded = jwtDecode(token);
      const userId = decoded?.id;

      if (!userId) {
        throw new Error("Invalid verification token");
      }

      // Call the reset password API with the user ID from the token
      await resetPassword({
        userId,
        password: newPassword
      }).unwrap();

      notification.success({
        message: "Success",
        description: "Password has been reset successfully!",
        placement: "topRight",
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/sign-in");
      }, 300);
    } catch (error) {
      console.error("Reset password error:", error);
      notification.error({
        message: "Error",
        description: error?.data?.message || "Failed to reset password. Please try again.",
        placement: "topRight",
      });
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5">
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <div className="w-full lg:w-1/2 bg-white p-5 md:px-18 md:py-28 shadow-[0px_10px_20px_rgba(0,0,0,0.2)] rounded-2xl">
            <h2 className="text-[#0D0D0D] text-2xl font-bold text-center mb-5">
              Set a new password
            </h2>
            <p className="text-[#6A6D76] text-center mb-10">
              Create a new password. Ensure it differs from previous ones for security
            </p>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="w-full">
                <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
                  New Password
                </label>
                <div className="w-full relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-2"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 bottom-3 text-[#6A6D76]"
                  >
                    {showNewPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </button>
                </div>
              </div>

              <div className="w-full">
                <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
                  Confirm New Password
                </label>
                <div className="w-full relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-2"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 bottom-3 text-[#6A6D76]"
                  >
                    {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </button>
                </div>
              </div>

              <div className="flex justify-center items-center mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#00c0b5] hover:bg-[#00a89e] text-white font-bold py-3 rounded-lg shadow-lg cursor-pointer transition-colors disabled:opacity-70"
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
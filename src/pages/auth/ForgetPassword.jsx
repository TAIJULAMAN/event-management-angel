import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../redux/api/authApi";
import { notification } from 'antd';

function ForgetPassword() {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');

    try {
      const response = await forgotPassword({ email }).unwrap();
      
      if (response?.success) {
        notification.success({
          message: 'Success',
          description: 'Verification code sent to your email',
          placement: 'topRight',
        });
        navigate("/verification-code", { state: { email } });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error?.data?.message || 'Failed to send verification code',
        placement: 'topRight',
      });
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5">
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <div className="w-full md:w-1/2 lg:w-1/2 p-5 md:px-[100px] md:py-[200px] bg-white shadow-[0px_10px_20px_rgba(0,0,0,0.2)] rounded-2xl">
            <h2 className="text-[#0D0D0D] text-2xl font-bold text-center mb-5">
              Forgot password?
            </h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="nahidhossain@gmail.com"
                  className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                  required
                />
              </div>

              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-1/3 bg-[#00c0b5] hover:bg-[#00a89e] text-white font-bold py-3 rounded-lg shadow-lg cursor-pointer mt-5 transition-colors disabled:opacity-70"
                >
                  {isLoading ? 'Sending...' : 'Send Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
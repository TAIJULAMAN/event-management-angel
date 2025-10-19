import { useState, useEffect } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { setUser, setCredentials, setRememberMe, selectRememberMe, selectCredentials } from "../../redux/Slice/authSlice";
import { useLogInMutation } from "../../redux/api/authApi";

// Notification configuration
const openNotification = (type, message, description = '') => {
  notification[type]({
    message,
    description,
    placement: 'topRight',
    duration: 3,
  });
};

function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rememberMe = useSelector(selectRememberMe);
  const savedCredentials = useSelector(selectCredentials);
  const [login, { isLoading }] = useLogInMutation();

  // Load saved credentials if remember me was checked
  useEffect(() => {
    if (savedCredentials?.email && savedCredentials?.password) {
      setFormData({
        email: savedCredentials.email,
        password: savedCredentials.password,
      });
      dispatch(setRememberMe(true));
    }
  }, [dispatch, savedCredentials]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (event) => {
    dispatch(setRememberMe(event.target.checked));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Save credentials to Redux if remember me is checked
      if (rememberMe) {
        dispatch(setCredentials({
          email: formData.email,
          password: formData.password
        }));
      }
      
      // Call the login API
      const response = await login({
        email: formData.email,
        password: formData.password
      }).unwrap();

      // Handle successful login
      if (response?.success && response?.data?.accessToken) {
        // The API returns the token in response.data.accessToken
        dispatch(setUser({
          user: { email: formData.email }, // You might want to fetch the user profile after login
          token: response.data.accessToken,
          rememberMe
        }));
        
        // Show success notification and navigate to home page
        openNotification('success', 'Login Successful', 'Welcome back!');
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      openNotification('error', 'Login Failed', error?.data?.message || "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5">
      <div className="container mx-auto">
        <div className="flex  justify-center items-center">
          <div className="w-full lg:w-1/2 bg-white p-5 md:px-18 md:py-28 shadow-[0px_10px_30px_rgba(0,0,0,0.1)] rounded-2xl">
            <h2 className="text-[#0D0D0D] text-2xl  font-bold text-center mb-5">
              Log in to your account
            </h2>
            <p className="text-[#6A6D76] text-center mb-10">
              Please enter your email and password to continue.
            </p>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="w-full">
                <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="enter your email"
                  className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                  required
                />
              </div>
              <div className="w-full">
                <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
                  Password
                </label>
                <div className="w-full relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="**********"
                    className="w-full border-2 border-[#6A6D76] rounded-md outline-none px-5 py-3 mt-5 placeholder:text-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 bottom-4 flex items-center text-[#6A6D76]"
                  >
                    {showPassword ? (
                      <IoEyeOffOutline className="w-5 h-5" />
                    ) : (
                      <IoEyeOutline className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm my-5">
                <label className="flex items-center gap-[10px] cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={rememberMe}
                    onChange={handleCheckboxChange}
                  />
                  {rememberMe ? (
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="Group 335">
                        <rect
                          id="Rectangle 331"
                          x="-0.00012207"
                          y="6.10352e-05"
                          width="21"
                          height="21"
                          rx="4"
                          className="fill-[#00B047]"
                          stroke="#00B047"
                        ></rect>
                        <path
                          id="Vector"
                          d="M8.19594 15.4948C8.0646 15.4949 7.93453 15.4681 7.81319 15.4157C7.69186 15.3633 7.58167 15.2865 7.48894 15.1896L4.28874 11.8566C4.10298 11.6609 3.99914 11.3965 3.99988 11.1213C4.00063 10.8461 4.10591 10.5824 4.29272 10.3878C4.47953 10.1932 4.73269 10.0835 4.99689 10.0827C5.26109 10.0819 5.51485 10.1901 5.70274 10.3836L8.19591 12.9801L14.2887 6.6335C14.4767 6.4402 14.7304 6.3322 14.9945 6.33307C15.2586 6.33395 15.5116 6.44362 15.6983 6.63815C15.8851 6.83268 15.9903 7.09627 15.9912 7.37137C15.992 7.64647 15.8883 7.91073 15.7027 8.10648L8.90294 15.1896C8.8102 15.2865 8.7 15.3633 8.57867 15.4157C8.45734 15.4681 8.32727 15.4949 8.19594 15.4948Z"
                          fill="white"
                        ></path>
                      </g>
                    </svg>
                  ) : (
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="Group 335">
                        <rect
                          id="Rectangle 331"
                          x="-0.00012207"
                          y="6.10352e-05"
                          width="21"
                          height="21"
                          rx="4"
                          className="fill-transparent"
                          stroke="#00B047"
                        ></rect>
                      </g>
                    </svg>
                  )}

                  <span className="text-xl text-[#424242]">
                    Remember Password
                  </span>
                </label>
                <Link to="/forget-password" className="text-[#00c0b5] text-xl">
                  Forgot Password?
                </Link>
              </div>
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-1/3 bg-[#00c0b5] text-white font-bold py-3 rounded-lg shadow-lg mt-5 hover:bg-[#00a89e] transition-colors flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </>
                  ) : 'Log In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;

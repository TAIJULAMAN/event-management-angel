import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { notification } from "antd";
import { useVerifyEmailMutation } from "../../redux/api/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/Slice/authSlice";

function VerificationCode() {
  const [code, setCode] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value, index) => {
    if (!isNaN(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (index === 5 && !newCode.includes("")) {
        handleVerifyCode(newCode.join(""));
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      const newCode = [...code];

      if (e.key === "Backspace" && !newCode[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        newCode[index] = "";
        setCode(newCode);
        if (e.key === "Backspace" && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData)
      .getData("text")
      .trim();

    if (!pastedText || !/^\d+$/.test(pastedText)) return;

    const digits = pastedText.split("").slice(0, 6);
    const newCode = [...code];
    digits.forEach((digit, idx) => {
      if (idx < 6) {
        newCode[idx] = digit;
      }
    });
    setCode(newCode);

    const nextFocusIndex = Math.min(index + digits.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();

    if (digits.length >= 6) {
      handleVerifyCode(digits.slice(0, 6).join(""));
    }
  };

  const handleVerifyCode = async (verificationCode = code.join("")) => {
    if (verificationCode.length !== 6) {
      notification.error({
        message: "Error",
        description: "Please enter a 6-digit verification code",
        placement: "topRight",
      });
      return;
    }

    try {
      const response = await verifyEmail({
        email,
        verificationCode: parseInt(verificationCode, 10)
      }).unwrap();

      if (response?.success) {
        // Set user data and token in Redux store
        dispatch(setUser({
          user: { email },
          token: response.data,
          rememberMe: false
        }));

        notification.success({
          message: "Success",
          description: "Verification successful!",
          placement: "topRight",
        });
        
        navigate("/new-password", {
          state: {
            email,
            verificationCode,
            token: response.data
          },
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      notification.error({
        message: "Error",
        description: error?.data?.message || "Failed to verify code",
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
              Verification code
            </h2>
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-[#6A6D76] mb-10 w-full md:w-2/3">
                We sent a 6-digit verification code to {email || "your email"}.
              </p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={(e) => handlePaste(e, index)}
                    className="shadow-xs w-12 h-12 text-2xl text-center border border-[#6A6D76] text-[#0d0d0d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c0b5] focus:border-transparent"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
              <div className="flex justify-center items-center my-5">
                <button
                  onClick={() => handleVerifyCode()}
                  type="button"
                  disabled={isLoading}
                  className="w-1/3 bg-[#00c0b5] hover:bg-[#00a89e] text-white font-bold py-3 rounded-lg shadow-lg cursor-pointer mt-5 transition-colors disabled:opacity-70"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationCode;
import { createBrowserRouter } from "react-router-dom";
import SignInPage from "../pages/auth/SignInPage";
import ForgetPassword from "../pages/auth/ForgetPassword";
import VerificationCode from "../pages/auth/VerificationCode";
import ResetPassword from "../pages/auth/ResetPassword";
import MainLayout from "../layout/MainLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import PrivacyPolicy from "../pages/Privacy Policy/PrivacyPolicy";
import TermsCondition from "../pages/Terms Condition/TermsCondition";
import UserDetails from "../pages/userDetails/UserDetails";
import ProfilePage from "../pages/profile/ProfilePage";
import Chat from "../pages/Chat/Chat";
import MediaSocial from "../pages/Media&Social/MediaSocial";
import ChatManagement from "../pages/ChatManagement/ChatManagement";

const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/verification-code",
    element: <VerificationCode />,
  },
  {
    path: "/new-password",
    element: <ResetPassword />,
  },

  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/user-details",
        element: <UserDetails />,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
      // chat management
      {
        path: "/chat-management",
        element: <ChatManagement />,
      },

      // media and social
      {
        path: "/media-social",
        element: <MediaSocial />,
      },

      // settings
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-and-condition",
        element: <TermsCondition />,
      },

      //  navbar profile

      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
]);

export default router;

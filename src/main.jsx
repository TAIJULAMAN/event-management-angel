import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store";
import ReduxProvider from "./redux/ReduxProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReduxProvider>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </ReduxProvider>
  </StrictMode>
);

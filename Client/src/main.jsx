import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { AppContextProvider } from "./Context/AppContext.jsx";
import ToastProvider from "./Context/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>,
);

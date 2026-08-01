import { useContext } from "react";
import { ToastContext } from "../Context/ToastContext";

const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};

export default useToast;

import { createContext, useRef } from "react";
import { Toast } from "primereact/toast";

export const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
  const toastRef = useRef(null);

  const showToast = (severity, summary, detail, life = 6000) => {
    toastRef.current?.show({
      severity,
      summary,
      detail,
      life,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toastRef} position="top-right" />
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;

import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";

const ToastNotifications = () => {
  const toastRef = useRef(null);
  const currentToast = useSelector((state) => state.toast.currentToast);

  useEffect(() => {
    if (currentToast) {
      toastRef.current?.show(currentToast);
    }
  }, [currentToast]);

  return <Toast ref={toastRef} position="top-right" />;
};

export default ToastNotifications;

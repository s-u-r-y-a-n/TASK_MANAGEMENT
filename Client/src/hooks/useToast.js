import { useDispatch } from "react-redux";
import { showToast as showToastAction } from "../store/toastSlice";

const useToast = () => {
  const dispatch = useDispatch();

  const showToast = (severity, summary, detail, life = 6000) => {
    dispatch(
      showToastAction({
        id: crypto.randomUUID(),
        severity,
        summary,
        detail,
        life,
      }),
    );
  };

  return { showToast };
};

export default useToast;

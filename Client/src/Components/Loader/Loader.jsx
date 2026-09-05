import { CircularProgress } from "@mui/material";
import "./Loader.scss";

const Loader = ({ message = "Loading" }) => (
  <div className="app-loader" role="status" aria-live="polite">
    <CircularProgress
      className="app-loader__spinner"
      color="primary"
      size={36}
      aria-label={message}
    />
    <span className="app-loader__message">{message}</span>
  </div>
);

export default Loader;
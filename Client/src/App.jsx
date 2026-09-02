import Navigation from "./Pages/User/Navigation/Navigation";
import useTokenRefresh from "./hooks/useTokenRefresh";

const App = () => {
  // Initialize token refresh mechanism
  useTokenRefresh();

  return (
    <div>
      <Navigation />
    </div>
  );
};

export default App;

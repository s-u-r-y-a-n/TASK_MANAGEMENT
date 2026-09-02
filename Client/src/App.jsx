import Navigation from "./Pages/User/Navigation/Navigation";
import useTokenRefresh from "./hooks/useTokenRefresh";

const App = () => {
  useTokenRefresh();

  return (
    <div>
      <Navigation />
    </div>
  );
};

export default App;

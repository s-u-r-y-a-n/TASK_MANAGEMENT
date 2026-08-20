import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div>
        <Sidebar />
      </div>

      <div>
        <div>
          <header>THIS IS HEADER COMPONENT</header>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;

import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Modal from "../../../Components/Modal/Modal.jsx";

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
          {/* <Modal /> */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;

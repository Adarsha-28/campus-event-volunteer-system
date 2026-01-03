import RoleNavbar from "./RoleNavbar";
import { Outlet } from "react-router-dom";
//import "../../styles/MainLayout.css";


const MainLayout = () => {
  return (
    <div className="main-layout">
      <RoleNavbar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
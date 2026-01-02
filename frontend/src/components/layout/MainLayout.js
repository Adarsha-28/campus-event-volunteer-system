import RoleNavbar from "./RoleNavbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <RoleNavbar />
      <div style={{ padding: 20 }}>
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;

import React, { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import NotFound from "../pages/NotFound";
import LoginPage from "../pages/Login";
import About from "../pages/About";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import { useUserType } from "../customHooks/useUserType";
import Blogs from "../pages/Blogs";
import Users from "../pages/Users";
import Profilestatus from "../pages/Profile";
import Userlikepost from "../pages/Userlikepost";
import Usersavepost from "../pages/Usersavepost";

const MainLayout = ({ sidebarOpen, toggleSidebar }) => (
  <Topbar>
    <Outlet />
  </Topbar>
);

const Layout = () => {
  const userType = useUserType();

  const getRoutes = (userType) => {
    let routes = [{ path: "/about", component: About }];

    switch (userType) {
      case "Admin":
        routes = [
          { path: "/", component: AdminDashboard },
          { path: "/admin", component: AdminDashboard },
          { path: "/about", component: About },
          { path: "/blogs", component: Blogs },
          { path: "/users", component: Users },
        ];
        break;
      case "User":
        routes = [
          { path: "/", component: UserDashboard },
          { path: "/user", component: UserDashboard },
          { path: "/profile", component: Profilestatus },
          { path: "/about", component: About },
          { path: "/like", component: Userlikepost },
          { path: "/save", component: Usersavepost },
        ];
        break;
      default:
        break;
    }

    return routes;
  };

  const routes = getRoutes(userType);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        {routes.map((item) => (
          <Route
            key={item.path}
            path={item.path}
            element={<item.component />}
          />
        ))}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Layout;

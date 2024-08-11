import "./App.css";
import Layout from "./components/Layout";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "sonner";
import apiService from "./service/https";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/features/userSlice";
import Loader from "./components/Loader";
import { jwtDecode } from "jwt-decode";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isUserDataFetched, setIsUserDataFetched] = useState(false);
  const reduxDispatch = useDispatch();

  const getUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const data = jwtDecode(token);
        const user = await apiService.get(`/users/get-user/${data.id}`);
        reduxDispatch(setUserData({ ...user?.data }));
        setIsUserDataFetched(true);
        return user;
      } else {
        setIsUserDataFetched(true);
        return false;
      }
    } catch (err) {
      toast.error(err?.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserData();
      const currentPath = location.pathname;

      if (user) {
        if (currentPath === "/login") {
          navigate("/");
        }
      } else {
        if (currentPath !== "/login") {
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [location.pathname]);

  if (loading || !isUserDataFetched) {
    return <Loader />;
  }

  return (
    <div className="App">
      <Layout />
      <Toaster
        richColors
        expand={false}
        visibleToasts={4}
        position="top-right"
        closeButton
      />
    </div>
  );
}

export default App;

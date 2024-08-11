import { useSelector } from "react-redux";

export const useUserType = () => {
    const userType = useSelector((state) => state?.User?.isAdmin);
    return userType ? "Admin" : "User";
};
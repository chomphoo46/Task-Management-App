import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    //คลียร์ token และ user info
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    //กลับไปที่หน้า login
    navigate("/");
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <p className="text-lg font-semibold text-gray-700">Logging out...</p>
    </div>
  );
}

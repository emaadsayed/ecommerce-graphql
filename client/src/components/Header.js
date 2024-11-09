import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsBag } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isLogedIn, setIsLogedIn] = useState(false);

  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLogedIn(false);
      if(location.pathname == "/register") navigate("/register");
      else navigate("/signin");
    }
    else{
      setIsLogedIn(true);
      if(location.pathname == "/register" || location.pathname == "/signin") navigate("/");
    }
  }, [navigate]);

  return (
    <header className="bg-white py-4 shadow-md fixed w-full z-10 lg:px-8">
      <div className="container mx-auto flex items-center justify-between h-full">
        <Link to={"/"}>
          <div className="w-[40px]">
            <h1 className="font-semibold text-3xl">ChkOut</h1>
          </div>
        </Link>

        {isLogedIn && (
          <div className="flex items-center">
            <BsBag className="text-2xl" />
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded ml-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import classes from "./comman.module.css";

import { Tooltip } from "@material-tailwind/react";
import { FaClipboardList } from "react-icons/fa";
const AppNavWrapper = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await logout();
      console.log(res);

      navigate("/auth/login"); //user navigate inside component and redirect inside loader function of router
    } catch (e) {
      console.log(e);
      navigate("/app/home");
    }
  };

  return (
    <>
      <div className="z-10 flex h-full w-full bg-blue-700 ">
        <div className="text-shadow justify-left ml-4 flex w-full items-center pt-2 font-logo text-2xl">
          <NavLink to="/app/home">
            <FaClipboardList className="text-white" />
          </NavLink>
        </div>
       
        <div className="flex justify-center items-center ">
          {user ? (
            <>
              <div className="flex items-center  ">
                <Tooltip content="Logout">
                  <div
                    className="flex h-auto w-full items-center p-1 justify-center font-body bg-red-500 mr-2 cursor-pointer text-white rounded-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </Tooltip>
              </div>
            </>
          ) : (
            <>
              {" "}
              <NavLink
               className={({ isActive, isPending }) =>
                `flex h-autoa w-full items-center p-1 justify-center font-body bg-blue-700 mr-2 cursor-pointer text-white rounded-sm  ${
                  isPending
                    ? ""
                    : isActive
                      ? `   !bg-gray-500  !text-white `
                      : ""
                }  `
              }
                to="/intro"
              >
                Introduction
              </NavLink>
              <NavLink
              className={({ isActive, isPending }) =>
                `flex h-auto w-full items-center p-1 justify-center font-body bg-blue-700 mr-2 cursor-pointer text-white rounded-sm  ${
                  isPending
                    ? ""
                    : isActive
                      ? `   !bg-gray-500  !text-white `
                      : ""
                }  `
              }
                to="/auth/login"
              >
                Login
              </NavLink>
              <NavLink
                className={({ isActive, isPending }) =>
                  `flex h-auto w-full items-center p-1 justify-center font-body bg-blue-700 mr-2 cursor-pointer text-white rounded-sm  ${
                    isPending
                      ? ""
                      : isActive
                        ? `   !bg-gray-500  !text-white `
                        : ""
                  }  `
                }
                to="/auth/signup"
              >
                SignUp
              </NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default AppNavWrapper;

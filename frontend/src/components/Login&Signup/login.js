import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
import { useGoogleLogin } from "@react-oauth/google";
import { apiSignUpGoogle } from "../../services/Authservice";
const Login = () => {
  const { logIn, error ,setUser} = useAuth();

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    await logIn(userData);

    if (!error) {
      navigate("/app/home");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
   try{   const accessToken = response?.access_token;
    const loginUser = await apiSignUpGoogle(accessToken);
      const { messages, ...userDetails } = loginUser;
      console.log("login User", userDetails);
      setUser(userDetails);
   }catch(e){
    toast.error("Error in Google authentication")
   }
    },
    onError: (error) => {
      toast.error({ message: "Error Login with Google :" + error?.message });
    },
  });
  return (
    <>
      <div className="flex h-full w-full justify-center pt-8">
        <div class="relative flex flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none ">
          <h4 class="block font-sans text-2xl font-bold leading-snug tracking-normal   text-blue-700 antialiased">
            Login
          </h4>
         
          <form class="mb-2 mt-2 w-80 max-w-screen-lg sm:w-96 border-2 border-blue-700 p-3 rounded-sm shadow-sm flex flex-col">
            <div class="mb-1 flex flex-col gap-6">
            
              <div class="relative h-11 w-full min-w-[200px]">
                <input
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  class="peer h-full w-full rounded-md border border-blue-gray-200 !border-t-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:!border-t-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                />
                <label class="before:content[' '] after:content[' '] pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mr-1 before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:ml-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:before:!border-gray-900 peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
              </div>
             
              <div class="relative h-11 w-full min-w-[200px]">
                <input
                  type="password"
                  placeholder="********"
                  name="password"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  class="peer h-full w-full rounded-md border border-blue-gray-200 !border-t-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:!border-t-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                />
                <label class="before:content[' '] after:content[' '] pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mr-1 before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:ml-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:before:!border-gray-900 peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className=" mt-6 block w-full select-none  rounded-md 
               bg-blue-700  px-6  py-3 text-center align-middle font-sans text-xs font-bold uppercase
                text-white  shadow-md shadow-gray-900/10 transition-all hover:bg-blue-600 
              hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none 
               active:opacity-[0.85]  active:shadow-none disabled:pointer-events-none disabled:opacity-50"
            >
              log in
            </button>
            <p class="mt-4 block text-center font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
              Already have an account?
              <NavLink to="/auth/signup" className='text-blue-500'>{"   "}Sign Up </NavLink>
            </p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className=" mt-6 block w-auto select-none  rounded-md 
               bg-blue-700   py-3 text-center align-middle font-sans text-xs font-bold uppercase
                text-white  shadow-md shadow-gray-900/10 transition-all hover:bg-blue-600 
              hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none 
               active:opacity-[0.85]  active:shadow-none disabled:pointer-events-none disabled:opacity-50"
            >
              Google login
            </button>
          </form>
        </div>
      </div>
      {/* <div className={classes.container}>
      
      <div  className={classes.title}> login </div>
      <div>
      <form onSubmit={handleSubmit} className={classes.form}>
        <input className={classes.input}
          type="email"
          name="email"
          value={userData.email}
          placeholder="email"
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        ></input>

        <input className={classes.input}
          type="password"
          name="password"
          value={userData.password}
          placeholder="password"
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
        ></input>
        <button  className={classes.button}      type="Submit">Submit</button>
      </form>

      <div>
        Create account <NavLink to="/auth/signup">Click Here</NavLink>{" "}
      </div>
      </div>
      </div> */}
    </>
  );
};

export default Login;

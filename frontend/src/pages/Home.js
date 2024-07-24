
import {  useState } from "react";
import TaskToolbar from "../components/Task/TaskToolbar";
import TaskBoard from "../components/Task/TaskBoard";
const Home = () => {

  return (
    <>
      <div className="flex  flex-col h-full w-full mt-3">
        <div className="w-full "><TaskToolbar></TaskToolbar> </div>
        <div className="w-full h-full "><TaskBoard></TaskBoard> </div>
        </div>
    </>
  );
};
export default Home;

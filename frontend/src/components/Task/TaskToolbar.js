import { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
  } from "@material-tailwind/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
 import { apiCreateTask } from "../../services/Taskservice";
 import { useSelector ,useDispatch } from "react-redux";
 import { setTasks } from "../../store/TaskSlice";
 import {toast} from "react-toastify"
const TaskToolbar =()=>{
    const queryClient =useQueryClient();
    const dispatch = useDispatch();
    const Tasks = useSelector(state=>state.Tasks)
 const [isCreating , setIsCreating] = useState(false);
 const [task ,setTask ]= useState({name :"", description :""})
 const closeCreatbox =()=>{
    setIsCreating(false);
 }
 const createTask = useMutation({
    mutationFn: async (task) => {
      return await apiCreateTask(task);
    },
    onSuccess: async (data) => { 
     console.log(Tasks);
       const TempTasks = [...Tasks];
        TempTasks.push(data);
       setTask({name :"", description :""});
      dispatch(setTasks(TempTasks));
      toast.success("Task Created successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Task creation failed")
      throw new error("mutation on createtask failed", error);
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask.mutateAsync({
        task
      });
    } catch (e) {
      console.log(e + "unable to Create Task");
    }
    setIsCreating(false);
  };
 
    return (
          <>
            <Dialog
        size="xs"
        open={isCreating}
        handler={closeCreatbox}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="px-10 py-5 "
      >
        <DialogHeader className="font-sansitems-center mb-4 p-0 font-sans text-2xl font-bold leading-5">
          Create Task
        </DialogHeader>
        <DialogBody className="p-0  ">
          <form onSubmit={handleSubmit} className="flex flex-col">
            
          
              <input
                className={` border border-blue-700  focus:border-blue-500 rounded-md shadow-sm my-2 px-2 py-1`}
                type="text"
                name="TaskName"
                value={task.name}
                placeholder="Task Name"
                onChange={(e) => setTask({ ...task, name: e.target.value })}
              ></input>
          
         
              <input
                className={` border border-blue-700 focus:border-blue-500 rounded-md shadow-sm my-2 px-2 py-1`}
                type="text"
                name="Task Description"
                value={task.description}
                placeholder="Taskname"
                onChange={(e) => setTask({ ...task, description: e.target.value })}
              ></input>
            
            <div className="mt-2 flex justify-end">
              {" "}
              <Button
                variant="text"
                color="red"
                onClick={closeCreatbox}
                className="mr-1"
              >
                <span>Cancel</span>
              </Button>
              <Button 
               disabled={!!createTask.isPending}
               loading={!!createTask.isPending}
              type="submit"
                className={`${!!createTask.isPending ?" bg-blue-300":""}first-line:border-1 rounded-lg bg-blue-700 px-4 py-2 font-sans tracking-wide text-white shadow-md`} 
              >
                <span>Create</span>
              </Button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
        <div className="flex flex-col justify-center items-start h-full w-full  ">
            <button className=" bg-blue-700 w-auto h-auto text-white p-1 px-7 rounded-sm shadow-md m-1" type="button" onClick={()=>setIsCreating(true)}>Add Task</button>
            <div className="h-full w-full border-2 border-gray-200 rounded-sm shadow-md flex justify-between p-1 ">
              <div className="flex justify-center items-center ">  <h4>Search: </h4> {"  "}
                <input type="text" className="w-[60%] h-[90%] ml-2 px-2 py-1 rounded-lg shadow-md" placeholder="Search    "/>
                
                </div>
                <div className="flex justify-center items-center">  <h4>Sort:</h4> {"  "}
                  <select className="w-auto h-[90%] ml-2 px-2 py-1 rounded-lg shadow-md">
                  <option>Latest </option>
                  <option>older </option>
                    </select> 
                    </div>
            </div>
           
        </div>
        </>
    )
}
export default TaskToolbar;
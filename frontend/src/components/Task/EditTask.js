import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { apiUpdateTask } from "../../services/Taskservice";
import { toast } from "react-toastify";
import { useMutation,   } from "@tanstack/react-query";
import { setTasks } from "../../store/TaskSlice";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";

const EditTask = ({
  SelectedTask,
  closeCreatbox,
  open,
}) => { 
  const dispatch = useDispatch();
  const Tasks = useSelector((state) => state.Tasks);
  const [task, setTask] = useState(SelectedTask?.task);
  const editTask = useMutation({
    mutationFn: async (task) => {
      return await apiUpdateTask(task);
    },
    onSuccess: async (data) => {
       const TempTasks = [...Tasks];
      const removeindex = TempTasks.findIndex((t) => data._id === t._id);
       TempTasks.splice(removeindex, 1, data);
       await  dispatch(setTasks(TempTasks));
       toast.success("Task updated successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Unable to update Task");
      throw new Error(error, "unable to update Task mutation errror");
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editTask.mutateAsync({
        ...task,
      });
      closeCreatbox();
    } catch (e) {
      console.error("Unable of update Task" + e.message);
    }
    closeCreatbox();
  };
  // Update the local state if the prop changes
  useEffect(() => {
    setTask(SelectedTask?.task);
  }, [SelectedTask]);

  return (
    <>
      
      <Dialog
        size="xs"
        open={open}
        handler={closeCreatbox}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="px-10 py-5 "
      >
        <DialogHeader className="font-sansitems-center mb-4 p-0 font-sans text-2xl font-bold leading-5">
          Edit Task
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
              <Button disabled={!!editTask.isPending}
              loading={!!editTask.isPending}
              type="submit"
                className={`${!!editTask.isPending ? " ":" " } border-1 rounded-lg bg-blue-700 px-4 py-2 font-sans tracking-wide text-white shadow-md`} 
              >
                <span>Save</span>
              </Button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default EditTask;

import { useSelector, useDispatch } from "react-redux";
import { apiGetTask, apiDeleteTask ,apiUpdateTask } from "../../services/Taskservice";
import { useQuery, useMutation } from "@tanstack/react-query";
import { setTasks } from "../../store/TaskSlice";
import { showDate } from "../../helper/helperfunction";
import EditTask from "./EditTask";
import ViewTask from "./ViewTask";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@material-tailwind/react";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useDraggable,
  closestCenter
} from "@dnd-kit/core";

import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  verticalListSortingStrategy,
  
} from "@dnd-kit/sortable";
import Loader from "../comman/Loader";

const TaskBoard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const Tasks = useSelector((state) => state.Tasks);
  const [deleting, setIsDeleting] = useState(null);
  const [SelectedTask, setSelectedTask] = useState(null);
  const [showBox, setShowBox] = useState(null);

  const {
    isFetching: isloading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks", user?.id] ,
    queryFn: async () => {
      const data = await apiGetTask();
      dispatch(setTasks(data));
      return data;
    },
    staleTime: 1,
  });

  const deleteTask = useMutation({
    mutationFn: async (id) => {
      return await apiDeleteTask(id);
    },
    onSuccess: async (id) => {
      const TempTasks = [...Tasks];
      const removeindex = TempTasks.findIndex((t) => id === t._id);
      TempTasks.splice(removeindex, 1);
      await dispatch(setTasks(TempTasks));
      toast.success("Task deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = async (id) => {
    setIsDeleting(id);
    try {
      await deleteTask.mutateAsync({id:id} );
    } catch (e) {
      console.log(e);
    }
    setIsDeleting(null);
  };

  const editTask = useMutation({
    mutationFn: async (task) => {
      return await apiUpdateTask(task);
    },
    onSuccess: async (data) => {
    },
    onError: (error) => {
      console.log(error);
      toast.error("Unable to update Task..refresh to show status");
      
    },
  });
  
  const onDragEnd = async(event) => {
    const { active, over } = event;
    const taskIndex =Tasks.findIndex(t=> t._id===active.id);
    if(taskIndex ===-1)return;
    var task=Tasks[taskIndex];
    console.log(task);
    if (task?.task?.status !== over.id) {
      task = { ...task , task:{...task.task,status:over.id} }
       const TempTasks = [...Tasks];
       TempTasks.splice(taskIndex,1,task);
      dispatch(setTasks(TempTasks));
      await editTask.mutateAsync({...task.task,status:over.id});
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
  );

  const DraggableItem = ({ t, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
      id: t._id,
    });
const task = t?.task;
    const style = {
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="my-1 flex h-[calc(100vh/4)] min-h-28 w-full flex-col bg-blue-100 p-3 rounded-md"
      >
        <h3 className="text-xl font-bold">{task.name}</h3>
        <p className="text-sm text-gray-900">{task.description}</p>
        <p className="mt-auto text-sm text-gray-900">
          Created At: {showDate(task.createdAt)}
        </p>
        <div className="mt-auto flex w-full justify-end">
          <Button
            className="m-1 rounded-sm shadow-md bg-red-600 p-1 px-2 font-semibold text-white"
            onClick={() => handleDelete(t._id)}
            type="button"
            disabled={!!deleteTask.isPending && deleting ===t._id }
              loading={!!deleteTask.isPending && deleting ===t._id}
          >
            Delete
          </Button>
          <button
            className="m-1 rounded-sm shadow-md bg-blue-300 p-1 px-2 font-semibold text-white"
            onClick={() => {
              setSelectedTask(t);
              setShowBox("EditBox");
            }}
          >
            Edit
          </button>
          <button
            className="m-1 rounded-sm shadow-md bg-blue-700 p-1 px-2 font-semibold text-white"
            onClick={() => {
              setSelectedTask(t);
              setShowBox("ViewBox");
            }}
          >
            View
          </button>
        </div>
      </div>
    );
  };

  const DroppableColumn = ({ status, children }) => {
    const { setNodeRef } = useDroppable({
      id: status,
      data: {
        status: status,
      },
    });

    return (
      <div
        ref={setNodeRef}
        className="h-min-[100vh] mr-4 h-auto w-full rounded-lg border px-2 pt-2 shadow-md"
      >
        <h4 className="h-auto w-full rounded-sm bg-blue-700 text-center font-bold text-white">
          {status.toUpperCase()}
        </h4>
        {children}
      </div>
    );
  };

  return (
    <>
      {showBox && showBox === "ViewBox" && (
        <ViewTask
          SelectedTask={SelectedTask}
          key={SelectedTask._id}
          closeViewbox={() => {
            setSelectedTask(null);
            setShowBox(null);
          }}
          open={showBox === "ViewBox"}
        ></ViewTask>
      )}
      {showBox && showBox === "EditBox" && (
        <EditTask
          SelectedTask={SelectedTask}
          key={SelectedTask._id}
          closeCreatbox={() => {
            setSelectedTask(null);
            setShowBox(null);
          }}
          open={showBox === "EditBox"}
          user={user}
        ></EditTask>
      )}
     {isloading && <Loader></Loader>}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        // modifiers={[restrictToVerticalAxis]}
      >
        <div className="mt-4 flex h-screen flex-col md:flex-row ">
          {["todo", "inProgress", "done"].map((status) => (
            <DroppableColumn key={status} status={status}>
              <SortableContext
                items={Tasks.filter((t) => t.task.status === status).map(
                  (t) => t.task._id,
                )}
                strategy={verticalListSortingStrategy}
              >
                {Tasks.filter((t) => t.task.status === status).map(
                  (t, index) => (
                    <DraggableItem key={t._id} t={t} index={index} />
                  ),
                )}
              </SortableContext>
            </DroppableColumn>
          ))}
        </div>
      </DndContext>
    </>
  );
};

export default TaskBoard;

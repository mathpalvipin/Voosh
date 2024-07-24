import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";
import { showDate } from "../../helper/helperfunction";
const ViewTask = ({ SelectedTask, closeViewbox, open, }) => {
  const task = SelectedTask?.task;
  return (
    <>
      <Dialog
        size="xs"
        open={open}
        handler={() => closeViewbox()}
        animate={{
          mount: { scale:    1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="px-10 py-5 "
      >
        <DialogHeader className="font-sansitems-center mb-4 p-0 font-sans text-2xl font-bold leading-5">
          Task Details
        </DialogHeader>
        <DialogBody className="p-0 ">
          {task && (
            <div className="mb-2 rounded border-2 p-2 text-black shadow-md ">
              <p className="text-lg">Title: {task.name}</p>
              <div className="  flex w-full     ">
                <div className=" h-fit  text-md ">
                Description :{task.description}
                </div>
                
              </div>
              <p className="text-sm">CreatedAt: {showDate(task.createdAt)}</p>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              onClick={() => closeViewbox()}
              className="mr-1 rounded-md bg-blue-700 px-4 py-2 text-white shadow-md "
            >
              <span>Close</span>
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default ViewTask;

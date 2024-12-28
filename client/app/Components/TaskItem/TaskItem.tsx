import { useTasks } from "@/context/taskContext";
import { edit, star, trash } from "@/utils/Icons";
import { Task } from "@/utils/types";
import { formatTime } from "@/utils/utilities";
import React from "react";
import { motion } from "framer-motion";
import { item } from "@/utils/animations";
import { useUserContext } from "@/context/userContext";

interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: TaskItemProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-red-500";
      default:
        return "text-red-500";
    }
  };

  const currentDate = new Date();
  const dueDate = new Date(task.dueDate);
  const timeDiff = dueDate.getTime() - currentDate.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const getDueDateColor = () => {
    if (daysLeft <= 3) {
      return "text-red-700"; // 3 or fewer days left
    } else if (daysLeft <= 7) {
      return "text-yellow-500"; // 7 or fewer days left
    } else {
      return "text-blue-800"; // More than 7 days left
    }
  };
  const handleOpenLink = () => {
    if (task.link && task.link !== "None") {
      window.open(task.link, "_blank");
    }
  };

  const { getTask, openModalForEdit, deleteTask, modalMode } = useTasks();
  const {user, allUsers} = useUserContext();
  const userRole = user.role;
  
  var assignedUser;
  if (userRole === "admin") {
    assignedUser = allUsers.find(user => user._id === task.user);
  } else {
    assignedUser = user;
  }
   

  return (
    <motion.div
      className="h-[16rem] px-4 py-3 flex flex-col gap-4 shadow-sm bg-[#f9f9f9] rounded-lg border-2 border-white"
      variants={item}
    >
      <div>
        <h4 className="font-bold text-2xl">{task.title}</h4>
        <p>{task.description}</p>
        
        {!task.completed && (
          <p className="text-2xl font-bold text-gray-400">
            Due date:{" "}
            <span className={getDueDateColor()}>
              {formatTime(task.dueDate)}
            </span>
          </p>
        )}
        {task.completed && (
          <p className="text-2xl font-bold text-green-700">Completed</p>
        )}
        <p className="text-lg text-gray-400">
          Require: 
          <span className="text-black">
            {assignedUser ? assignedUser.name : "Unknown"}
          </span>
          
        </p>

        {/* View Result Link Button */}
        {task.link && task.link !== "None" && (
          <button
            className="mt-2 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700"
            onClick={handleOpenLink}
          >
            View Result
          </button>
        )}

        {task.link === "None" && (
          <button
            className="mt-2 px-4 py-2 bg-gray-300 text-gray-600 cursor-not-allowed rounded-md"
            disabled
          >
            No Link Available
          </button>
        )}
      </div>
      <div className="mt-auto flex justify-between items-center">
        <p className="text-sm text-gray-400">{formatTime(task.createdAt)}</p>
        <p className={`text-sm font-bold ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </p>
        <div>
          <div className="flex items-center gap-3 text-gray-400 text-[1.2rem]">
            <button
              className={`${
                task.completed ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              {star}
            </button>
            <button
              className="text-[#00A1F1]"
              onClick={() => {
                getTask(task._id);
                openModalForEdit(task);
              }}
            >
              {edit}
            </button>
            {userRole === "admin" && (
              <button
                className="text-red-700"
                onClick={() => {
                  deleteTask(task._id);
                }}
              >
                {trash}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TaskItem;

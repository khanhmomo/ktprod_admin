import { useTasks } from "@/context/taskContext";
import { edit, star, trash } from "@/utils/Icons";
import { Task } from "@/utils/types";
import { formatTime } from "@/utils/utilities";
import React from "react";
import { motion } from "framer-motion";
import { item } from "@/utils/animations";
import { useUserContext } from "@/context/userContext";
import { User } from "@/utils/types";  // Import the User type

interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: TaskItemProps) {
  const { user, allUsers } = useUserContext();
  
  // Ensure that 'user' is properly typed as `User | null`
  const userRole = user?.role;  // Safe optional chaining
  
  // Define assignedUser with appropriate type: `User | null`
  let assignedUser: User | null = null;
  
  if (userRole === "admin" && user) {
    // Explicitly type 'u' as `User` in the find method
    assignedUser = allUsers.find((u: User) => u._id === task.user.toString()) || null;
  } else {
    assignedUser = user;  // For non-admins, assigned user is the current logged-in user
  }

  // Function to determine the priority color for the task
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

  const { getTask, openModalForEdit, deleteTask, modalMode } = useTasks();

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
          <p className="text-2xl font-bold text-green-800">Completed</p>
        )}
        <p className="text-lg text-gray-400">
          Require: 
          <span className="text-black">
            {assignedUser ? assignedUser.name : "Unknown"}
          </span>
        </p>
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

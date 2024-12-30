"use client";
import { useTasks } from "@/context/taskContext";
import useDetectOutside from "@/hooks/useDetectOutside";
import React, { useEffect } from "react";
import { useUserContext } from "@/context/userContext";
import { User } from "@/utils/types";  // Import the User type

function Modal() {
  const {
    task,
    handleInput,
    createTask,
    isEditing,
    closeModal,
    modalMode,
    activeTask,
    updateTask,
  } = useTasks();
  const ref = React.useRef(null);

  const { allUsers, user } = useUserContext();

  // Use the hook to detect clicks outside the modal
  useDetectOutside({
    ref,
    callback: () => {
      if (isEditing) {
        closeModal(); // Close modal if it is in add/edit mode
      }
    },
  });

  useEffect(() => {
    if (modalMode === "edit" && activeTask) {
      handleInput("setTask")(activeTask);
    }
  }, [modalMode, activeTask]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task.link) {
      task.link = "None";
    }
    if (!task.dueDate) {
      task.dueDate = new Date().toISOString().split("T")[0];
    }
  
    if (modalMode === "edit") {
      updateTask(task);
    } else if (modalMode === "add") {
      createTask(task);
    }
    closeModal();
  };

  return (
    <div className="fixed left-0 top-0 z-50 h-full w-full bg-[#333]/30 overflow-hidden">
      <form
        action=""
        className="py-5 px-6 max-w-[520px] w-full flex flex-col gap-3 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md"
        onSubmit={handleSubmit}
        ref={ref}
      >
        {user.role === "admin" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Title</label>
            <input
              className="bg-[#F9F9F9] p-2 rounded-md border"
              type="text"
              id="title"
              placeholder="Task Title"
              name="title"
              value={task.title}
              onChange={(e) => handleInput("title")(e)}
              required 
            />
            {task.title === "" && (
              <span className="text-red-500 text-sm">
                Title is required.
              </span>
            )}
          </div>
        )}
        {user.role === "admin" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="description">Description</label>
            <textarea
              className="bg-[#F9F9F9] p-2 rounded-md border resize-none"
              name="description"
              placeholder="Task Description"
              rows={4}
              value={task.description}
              onChange={(e) => handleInput("description")(e)}
            />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label htmlFor="user">Assign to</label>
          <select
            className="bg-[#F9F9F9] p-2 rounded-md border cursor-pointer"
            name="user"
            value={task.user || ""}
            onChange={(e) => handleInput("user")(e)} // Set the selected user ID
            required // Ensures the select input is required
          >
            <option value="" disabled>
              Select a Crew
            </option>
            {allUsers?.map((user: User) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
          {!task.user && (
            <span className="text-red-500 text-sm">
              Please select a crew member.
            </span>
          )}
        </div>
        {user.role === "admin" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="priority">Select Priority</label>
            <select
              className="bg-[#F9F9F9] p-2 rounded-md border cursor-pointer"
              name="priority"
              value={task.priority}
              onChange={(e) => handleInput("priority")(e)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        )}
        {user.role === "admin" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="dueDate">Due Date</label>
            <input
              className="bg-[#F9F9F9] p-2 rounded-md border"
              name="dueDate"
              type="date"
              value={task.dueDate || new Date().toISOString().split("T")[0]} // Default to today's date
              onChange={(e) => handleInput("dueDate")(e)}
            />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label htmlFor="completed">Task Completed</label>
          <div className="flex items-center justify-between bg-[#F9F9F9] p-2 rounded-md border">
            <label htmlFor="completed" className="mr-2">Completed</label>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md ${task.completed ? 'bg-green-700 text-white' : 'bg-gray-200'}`}
                onClick={() => handleInput("completed")({ target: { value: "true", checked: true } })}>
                Yes
              </button>
              <button
                className={`px-4 py-2 rounded-md ${!task.completed ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                onClick={() => handleInput("completed")({ target: { value: "false", checked: false } })}>
                No
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="link">Result Link</label>
          <input
            className="bg-[#F9F9F9] p-2 rounded-md border"
            type="url"
            name="link"
            placeholder="Add a link (optional)"
            value={task.link !== "None" ? task.link : ""}
            onChange={(e) => handleInput("link")(e)} // Handle link input
          />
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className={`text-white py-2 rounded-md w-full hover:bg-blue-800/90 transition duration-200 ease-in-out ${modalMode === "edit" ? "bg-blue-800" : "bg-red-700"}`}
          >
            {modalMode === "edit" ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Modal;

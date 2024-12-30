"use client";
import { useTasks } from "@/context/taskContext";
import useRedirect from "@/hooks/useUserRedirect";
import Filters from "./Components/Filters/Filters"; // Import the Filters component
import TaskItem from "./Components/TaskItem/TaskItem";
import { filteredTasks } from "@/utils/utilities";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { container, item } from "@/utils/animations";
import { useUserContext } from "@/context/userContext";
import { generateReport } from "@/utils/generateReport"; // Import the generateReport function

import { Task, User } from "@/utils/types"; // Import Task and User from shared types

// Type guard to check if an object is a User
function isUser(user: any): user is User {
  return user && typeof user === "object" && "_id" in user;
}

export default function Home() {
  useRedirect("/login");

  const { tasks, openModalForAdd, priority, setPriority } = useTasks();
  const { user, allUsers } = useUserContext();
  const [sortType, setSortType] = useState<string>("user");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");

  // Filter tasks based on selected user, month, and year
  const filterTasks = (tasks: Task[], userId: string, month: string, year: string): Task[] => {
    let filtered = tasks;

    if (userId !== "all") {
      // Use type guard to check if task.user is a User and safely access _id
      filtered = filtered.filter((task) => {
        const taskUserId = typeof task.user === "string"
          ? task.user // If task.user is a string (user ID), use it directly
          : isUser(task.user) // If task.user is a User object, use its _id
          ? task.user._id
          : undefined;

        return taskUserId === userId;
      });
    }

    filtered = filtered.filter((task) => {
      const taskDate = new Date(task.dueDate);
      const taskMonth = taskDate.getMonth() + 1; // Months are 0-based in JS Date
      const taskYear = taskDate.getFullYear().toString();
      return (
        (month === "all" || taskMonth === parseInt(month)) &&
        (year === "all" || taskYear === year)
      );
    });

    return filtered;
  };

  // Define priorityOrder with correct types
  const priorityOrder: Record<'low' | 'medium' | 'high', number> = {
    low: 1,
    medium: 2,
    high: 3,
  };

  // Sorting function for user, due date, and priority
  const sortTasks = (tasks: Task[], type: string): Task[] => {
    if (type === "user") {
      return [...tasks].sort((a, b) => {
        // First, we need to safely handle both cases where task.user can be either a string or a User object
        const userA = typeof a.user === "string"
          ? allUsers.find((u: User) => u._id === a.user.toString())  // Find the User by string ID
          : isUser(a.user) ? a.user : undefined; // If it's a User object, use it directly

        const userB = typeof b.user === "string"
          ? allUsers.find((u: User) => u._id === b.user.toString())  // Find the User by string ID
          : isUser(b.user) ? b.user : undefined; // If it's a User object, use it directly

        // Now handle undefined cases where user might not be found
        const nameA = userA ? userA.name.toLowerCase() : ""; // Default to empty string if user not found
        const nameB = userB ? userB.name.toLowerCase() : ""; // Default to empty string if user not found

        return nameA.localeCompare(nameB);
      });
    } else if (type === "dueDate") {
      return [...tasks].sort((a, b) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    } else if (type === "priority") {
      return [...tasks].sort((a, b) => {
        const priorityA = priorityOrder[a.priority as 'low' | 'medium' | 'high'];
        const priorityB = priorityOrder[b.priority as 'low' | 'medium' | 'high'];
        return priorityA - priorityB;
      });
    }

    return tasks; // Default if no sort type is selected
  };

  useEffect(() => {
    setPriority("all");
  }, []);

  // Sorted tasks based on the selected sort type
  const sortedTasks = sortTasks(
    filterTasks(filteredTasks(tasks, priority), selectedUser, selectedMonth, selectedYear),
    sortType
  );

  // Generate the report (move this to generateReport.ts)
  const handleGenerateReport = () => {
    generateReport(sortedTasks, allUsers, selectedMonth, selectedYear, selectedUser);
  };

  return (
    <main className="m-6 h-full">
      {/* Top Section - Align elements horizontally */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Tasks</h1>

        {/* Common section for both admin and user */}
        <div className="flex items-center space-x-4">
          {user.role === "admin" && (
            <>
              {/* Only admin can filter by user */}
              <label htmlFor="user-filter" className="text-lg">Filter by User:</label>
              <select
                id="user-filter"
                className="p-2 rounded-md border"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="all">All Users</option>
                {allUsers.map((u: User) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Sort dropdown for both admin and user */}
          <span className="mr-2">Sort:</span>
          <select
            className="p-2 rounded-md border"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            {/* Show "By User" only for admin */}
            {user.role === "admin" && <option value="user">By User</option>}
            <option value="dueDate">By Due Date</option>
            <option value="priority">By Priority</option>
          </select>

          <Filters /> {/* Add Filters component here */}
        </div>
      </div>

      {/* Bottom Section - Align Month, Year, and Generate Report to the far right */}
      
      
      <div className="mt-6 flex justify-end items-center space-x-4">
        {/* Month Selector */}
        <div>
          <label htmlFor="month-select">Month:</label>
          <select
            id="month-select"
            className="p-2 rounded-md border"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">All</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        {/* Year Selector */}
        <div>
          <label htmlFor="year-select">Year:</label>
          <select
            id="year-select"
            className="p-2 rounded-md border"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="all">All</option>
            {[...new Set(tasks.map((task: Task) => new Date(task.dueDate).getFullYear()))].map((year) => (
              <option key={year as number} value={(year as number).toString()}>
                {year as number}
              </option>
            ))}
          </select>
        </div>

        {/* Generate Report Button */}
        {user.role === "admin" && (
          <button
            className="p-2 rounded-md bg-blue-800 hover:bg-blue-800/70 text-white"
            onClick={handleGenerateReport}
          >
            Generate Report
          </button>
        )}
        
      </div>

      {/* Task Items */}
      <motion.div
        className="pb-[2rem] mt-6 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[1.5rem]"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {sortedTasks.map((task: Task, i: number) => (
          <TaskItem key={i.toString()} task={task} /> 
        ))}

        {user.role === "admin" && (
          <motion.button
            className="h-[16rem] w-full py-2 rounded-md text-lg font-medium text-gray-500 border-dashed border-2 border-gray-400
            hover:bg-gray-300 hover:border-none transition duration-200 ease-in-out"
            onClick={openModalForAdd}
            variants={item}
          >
            Add New Task
          </motion.button>
        )}
      </motion.div>
    </main>
  );
}

"use client";
import { useTasks } from "@/context/taskContext";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import React from "react";


function Header() {
  const { user } = useUserContext();
  const { openModalForAdd, activeTasks, openUsersModal, openProfileModal } = useTasks();
  const { allUsers} = useUserContext();

  const router = useRouter();

  const { name } = user;

  const userId = user._id;
  const userRole = user.role;

  return (
    <header className="px-6 my-4 w-full flex items-center justify-between bg-[#f9f9f9]">
      <div>
        <h1 className="text-lg font-medium">
          <span role="img" aria-label="wave">
            👋
          </span>
          {userId ? `Welcome, ${name}!` : "Welcome to KhanhTran Production WorkSpace"}
        </h1>
        <p className="text-sm">
          {userId ? (
            <>
              You have{" "}
              <span className="font-bold text-red-700">
                {activeTasks.length}
              </span>
              &nbsp;active tasks
            </>
          ) : (
            "Please login or register to view your tasks"
          )}
        </p>
      </div>
      
      
      
    </header>
  );
}

export default Header;

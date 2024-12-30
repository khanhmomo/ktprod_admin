"use client";
import { useState } from "react";
import { useUserContext } from "@/context/userContext";
import { User } from "@/utils/types";
import { trash } from "@/utils/Icons";

export default function Home() {
  const { allUsers, deleteUser } = useUserContext();

  return (
    <main className="m-6 h-full">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Manage all Users</h1>
      </div>
      <h1 className="text-xl font-semibold">
        Admin account will be marked with <span className="text-red-700">red</span>
      </h1>
      <div className="pb-[2rem] mt-6 grid grid-cols-[repeat(auto-fill,minmax(1000px,1fr))] gap-[1.5rem]">
        {allUsers.map((user: User) => (
          <div
            key={user._id}
            className="px-4 py-3 flex flex-col gap-4 shadow-sm bg-[#f9f9f9] rounded-lg border-2 border-white"
          >
            <div className="mt-auto flex justify-between items-center">
              <div>
                <h1
                  className={`font-bold text-2xl ${user.role === "admin" ? "text-red-700" : "text-black"}`}
                >
                  {user.name}
                </h1>
                <h1 className="font-semibold text-1xl">{user.bio}</h1>
                <h1 className="font-semibold text-1xl">{user.email}</h1>
              </div>
              <div className="flex items-center gap-3">
                {/* Delete button */}
                <button
                  className="text-red-700 text-2xl"
                  onClick={() => deleteUser(user._id)} // Call deleteUser with the user ID
                >
                  {trash}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

"use client";
import { useState } from "react";
import { useUserContext } from "@/context/userContext";
import useRedirect from "@/hooks/useUserRedirect";
import { useTasks } from "@/context/taskContext";

export default function Home() {
    useRedirect("/login");
    const { allUsers, updateUserRole } = useUserContext(); // Assuming you have a context method to update the role
    const { openProfileModal } = useTasks();
    const { user, updateUser, handlerUserInput, userState, changePassword } =
        useUserContext();
    const { name, email } = user;

    

    return (
        <main className="m-6 h-full">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Manage all Users</h1>
            </div>
            <h1 className="text-xl font-semibold">Admin account will be marked with <span className="text-red-700">red</span></h1>
            <div className="pb-[2rem] mt-6 grid grid-cols-[repeat(auto-fill,minmax(1000px,1fr))] gap-[1.5rem]">
                {allUsers.map(function (user) {
                    const [selectedRole, setSelectedRole] = useState(user.role); // Set initial value to user.role

                    return (
                        <div
                            key={user._id}
                            className="px-4 py-3 flex flex-col gap-4 shadow-sm bg-[#f9f9f9] rounded-lg border-2 border-white"
                        >
                            <div className="mt-auto flex justify-between items-center">
                                <div>
                                    <h1
                                        className={`font-bold text-2xl ${
                                            user.role === "admin" ? "text-red-700" : "text-black"
                                        }`}
                                    >
                                        {user.name}
                                    </h1>
                                    <h1 className="font-semibold text-1xl">{user.bio}</h1>
                                    <h1 className="font-semibold text-1xl">{user.email}</h1>
                                </div>
                                
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}

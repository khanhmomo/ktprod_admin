"use client";
import IconCheck from "@/public/icons/IconCheck";
import IconUsers from "@/public/icons/IconUsers";
import IconFileCheck from "@/public/icons/IconFileCheck";
import IconGrid from "@/public/icons/IconGrid";
import IconStopwatch from "@/public/icons/IconStopwatch";

import { useUserContext } from "@/context/userContext"; // Assuming you have a user context
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function MiniSidebar() {
  const pathname = usePathname();
  const { user } = useUserContext(); // Access the current user from context

  // Function to get the stroke color based on the current pathname
  const getStrokeColor = (link: string) => {
    return pathname === link ? "#c62828" : "#71717a";
  };

  // Define the navigation items
  const navItems = [
    {
      icon: <IconGrid strokeColor={getStrokeColor("/")} />,
      title: "All",
      link: "/",
    },
    {
      icon: <IconFileCheck strokeColor={getStrokeColor("/completed")} />,
      title: "Completed",
      link: "/completed",
    },
    {
      icon: <IconCheck strokeColor={getStrokeColor("/pending")} />,
      title: "Pending",
      link: "/pending",
    },
    {
      icon: <IconStopwatch strokeColor={getStrokeColor("/overdue")} />,
      title: "Overdue",
      link: "/overdue",
    },
    // Only render this item if the user is an admin
    ...(user && user.role === "admin"
      ? [
          {
            icon: <IconUsers strokeColor={getStrokeColor("/userlist")} />,
            title: "Users",
            link: "/userlist",
          },
        ]
      : []),
  ];

  return (
    <div className="basis-[5rem] flex flex-col bg-[#f9f9f9]">
      <div className="flex items-center justify-center h-[5rem]">
        <Image src="/logo.png" width={28} height={28} alt="logo" />
      </div>

      <div className="mt-8 flex-1 flex flex-col items-center justify-between">
        <ul className="flex flex-col gap-10">
          {navItems.map((item, index) => (
            <li key={index} className="relative group">
              <Link href={item.link}>{item.icon}</Link>

              {/* Hover Tooltip */}
              <span className="absolute top-[50%] translate-y-[-50%] left-8 text-xs pointer-events-none text-white bg-red-700 px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MiniSidebar;

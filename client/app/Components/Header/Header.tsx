"use client";
import { useUserContext } from '@/context/userContext';
import { github, moon, profile } from '@/utils/Icons';
import Link from 'next/link';
import React, { useContext } from 'react'

const Header = () => {

  const {user} = useUserContext();

  const {name} = user;

  const userId = user._id;

  return (
    <header className="px-6 my-4 w-full flex items-center justify-between bg-[#f9f9f9]">
      <div>
        <h1 className="text-lg font-medium">
          {userId ? `Welcome, ${name}` : 'Welcome to KhanhTran Production WorkSpace'}
        </h1>
        <p className="text-sm">
          {userId ? (
            <>
              You have <span className="font-bold text-red-700">5</span> active tasks
            </>
          ):(
            "Please login or register to view your tasks"
          )}
        </p>
      </div>

      <div className="h-[50px] flex items-center gap-[10.4rem]">
        <button className="px-8 py-3 bg-red-700 text-white rounded-[50px]
          hover:bg-blue-800 hover:text-white transition-all duration-200 ease-in-out">
          Create a new task
        </button>

        <div className="flex gap-4 items-center">
        
          <Link
            href="https://github.com/khanhmomo"
            passHref
            target="_blank"
            rel="noopener noreferrer"
            className="h-[40px] w-[40px] text-black rounded-full flex items-center justify-center text-lg border-2 border-[#E6E6E6]"
          >
            {profile}
          </Link>
        </div>
      </div>

    </header>
  )
}

export default Header
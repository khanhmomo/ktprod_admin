"use client";
import { useTasks } from "@/context/taskContext";
import { useUserContext } from "@/context/userContext";
import useDetectOutside from "@/hooks/useDetectOutside";
import { badge, check, github, mail } from "@/utils/Icons";
import Image from "next/image";
import React from "react";

function ProfileModal() {
  const ref = React.useRef(null);

  const { closeModal } = useTasks();
  const { user, updateUser, handlerUserInput, userState, changePassword } =
    useUserContext();

  useDetectOutside({
    ref,
    callback: () => {
      closeModal();
    },
  });

  const { name, email, photo, role, bio } = user;

  // state for photo URL input
  const [newPhoto, setNewPhoto] = React.useState<string | null>(null);

  // state for password change
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  // Handle input for password
  const handlePassword = (type: string) => (e: any) => {
    if (type === "old") {
      setOldPassword(e.target.value);
    } else {
      setNewPassword(e.target.value);
    }
  };

  // Handle input for new photo URL
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPhoto(e.target.value);
  };

  // Handle photo update
  const handlePhotoSubmit = () => {
    if (newPhoto) {
      updateUser(null, { photo: newPhoto }); // Update user with new photo
      setNewPhoto(null); // Clear input field
    }
  };

  return (
    <div className="fixed left-0 top-0 z-50 h-full w-full bg-[#333]/30 overflow-hidden">
      <div
        ref={ref}
        className="py-5 px-6 max-w-[520px] w-full flex flex-col gap-3 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md border-2 border-white"
      >
        <div className="absolute left-0 top-0 w-full h-[80px] bg-[#323232]/10 rounded-tr-md rounded-tl-md"></div>

        <div className="mt-4 relative flex justify-between">
          <div className="relative inline-block">
            <Image
              src={photo}
              alt="profile"
              width={80}
              height={80}
              className="rounded-full cursor-pointer"
              onClick={() => setNewPhoto(photo)} // Allow the user to input a new photo URL
            />
            {/* Input for updating photo URL */}
            {newPhoto && (
              <div className="absolute top-16 left-0 w-full bg-white p-4 shadow-lg rounded-md">
                <input
                  type="text"
                  placeholder="Enter SVG URL"
                  value={newPhoto}
                  onChange={handlePhotoChange}
                  className="py-[0.4rem] px-3 font-medium rounded-lg border-2 border-[#323232]/10"
                />
                <button
                  onClick={handlePhotoSubmit}
                  className="mt-2 py-2 px-4 bg-blue-600 text-white rounded-md"
                >
                  Update Photo
                </button>
              </div>
            )}
            <div className="absolute bottom-0 right-1 shadow-sm">
              <span className="text-lg text-blue-400">{badge}</span>
              <span className="absolute z-20 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-xs text-white">
                {check}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-lg font-bold">{name}</h1>
          <h1 className="text-md font-semibold">{bio}</h1>
          <p className="text-sm text-gray-500">{email}</p>
          <p className="text-sm text-gray-500">Account type: {role}</p>
        </div>

        <form
          action=""
          className="mt-4 pt-2 flex flex-col gap-4 border-t-2 border-t-[#323232]/10"
          onSubmit={(e) => {
            e.preventDefault();
            updateUser(e, {
              name: userState.name,
              email: userState.email,
              bio: userState.bio,
            });
          }}
        >
          <div className="pt-2 grid grid-cols-[150px_1fr]">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={name}
              onChange={(e) => handlerUserInput("name")(e)}
              className="py-[0.4rem] px-3 font-medium rounded-lg border-2 border-[#323232]/10"
            />
          </div>
          <div className="pt-2 grid grid-cols-[150px_1fr]">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <input
              type="text"
              id="bio"
              name="bio"
              defaultValue={bio}
              onChange={(e) => handlerUserInput("bio")(e)}
              className="py-[0.4rem] px-3 font-medium rounded-lg border-2 border-[#323232]/10"
            />
          </div>

          <div className="pt-4 grid grid-cols-[150px_1fr] border-t-2 border-t-[#323232]/10">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <div className="relative w-full">
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => handlerUserInput("email")(e)}
                className="w-full py-[0.4rem] pl-9 pr-2 font-medium rounded-lg border-2 border-[#323232]/10"
              />
              <span className="absolute left-0 top-0 bottom-0 flex items-center px-3 text-[#323232]/50">
                {mail}
              </span>
            </div>
          </div>

          <div className="pt-4 grid grid-cols-2 gap-4 border-t-2 border-t-[#323232]/10">
            <div className="flex flex-col gap-1">
              <label htmlFor="oldPassWord" className="text-sm font-medium">
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={handlePassword("old")}
                className="py-[0.4rem] px-3 font-medium rounded-lg border-2 border-[#323232]/10"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={handlePassword("new")}
                className="py-[0.4rem] px-3 font-medium rounded-lg border-2 border-[#323232]/10"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="py-3 px-4 bg-blue-800 text-white text-sm font-medium rounded-md hover:bg-blue-400 transition-all duration-300"
              onClick={() => changePassword(oldPassword, newPassword)}
            >
              Change Password
            </button>
          </div>

          <div className="flex justify-end gap-4 border-t-2 border-t-[#323232]/10">
            <button
              type="submit"
              className="mt-3 py-2 px-4 bg-red-700 text-white text-sm font-medium rounded-md hover:bg-red-700/90 transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;

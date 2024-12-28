'use client'
import { UserData } from "@/app/types";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaFlagUsa,
  FaCheckSquare,
  FaEnvelope,
  FaBell,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import WebsiteName from "../utils/WebsiteName";


const AdminHeader = ({user}:{user:UserData}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle the dropdown menu when clicking on the user section
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
 
  // Close the dropdown if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
 const getInitials = (name:string) => {
  if (!name) return "";

  // تقسيم الاسم إلى كلمات
  const words = name.trim().split(" ");

  // إذا كان هناك أكثر من كلمة، خذ أول كلمتين
  if (words.length > 1) {
    return words[0].charAt(0) + words[1].charAt(0);
  } else {
    // إذا كانت كلمة واحدة، خذ أول حرفين
    return words[0].substring(0, 2);
  }
};

  return (
    <div
      dir="ltr"
      className="flex  
    fixed top-0  right-0 max-md:w-full max-[1700px]:w-[calc(85%-0.6px)] 
    min-[1400px]:w-[calc(85%-1px)]  max-md:px-2 max-md:justify-between  float-right
     items-center px-16 justify-between gap-5 p-4 z-10 bg-secondary  text-white"
    >
      <Link href={"/"} className="text-primary text-xl font-extrabold">
        {WebsiteName}
      </Link>
      <div className="flex  gap-5">
        {/* Search Bar */}
        <div className="flex items-center border border-primary rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-full"
          />
          <FaSearch className="text-gray-500 cursor-pointer hover:text-primary" />
        </div>

        {/* Language Selector */}
        <hr className="h-[35px] bg-white/80 border-none w-[1px]" />

        {/* Icons Section */}
        <div className="flex items-center gap-6">
          {/* <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <FaCheckSquare className="text-purple-100 text-xl" />
              <span className="absolute top-[-38%] right-[-30%] bg-red-500 text-white text-[10px] rounded-full px-1">
                4
              </span>
            </div>

            <div className="relative cursor-pointer">
              <FaBell className="text-purple-100 text-xl" />
              <span className="absolute top-[-38%] right-[-30%] bg-red-500 text-white text-[10px] rounded-full px-1">
                4
              </span>
            </div>
          </div>
          <hr className="h-[35px] bg-white/80 border-none w-[1px]" /> */}

          {/* User Section */}
          <div
            className="relative  flex items-center space-x-2"
            ref={dropdownRef}
          >
            <div
              className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center cursor-pointer"
              onClick={toggleDropdown}
            >
              {/* استخدم الدالة المختصرة لتوليد الاسم المختصر */}
              {getInitials(user?.name)}
            </div>
            <span className="cursor-pointer" onClick={toggleDropdown}>
              Hi, {user?.name}
            </span>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-[-20%] mt-2 top-[135%] w-48 bg-white rounded-md shadow-lg z-50">
                <ul className="py-2 text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                    <Link href="/user" className="flex items-center gap-2">
                    <FaUser className="mr-2" /> Profile
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                    <FaSignOutAlt className="mr-2" /> Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
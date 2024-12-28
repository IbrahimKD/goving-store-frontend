"use client";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { IoDocumentsOutline } from "react-icons/io5";
import { MdOutlineSecurity } from "react-icons/md";

type Props = {};

const UserSidebar = (props: Props) => {
  const user = useUserStore().user;
  const [registrationDate, setRegistrationDate] = useState<string>("");

  useEffect(() => {
    if (user?.createdAt) {
      const formattedDate = new Date(user.createdAt).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
      setRegistrationDate(formattedDate);
    } else {
      setRegistrationDate("Date not available");
    }
  }, [user?.createdAt]);

  return (
    <div className="w-[23%] max-md:w-full md:border-r flex flex-col border-white/20">
      <div className="px-5 py-6 border-b border-white/20 flex flex-col justify-center items-start">
        <h2 className="font-semibold text-[15px] text-title">
          {user?.name || "Guest"}
        </h2>
        <span className="text-sm text-accent overflow-hidden text-ellipsis whitespace-nowrap max-w-[100%]">
          {user?.email || "No email available"}
        </span>
      </div>
      <div className="py-10 px-6 border-b border-white/20">
        <ul className="flex flex-col justify-center gap-y-7 items-center">
          <li className="w-full">
            <Link
              href={"/user"}
              className="flex w-full justify-between items-center"
            >
              <span className="flex gap-3 text-sm text-accent items-center">
                <FaRegUserCircle /> Personal Information
              </span>
              <IoIosArrowForward className="text-accent" />
            </Link>
          </li>
          <li className="w-full">
            <Link
              href={"/user/orders"}
              className="flex w-full justify-between items-center"
            >
              <span className="flex gap-3 text-sm text-accent items-center">
                <IoDocumentsOutline />
                Orders
              </span>
              <IoIosArrowForward className="text-accent" />
            </Link>
          </li>
          <li className="w-full">
            <Link
              href={"/user/security-settings"}
              className="flex w-full justify-between items-center"
            >
              <span className="flex gap-3 text-sm text-accent items-center">
                <MdOutlineSecurity /> Security Settings
              </span>
              <IoIosArrowForward className="text-accent" />
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-col p-6 gap-1 max-md:hidden">
        <h2 className="font-semibold text-sm">Registration Date</h2>
        <span className="text-accent text-sm">{registrationDate}</span>
      </div>
    </div>
  );
};

export default UserSidebar;

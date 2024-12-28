import React from 'react'

type Props = {}
import { IoIosLogOut } from "react-icons/io";

const LogoutBtn = (props: Props) => {
  return (
    <button className="w-[95%] md:hidden mx-auto px-2 py-2.5 bg-[#160507] my-3 text-sm border border-red-800 rounded-xl flex justify-center items-center gap-2 text-[#db3545]">
      <IoIosLogOut className='text-lg'/> <span>Logout</span>
    </button>
  );
}

export default LogoutBtn
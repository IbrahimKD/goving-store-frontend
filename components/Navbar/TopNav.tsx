"use client";
import React, { useState, useEffect } from "react";

type Props = {};

const TopNav = (props: Props) => {
  const [position, setPosition] = useState(100); // موضع النص الأولي على المحور X

  return (
    <div className="w-full flex justify-center items-center text-center bg-black py-2.5 px-4 overflow-hidden">
      <span className="text-white text-center text-sm">
        Built by{" "}
        <a href="https://instagram.com/jamal_mohafil" target="_blank" className="text-primary">
          Jamal Mohafil
        </a>, Using Next.js and Express.js
      </span>
    </div>
  );
};

export default TopNav;

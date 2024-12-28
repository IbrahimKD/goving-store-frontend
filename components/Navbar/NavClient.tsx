"use client";
import React, { useEffect } from "react";
import Nav from "./Nav";
import { useUserStore } from "@/store/userStore";
import Cookies from "js-cookie";
const NavClient = ({ user,categories }: any) => {
  const { setUser, user: storedUser } = useUserStore();

  // فقط قم بتحديث الstore إذا كان المستخدم غير موجود مسبقا
  useEffect(() => {
    if (user && user !== storedUser && Cookies.get("token")) {
      setUser(user);
    }
  }, [user]);

  return <Nav user={user} categories={categories} />;
};

export default NavClient;

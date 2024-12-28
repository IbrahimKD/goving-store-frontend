"use client";
import React, { useEffect } from "react";
 import { useUserStore } from "@/store/userStore";
import AdminHeader from "./AdminHeader";

const AdminHeaderClient = ({ user }: any) => {
  const { setUser } = useUserStore();

  // فقط قم بتحديث الstore إذا كان المستخدم غير موجود مسبقا
  useEffect(()=>{
    setUser(user)
  },[user])

  return <AdminHeader user={user} />;
};

export default AdminHeaderClient;

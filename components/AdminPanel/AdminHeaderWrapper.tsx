"use server";
import { fetchUser } from "@/lib/actions/user/fetchUser";
import { cookies } from "next/headers";
import AdminHeaderClient from "./AdminHeaderClient";

const AdminHeaderWrapper = async ({ params }: any) => {
  const cookieStore = await cookies();
  const token: any = cookieStore.get("token"); // استرجاع التوكن من الكوكيز
  let user = null;

  if (token) {
    try {
      user = await fetchUser(token);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  // تمرير بيانات المستخدم إلى مكون العميل
  return <AdminHeaderClient user={user} />;
};

export default AdminHeaderWrapper;

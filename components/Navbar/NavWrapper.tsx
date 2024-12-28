"use server";
import { fetchUser } from "@/lib/actions/user/fetchUser";
import { cookies } from "next/headers";
import NavClient from "./NavClient"; // استدعاء مكون العميل الذي سيتعامل مع الواجهة
import APIURL from "../URL";

// ذاكرة مؤقتة للتصنيفات
const categoriesCache = new Map();

const getCategories = async () => {
  const cacheKey = "categories"; // مفتاح التخزين المؤقت

  // تحقق إذا كانت التصنيفات موجودة في الذاكرة المؤقتة
  if (categoriesCache.has(cacheKey)) {
    console.log("Fetching categories from cache...");
    return categoriesCache.get(cacheKey);
  }

  try {
    console.log("Fetching categories from API...");
    const res = await fetch(`${APIURL}/categories/getNavCategories`, {
      method: "GET",
    });
    const data = await res.json();

    // تخزين التصنيفات في الذاكرة المؤقتة
    categoriesCache.set(cacheKey, data.categories);

    // تعيين مدة صلاحية الكاش (اختياري)
    setTimeout(() => {
      categoriesCache.delete(cacheKey);
    }, 5 * 60 * 1000); // مسح الكاش بعد 5 دقائق

    return data.categories;
  } catch (e) {
    console.error("Error fetching categories:", e);
    return [];
  }
};


const NavWrapper = async ({ params }: any) => {
  const cookieStore = await cookies();

  const token: any = cookieStore.get("token"); // استرجاع التوكن من الكوكيز
  let user = null;
  let categories = [];
  if (token) {
    try {
      categories = await getCategories(); // استدعاء التصنيفات مع الكاش
      user = await fetchUser(token);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  // تمرير بيانات المستخدم إلى مكون العميل
  return <NavClient user={user} categories={categories} />;
};

export default NavWrapper;

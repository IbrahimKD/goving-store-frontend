import APIURL from "@/components/URL";
import Cookies from "js-cookie";

export const fetchUser = async (token: any) => {
  try {
    const response = await fetch(`${APIURL}/user/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
    });

    // إذا كانت الاستجابة غير صحيحة، احذف التوكن من الكوكيز
    if (!response.ok) {
      Cookies.remove("token"); // افتراضاً أن التوكن يتم تخزينه باسم "token"
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json(); // استهلك الجسم بعد التحقق
    console.log(data)
    // إذا لم تكن هناك بيانات مستخدم، احذف التوكن
    if (!data || Object.keys(data).length === 0) {
      Cookies.remove("token");
      throw new Error("No user data found");
    }

    return data; // تأكد من إرجاع البيانات
  } catch (error) {
    console.error("Error fetching user:", error);
    return null; // إذا كان هناك خطأ، إرجاع null أو ما يناسب
  }
};

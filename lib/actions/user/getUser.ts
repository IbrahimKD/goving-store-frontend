import APIURL from "@/components/URL";

export const getUser = async (id:string,token: any) => {
  try {
   
    const response = await fetch(`${APIURL}/user/getUser/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // إذا كانت الاستجابة غير صحيحة، احذف التوكن من الكوكيز
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json(); // استهلك الجسم بعد التحقق

    // إذا لم تكن هناك بيانات مستخدم، احذف التوكن
    if (!data || Object.keys(data).length === 0) {
      throw new Error("No user data found");
    }

    return data; // تأكد من إرجاع البيانات
  } catch (error) {
    console.error("Error fetching user:", error);
    return null; // إذا كان هناك خطأ، إرجاع null أو ما يناسب
  }
};

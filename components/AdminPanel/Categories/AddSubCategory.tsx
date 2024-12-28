"use client";
import React, {
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
  Suspense,
  useEffect,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
// Lazy load ReactQuill and IconPicker components
const IconPicker = dynamic(
  () => import("@/components/utils/IconPicker").then((mod) => mod.IconPicker),
  {
    ssr: false,
    loading: () => <div>Loading icon picker...</div>,
  }
);

import { SubCategoryForm } from "./SubCategoryForm";
import APIURL from "@/components/URL";
import { toast } from "react-toastify";

interface SubCategoryType {
  title: string;
  icon: string;
}

const AddSubCategory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [subCategory, setSubCategory] = useState<SubCategoryType>({
    title: "",
    icon: "",
  });
  const [categories, setCategories] = useState<any>([]);
  const [searchQueryCat, setSearchQueryCat] = useState<string>("");
  const [loadingCat, setLoadingCat] = useState<Boolean>(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCat(true);
        const queryParams = new URLSearchParams({
          search: searchQueryCat,
        });
        const res = await fetch(
          `${APIURL}/categories/forFilter?${queryParams}`,
          {
            method: "GET",
            headers: { authorization: `Bearer ${Cookies.get("token")}` },
          }
        );
        const data = await res.json();
        if (data && data.categories) {
          setCategories(data.categories);
        } else {
          setCategories([]);
        }
        setLoadingCat(false);
      } catch (e) {
        setLoadingCat(false);
      }
    };
    fetchCategories();
  }, []);
  const [showIconPicker, setShowIconPicker] = useState<boolean>(false);
  const [iconType, setIconType] = useState<"category" | "subcategory">(
    "category"
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // تعيين حالة التحميل إلى true
    if (!subCategory.title || !selectedCategory) {
      return toast.warn("Name And Category Are Required");
    }
    const payload = {
      name: subCategory.title,
      icon: subCategory.icon || "",
      category: selectedCategory,
    };

    try {
      const response = await fetch(`${APIURL}/subCategories`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // استخدم المتغير payload هنا
      });
      const data = await response.json();

      // التحقق من الحالة وإظهار الرسائل المناسبة
      if (response.ok) {
        // استخدام response.ok لفحص الحالة
        setSubCategory({ title: "", icon: "" });
        toast.success("SubCategory Added Successfully");
      } else {
        const errorMessage =
          data?.message || "A problem occurred, please try again later";
        toast.error(errorMessage); // عرض رسالة الخطأ
      }
    } catch (error) {
      console.error("Error adding subCategory:", error);
      toast.error("An error occurred while adding the subCategory.");
    } finally {
      setLoading(false); // تعيين حالة التحميل إلى false في النهاية
    }
  };

  const handleIconSelect = (icon: string) => {
    if (iconType === "category") {
      setSubCategory({ ...subCategory, icon });
    }
    setShowIconPicker(false);
  };

  return (
    <div className="flex flex-col mx-auto gap-y-3 p-4 w-[100%] rounded-lg shadow-md">
      <SubCategoryForm
        categories={categories}
        subCategory={subCategory}
        setSubCategory={setSubCategory}
        setShowIconPicker={setShowIconPicker}
        showIconPicker={showIconPicker}
        loading={loading}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleSubmit={handleSubmit}
      />

      {showIconPicker && (
        <Suspense fallback={<div>Loading...</div>}>
          <IconPicker
            setShowIconPicker={setShowIconPicker}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleIconSelect={handleIconSelect}
            showIconPicker={showIconPicker}
          />
        </Suspense>
      )}
    </div>
  );
};

export default AddSubCategory;

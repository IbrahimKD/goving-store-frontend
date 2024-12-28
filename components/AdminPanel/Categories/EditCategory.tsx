"use client";
import React, { useState, FormEvent, Suspense } from "react";

import "cropperjs/dist/cropper.css";
import dynamic from "next/dynamic";
import AdminPanelLoading from "../utils/AdminPanelLoading";
import { CategoryForm } from "./CategoryForm";
import { IconPicker } from "@/components/utils/IconPicker";
import {toast} from "react-toastify";
import APIURL from "@/components/URL";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import IMAGEURL from "@/components/IMAGEURL";
// Lazy load ReactQuill and IconPicker components

interface CategoryType {
  name: string;
  icon: string;
  description: string;
  image: string;
}

const EditCategory = ({
  cat,
}: {
  cat: {
    _id:string;
    name: string;
    icon: string;
    description: string;
    image: string;
  };
}) => {
  const [category, setCategory] = useState<CategoryType>({
    name: cat.name,
    icon: cat.icon,
    description: cat?.description,
    image: cat.image ? `${IMAGEURL}${cat.image}` : "",
  });

  const [showIconPicker, setShowIconPicker] = useState<boolean>(false);
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading,setLoading] = useState(false)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!category.name || !category.icon) {
      return toast.warn("Name, Icon, and a valid Image file are required");
    }
    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("icon", category.icon);
    formData.append("description", category.description);
    formData.append("image", category.image); // تأكد من أن هذا هو الملف

 
    const response = await fetch(`${APIURL}/categories/${cat._id}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: formData,
    });

    // معالجة الاستجابة
    const data = await response.json();
     if (data && data.message ===  "category not exsist" ) {
      toast.success("Category not exsist");

      setLoading(false);
    }
    if (data && data.status === 201) {
      toast.success("Category added successfully");
      setLoading(false);
    } else if (data && data.status === 400) {
      toast.error("Name, Icon, and Image are required");
      setLoading(false);
    }
    router.refresh();

    setLoading(false);
   };

  const handleIconSelect = (icon: string) => {
    setCategory({ ...category, icon });
    setShowIconPicker(false);
  };

  return (
    <div className="flex flex-col mx-auto gap-y-3 p-4 w-[100%] rounded-lg shadow-md">
      <CategoryForm
        category={category}
        setShowIconPicker={setShowIconPicker}
        showIconPicker={showIconPicker}
        setCategory={setCategory}
        isEdit={true}
        loading={loading}
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

export default EditCategory;

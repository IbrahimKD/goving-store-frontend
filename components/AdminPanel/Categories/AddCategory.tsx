"use client";
import React, { useState, FormEvent, Suspense } from "react";
import dynamic from "next/dynamic";
import { CategoryForm } from "./CategoryForm";
import AdminPanelLoading from "../utils/AdminPanelLoading";
import Cookies from "js-cookie";
import APIURL from "@/components/URL";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { faPray } from "@fortawesome/free-solid-svg-icons";
// Lazy load IconPicker
const IconPicker = dynamic(
  () => import("@/components/utils/IconPicker").then((mod) => mod.IconPicker),
  { ssr: false, loading: () => <div>Loading icon picker...</div> }
);

interface CategoryType {
  name: string;
  icon: string;
  description: string;
  image: string;
}

const AddCategory: React.FC = () => {
  const [category, setCategory] = useState<CategoryType>({
    name: "",
    icon: "",
    image: "",
    description: "",
    
  });

  const [showIconPicker, setShowIconPicker] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
   const [loading, setLoading] = useState(false);
  const router = useRouter()
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!category.name || !category.icon || !(category.image instanceof File)) {
      return toast.warn("Name, Icon, and a valid Image file are required");
    }
    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("icon", category.icon);
    formData.append("description", category.description);
    formData.append("image", category.image); // تأكد من أن هذا هو الملف
 
    const response = await fetch(`${APIURL}/categories`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: formData,
    });

    // معالجة الاستجابة
    const data = await response.json();
     if (data && data.status === 201) {
      toast.success("Category added successfully");
      setCategory({
        name: "",
        description: "",
        image: "",
        icon: "",
      });
      setLoading(false);
    } else if (data && data.status === 400) {
      toast.error("Name, Icon, and Image are required");
      setLoading(false);
    }
    router.refresh()

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
        setCategory={setCategory}
        setShowIconPicker={setShowIconPicker}
        showIconPicker={showIconPicker}
        handleSubmit={handleSubmit}
        loading={loading} isEdit={false}      />

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

export default AddCategory;

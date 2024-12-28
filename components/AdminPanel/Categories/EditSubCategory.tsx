"use client";
import React, { useState, useEffect, FormEvent, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import "cropperjs/dist/cropper.css";

// Lazy load ReactQuill and IconPicker components
 const IconPicker = dynamic(
  () => import("@/components/utils/IconPicker").then((mod) => mod.IconPicker),
  {
    ssr: false,
    loading: () => <div>Loading icon picker...</div>,
  }
);
const SubCategoryForm = dynamic(
  () => import("./SubCategoryForm").then((mod) => mod.SubCategoryForm),
  {
    ssr: false,
    loading: () => <AdminPanelLoading />,
  }
);
import "react-quill/dist/quill.snow.css";
import AdminPanelLoading from "../utils/AdminPanelLoading";
import APIURL from "@/components/URL";
import { toast } from "react-toastify";

interface SubCategoryType {
  title: string;
  icon: string;
}

const EditSubCategory: React.FC = ({ subCat }: any) => {
  console.log(subCat?.category[0]);
  console.log(subCat);
  const [selectedCategory, setSelectedCategory] = useState<any>(
    subCat?.category[0]
  );
  const [subCategory, setSubCategory] = useState<SubCategoryType>({
    title: subCat.name,
    icon: subCat.icon,
  });
  const [categories, setCategories] = useState<any>([]);
  const [loadingCat, setLoadingCat] = useState<Boolean>(false);
  const [loading, setLoading] = useState(false);
  const [searchQueryCat, setSearchQueryCat] = useState<string>("");
  const [showIconPicker, setShowIconPicker] = useState<boolean>(false);
  const [iconType, setIconType] = useState<"category" | "subcategory">(
    "category"
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

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
        console.error(e);
      }
    };
    fetchCategories();
  }, [searchQueryCat]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!subCategory.title || !selectedCategory) {
      toast.warn("Name and Category are required");
      setLoading(false);
      return;
    }
    const payload = {
      name: subCategory.title,
      icon: subCategory.icon || "",
      category: [selectedCategory],
    };
    console.log(payload)
    try {
      const response = await fetch(`${APIURL}/subCategories/${subCat._id}`, {
        method: "PUT", // Use PUT for updating
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
     
        toast.success("SubCategory updated successfully");
      } else {
        const errorMessage =
          data?.message || "A problem occurred, please try again later";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating subCategory:", error);
      toast.error("An error occurred while updating the subCategory.");
    } finally {
      setLoading(false);
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
        isEdit={true}
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

export default EditSubCategory;

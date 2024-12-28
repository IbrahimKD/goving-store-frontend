import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // استيراد مكونات Shadcn
import "react-quill/dist/quill.snow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

type Props = {
  setShowIconPicker: any;
  showIconPicker: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  categories: { name: string; icon: string; _id: string }[]; // تأكد من أن هذا هو الهيكل الصحيح
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  subCategory: { title: string; icon: string };
  setSubCategory: React.Dispatch<
    React.SetStateAction<{ title: string; icon: string }>
  >;
  loading: boolean;
  isEdit?: boolean;
};

export const SubCategoryForm: React.FC<Props> = ({
  handleSubmit,
  categories,
  setShowIconPicker,
  showIconPicker,
  subCategory,
  setSubCategory,
  selectedCategory,
  loading,
  setSelectedCategory,
  isEdit,
}) => {
  // تحويل التصنيفات إلى الشكل الذي تحتاجه Shadcn Select
  const options = categories.map((category) => ({
    value: category._id,
    label: (
      <div className="flex items-center">
        {category.name}
        <FontAwesomeIcon icon={category.icon as any} className="w-4 h-4 ml-2" />
      </div>
    ),
  }));

  const handleCategoryChange = (selectedOption: any) => {
    setSelectedCategory(selectedOption);
  };
   return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
      {/* SubCategory Name Field */}
      <div className="grid grid-cols-[0.5fr,1.3fr] items-center w-full gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-sm text-accent px-0.5">
            SubCategory Name
          </Label>
          <Input
            type="text"
            id="name"
            value={subCategory.title}
            onChange={(e) =>
              setSubCategory({ ...subCategory, title: e.target.value })
            }
            placeholder="SubCategory Name"
            className="bg-secondary text-white px-4 py-2 rounded-md border border-primary"
          />
        </div>
        {/* Icon Picker */}
        <div className="flex items-center gap-2 mt-7">
          <span className="w-full bg-secondary h-full py-[10px] rounded-lg px-4">
            {subCategory.icon
              ? `${subCategory.icon.toString()}`
              : "Select Icon"}
          </span>
          <Button
            type="button"
            onClick={() => {
              setShowIconPicker(true);
            }}
            className="bg-primary text-white rounded-md px-4 py-2"
          >
            Choose Icon
          </Button>
        </div>
      </div>

      {/* Category Select Field */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="category" className="text-sm text-accent px-0.5">
          Select Main Category
        </Label>
        <Select onValueChange={handleCategoryChange} value={selectedCategory}>
          <SelectTrigger className="bg-secondary border border-primary text-white">
            <SelectValue placeholder="Select Main Category" />
          </SelectTrigger>
          <SelectContent style={{ maxHeight: "300px", overflowY: "auto" }}>
            {/* ترتيب العناصر من A-Z */}
            {options
              .sort((a, b) => {
                try {
                  const textA = a.label?.props?.children?.[0] || "";
                  const textB = b.label?.props?.children?.[0] || "";
                  return textA.localeCompare(textB);
                } catch (error) {
                  console.error("Sorting error: ", error, a, b);
                  return 0; // في حال وجود خطأ، عدم تغيير الترتيب
                }
              })

              .map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="bg-primary text-white rounded-md px-4 py-2"
      >
        {isEdit ? (
          loading ? (
            <div className="loader ease-linear rounded-full border-2 border-t-8 border-white h-6 w-6"></div>
          ) : (
            "Update SubCategory"
          )
        ) : loading ? (
          <div className="loader ease-linear rounded-full border-2 border-t-8 border-white h-6 w-6"></div>
        ) : (
          "Create SubCategory"
        )}
      </Button>
    </form>
  );
};

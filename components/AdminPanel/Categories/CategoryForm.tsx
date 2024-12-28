import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { toast } from "react-toastify";

type Props = {
  setCategory: any;
  setShowIconPicker: any;
  loading: boolean;
  showIconPicker: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  category: {
    name: string;
    icon: string;
    description: string;
    image: string | File;
  };
  isEdit: boolean;
};

export const CategoryForm: React.FC<Props> = ({
  setCategory,
  handleSubmit,
  category,
  setShowIconPicker,
  loading,
  isEdit,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageInfo, setImageInfo] = useState<{
    size: string;
    dimensions: string;
  } | null>(null);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        const file = acceptedFiles[0];
        handleImageUpload(file);
        // التحقق من حجم الملف (10 ميجابايت)
        if (file.size > 10 * 1024 * 1024) {
          toast.error("image size must be less than 10mb ");
          return;
        }
        // تحديث الحالة مباشرةً مع ملف الصورة
        setCategory({ ...category, image: file }); // استخدم `image` كـ ملف `File`
      }
    },
    [category]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();

    reader.onloadstart = () => setUploadProgress(0);

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(progress);
      }
    };

    reader.onload = (event) => {
      const base64String = event.target?.result as string;

      const img = new Image();
      img.onload = () => {
        const dimensions = `${img.width}x${img.height}`;
        const size = (file.size / 1024).toFixed(2) + " KB";
        setImageInfo({ size, dimensions });
      };
      img.src = base64String;
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setCategory({ ...category, image: "" });
    setImageInfo(null);
    setUploadProgress(0);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <div className="grid grid-cols-[0.5fr,1.3fr] items-center w-full gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-sm text-accent px-0.5">
            Category Name
          </Label>
          <Input
            type="text"
            id="name"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            placeholder="Category Name"
          />
        </div>
        <div className="flex items-center gap-2 mt-7">
          <span className="w-full bg-secondary h-full py-[10px] rounded-lg px-4">
            {category.icon ? `${category.icon}` : "Select Icon"}
          </span>
          <Button
            type="button"
            onClick={() => {
              setShowIconPicker(true);
            }}
          >
            Choose Icon
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="desc" className="text-sm text-accent px-0.5">
          Category Description
        </Label>
        <textarea
          className="bg-secondary text-white px-4 max-h-[300px] min-h-[100px] py-3"
          id="desc"
          value={category.description}
          onChange={(e) =>
            setCategory({ ...category, description: e.target.value })
          }
          placeholder="Category Description"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="image" className="text-sm text-accent px-0.5">
          Category Image
        </Label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed w-max rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-gray-300 hover:border-primary"
          }`}
        >
          <input {...getInputProps()} />
          {category.image ? (
            <div className="relative">
              <img
                src={
                  category.image
                    ? typeof category.image === "object" &&
                      category.image instanceof File
                      ? URL.createObjectURL(category.image)
                      : category.image.startsWith("http")
                      ? category.image
                      : ""
                    : ""
                }
                alt="Category"
                className="max-w-full h-auto max-h-[300px] object-contain mx-auto"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Drag and drop the image here, or click to choose a file
              </p>
            </div>
          )}
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <Progress value={uploadProgress} className="w-full mt-2" />
        )}
        {imageInfo && (
          <div className="text-sm text-accent mt-2">
            Size: {imageInfo.size} | Dimensions: {imageInfo.dimensions}
          </div>
        )}
      </div>
      <Button type="submit" disabled={loading}>
        {" "}
        {!loading ? (
          isEdit ? (
            "Update Category"
          ) : (
            "Add Category"
          )
        ) : (
          <div className="loader ease-linear rounded-full border-2 border-t-8 border-white h-6 w-6"></div>
        )}
      </Button>
    </form>
  );
};

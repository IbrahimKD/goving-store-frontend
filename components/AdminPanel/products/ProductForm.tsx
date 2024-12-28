import React, {
  ChangeEvent,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Select from "react-select";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Image from "next/image";
import { toast } from "react-toastify";
import IMAGEURL from "@/components/IMAGEURL";

interface CategoryType {
  _id: string;
  name: string;
}
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
};
interface InputType {
  name: string;
  inputType: string;
  description: string;
}

interface PropDetailType {
  title: string;
  price: number;
  quantity: number;
}

interface PropsType {
  typeOfProps: string;
  title: string;
  details: PropDetailType[];
}

type Props = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  banner: string;
  setBanner: React.Dispatch<React.SetStateAction<string>>;
  image: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  price: string;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  beforePrice: string;
  setBeforePrice: React.Dispatch<React.SetStateAction<string>>;
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  category: CategoryType;
  setCategory: React.Dispatch<React.SetStateAction<CategoryType>>;
  subCategories: string[];
  setSubCategories: React.Dispatch<React.SetStateAction<string[]>>;
  devices: string[];
  setDevices: React.Dispatch<React.SetStateAction<string[]>>;
  inputs: InputType[];
  setInputs: React.Dispatch<React.SetStateAction<InputType[]>>;
  props: PropsType;
  setProps: React.Dispatch<React.SetStateAction<PropsType>>;
  handleSubmit: (e: React.FormEvent) => void;
  croppedBanner: any;
  setCroppedBanner: React.Dispatch<React.SetStateAction<any>>;
  cropperRef: React.RefObject<any>;
  croppedImage: any;
  setCroppedImage: React.Dispatch<React.SetStateAction<any>>;
  cropperImageRef: React.RefObject<any>;
  CATEGORIES: { name: string; _id: number }[];
  SUBCATEGORIES: { name: string; category: string; _id: string }[];
  isEdit?: boolean;
};

export const ProductForm: React.FC<Props> = ({
  name,
  setName,
  description,
  setDescription,
  banner,
  setBanner,
  image,
  setImage,
  price,
  setPrice,
  loading,
  setLoading,
  quantity,
  setQuantity,
  beforePrice,
  setBeforePrice,
  note,
  setNote,
  category,
  setCategory,
  subCategories,
  setSubCategories,
  devices,
  setDevices,
  inputs,
  setInputs,
  props,
  setProps,
  CATEGORIES,
  SUBCATEGORIES,
  handleSubmit,
  croppedBanner,
  setCroppedBanner,
  cropperRef,
  croppedImage,
  setCroppedImage,
  cropperImageRef,
  isEdit,
}) => {
  const [fileName, setFileName] = useState("");
  const [fileNameImage, setFileNameImage] = useState("");
  const [localSubCategories, setLocalSubCategories] = useState<string[]>([]);

  useEffect(() => {
    if (subCategories) {
      const newSubs = subCategories.map((sub: any) => sub._id);
      setLocalSubCategories(newSubs);
    }
  }, []);
  console.log(localSubCategories);
  // Memoized handler for input changes
  const handleInputChange = useCallback(
    (index: number, field: keyof InputType, value: string) => {
      setInputs((prevInputs) => {
        const newInputs = [...prevInputs];
        newInputs[index] = { ...newInputs[index], [field]: value };
        return newInputs;
      });
    },
    []
  );

  // Memoized handler for adding inputs
  const addInput = useCallback(() => {
    setInputs((prevInputs) => [
      ...prevInputs,
      { name: "", inputType: "text", description: "" },
    ]);
  }, []);

  // Memoized handler for props changes
  const handlePropsChange = useCallback(
    (field: keyof PropsType, value: string) => {
      setProps((prevProps) => ({ ...prevProps, [field]: value }));
    },
    []
  );

  // Memoized handler for props detail changes
  const handlePropsDetailChange = useCallback(
    (index: number, field: keyof PropDetailType, value: string | number) => {
      setProps((prevProps) => {
        const newDetails = [...prevProps.details];
        newDetails[index] = { ...newDetails[index], [field]: value };
        return { ...prevProps, details: newDetails };
      });
    },
    []
  );

  // Memoized handler for adding props details
  const addPropsDetail = useCallback(() => {
    setProps((prevProps) => ({
      ...prevProps,
      details: [...prevProps.details, { title: "", price: 0, quantity: 0 }],
    }));
  }, []);

  // Memoized handler for device changes
  const handleDeviceChange = useCallback((device: string) => {
    setDevices((prevDevices) =>
      prevDevices.includes(device)
        ? prevDevices.filter((d) => d !== device)
        : [...prevDevices, device]
    );
  }, []);

  // Memoized cropped banner handler
  const getCroppedBanner = useCallback(() => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      cropperRef.current?.cropper.getCroppedCanvas().toBlob((blob: any) => {
        if (blob) {
          // تحويل Blob إلى ملف
          const file = new File([blob], "cropped-banner.jpg", {
            type: "image/jpeg",
          });
          setCroppedBanner(file); // تحديث الحالة بـ File
        }
      }, "image/jpeg");
    }
  }, [cropperRef, setCroppedBanner]);
  const getCroppedImage = useCallback(() => {
    if (typeof cropperImageRef.current?.cropper !== "undefined") {
      cropperImageRef.current?.cropper
        .getCroppedCanvas()
        .toBlob((blob: any) => {
          if (blob) {
            // تحويل Blob إلى ملف
            const file = new File([blob], "cropped-image.jpg", {
              type: "image/jpeg",
            });
            setCroppedImage(file); // تحديث الحالة بـ File
          }
        }, "image/jpeg");
    }
  }, [cropperImageRef, setCroppedImage]);
  // Memoized banner change handler
  const handleBannerChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setBanner(reader.result as string);
        };
        setFileName(file.name);
        reader.readAsDataURL(file);
      }
    },
    [setBanner]
  );
  const handleImageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result as string);
        };
        setFileNameImage(file.name);
        reader.readAsDataURL(file);
      }
    },
    [setImage]
  );

  // Memoized category options
  const categoryOptions = useMemo(
    () =>
      CATEGORIES.map((cat: any) => ({
        value: cat._id,
        label: cat.name,
      })),
    [CATEGORIES]
  );

  // Memoized subcategory options
  const subCategoryOptions = useMemo(
    () =>
      SUBCATEGORIES.filter((subCat) => subCat.category == category?._id).map(
        (subCat) => ({
          value: subCat._id,
          label: subCat.name,
        })
      ),
    [SUBCATEGORIES, category]
  );

  // Memoized category change handler
  const handleCategoryChange = useCallback(
    (selectedOption: any) => {
      if (selectedOption) {
        setCategory({
          _id: selectedOption.value,
          name: selectedOption.label,
        });
        setLocalSubCategories([]);
        setSubCategories([]);
      }
    },
    [setCategory, setSubCategories]
  );

  // Memoized subcategories change handler
  const handleSubCategoriesChange = useCallback(
    (selectedOptions: any) => {
      const newSubCategories = selectedOptions.map(
        (option: any) => option.value
      );
      setLocalSubCategories(newSubCategories);
      setSubCategories(newSubCategories);
    },
    [setSubCategories]
  );

  return (
    <div className="flex flex-col gap-y-4">
      <div className="grid grid-cols-2 w-full gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-sm text-accent px-0.5">
            Product Name (required)
          </Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="note" className="text-sm text-accent px-0.5">
            Note
          </Label>
          <Input
            type="text"
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 w-full gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="price" className="text-sm text-accent px-0.5">
            Price (required)
          </Label>
          <Input
            type="number"
            id="price"
            value={price}
            onChange={(e: any) => {
              // Only allow numbers and period
              const inputValue = e.target.value.replace(/[^0-9.]/g, "");

              // Ensure only one period is allowed
              const periodCount = (inputValue.match(/\./g) || []).length;
              if (periodCount > 1) {
                return;
              }

              // Validate the value before setting
              const numericValue = inputValue.replace(",", ".");
              const parsedValue = parseFloat(numericValue);

              // Check if the parsed value is valid and within range
              if (
                (parsedValue >= 0 && parsedValue <= 5000000000000) ||
                inputValue === "" ||
                inputValue === "."
              ) {
                setPrice(inputValue);
              } else {
                toast.error("Max number is 500000000");
              }
            }}
            onBlur={() => {
              // When leaving the input, convert to proper number format
              if (price) {
                const numericValue = String(price).replace(",", ".");
                const parsedValue = parseFloat(numericValue);

                if (parsedValue >= 0 && parsedValue <= 50000000) {
                  // Convert back to a string with comma as decimal separator
                  setPrice(parsedValue.toString().replace(".", ","));
                } else {
                  setPrice("");
                  toast.error("Max number is 500000000");
                }
              }
            }}
            placeholder="Price"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="beforePrice" className="text-sm text-accent px-0.5">
            Before Price
          </Label>
          <Input
            type="number"
            id="beforePrice"
            value={beforePrice}
            onChange={(e: any) => {
              // Only allow numbers and period
              const inputValue = e.target.value.replace(/[^0-9.]/g, "");

              // Ensure only one period is allowed
              const periodCount = (inputValue.match(/\./g) || []).length;
              if (periodCount > 1) {
                return;
              }

              // Validate the value before setting
              const numericValue = inputValue.replace(",", ".");
              const parsedValue = parseFloat(numericValue);

              // Check if the parsed value is valid and within range
              if (
                (parsedValue >= 0 && parsedValue <= 5000000000000) ||
                inputValue === "" ||
                inputValue === "."
              ) {
                setBeforePrice(inputValue);
              } else {
                toast.error("Max number is 500000000");
              }
            }}
            onBlur={() => {
              // When leaving the input, convert to proper number format
              if (beforePrice) {
                const numericValue = String(beforePrice).replace(",", ".");
                const parsedValue = parseFloat(numericValue);

                if (parsedValue >= 0 && parsedValue <= 50000000) {
                  // Convert back to a string with comma as decimal separator
                  setBeforePrice(parsedValue.toString().replace(".", ","));
                } else {
                  setBeforePrice("");
                  toast.error("Max number is 500000000");
                }
              }
            }}
            placeholder="Before Price"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 ">
        <Label htmlFor="description" className="text-sm text-white px-0.5">
          Description
        </Label>
        {typeof window !== "undefined" && (
          <ReactQuill
            value={description}
            onChange={setDescription}
            modules={modules}
            theme="snow"
          />
        )}
      </div>

      <div className="flex flex-col mt-4 items-center gap-4">
        {" "}
        <Label htmlFor="description" className="text-lg text-white px-0.5">
          Banner (required)
        </Label>
        <label
          htmlFor="banner"
          className="flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
        >
          {banner ? (
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-gray-500 font-medium">Change Banner</span>
              <span className="text-sm text-gray-400 ">{fileName}</span>{" "}
              {/* عرض اسم الملف */}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-gray-500 font-medium">
                Click to upload banner
              </span>
            </div>
          )}
          <input
            type="file"
            id="banner"
            onChange={handleBannerChange}
            accept="image/*"
            className="hidden"
          />
        </label>
      </div>
      {banner && (
        <div className="flex flex-col gap-2 mt-4">
          <Cropper
            src={banner}
            style={{ height: 200, width: "100%" }}
            aspectRatio={21 / 4.5}
            guides={false}
            cropBoxResizable={true}
            viewMode={1}
            dragMode="move"
            ref={cropperRef}
          />
          <Button
            onClick={getCroppedBanner}
            className="bg-secondary text-white"
          >
            Crop Banner
          </Button>
        </div>
      )}
      {isEdit && banner && !croppedBanner ? (
        <div className="mt-4 relative">
          <h3 className="text-lg font-semibold mb-2">Banner Preview</h3>
          <img
            src={`${IMAGEURL}${banner}`}
            alt="Uploaded banner"
            className="w-full"
          />
        </div>
      ) : (
        croppedBanner && (
          <div className="mt-4 relative">
            <h3 className="text-lg font-semibold mb-2">
              Cropped Banner Preview
            </h3>

            <img
              src={
                croppedBanner instanceof File
                  ? URL.createObjectURL(croppedBanner)
                  : croppedBanner
              }
              alt="Cropped banner"
              className="w-full"
            />
          </div>
        )
      )}
      <div className="flex flex-col mt-4 items-center gap-4">
        {" "}
        <Label htmlFor="description" className="text-lg text-white px-0.5">
          Image (required)
        </Label>
        <label
          htmlFor="image"
          className="flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
        >
          {image ? (
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-gray-500 font-medium">Change Image</span>
              <span className="text-sm text-gray-400 ">
                {fileNameImage}
              </span>{" "}
              {/* عرض اسم الملف */}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-gray-500 font-medium">
                Click to upload image
              </span>
            </div>
          )}
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </label>
      </div>
      {image && (
        <div className="flex flex-col gap-2 mt-4">
          <Cropper
            src={image}
            style={{ height: 200, width: "100%" }}
            aspectRatio={NaN} // بدون تحديد نسبة أبعاد ثابتة
            guides={false}
            cropBoxResizable={true}
            viewMode={1}
            dragMode="move"
            ref={cropperImageRef}
            cropBoxMovable={true}
            minCropBoxWidth={270} // الحد الأدنى للعرض
            minCropBoxHeight={50} // قيمة افتراضية لتجنب الخطأ
            zoomable={true} // تمكين التكبير/التصغير إذا كانت الصورة أكبر
          />

          <Button
            onClick={() => {
              getCroppedImage();
            }}
            className="bg-secondary text-white"
          >
            Crop Image
          </Button>
        </div>
      )}
      {isEdit && image && !croppedImage ? (
        <div className="mt-4 relative">
          <h3 className="text-lg font-semibold mb-2">Image Preview</h3>

          <img
            src={`${IMAGEURL}${image}`}
            alt="Uploaded image"
            className="w-full max-h-[300px] object-contain"
          />
        </div>
      ) : (
        croppedImage && (
          <div className="mt-4 relative">
            <h3 className="text-lg font-semibold mb-2">
              Cropped Image Preview
            </h3>

            <img
              src={
                croppedImage instanceof File
                  ? URL.createObjectURL(croppedImage)
                  : croppedImage
              }
              alt="Cropped image"
              className="w-full max-h-[300px] object-contain"
            />
          </div>
        )
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="quantity" className="text-sm text-accent px-0.5">
          Quantity
        </Label>
        <Input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Quantity"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="category" className="text-sm text-accent px-0.5">
          Category
        </Label>
        <Select
          id="category"
          options={categoryOptions}
          value={categoryOptions.find(
            (option) => option.value === category?._id
          )}
          onChange={handleCategoryChange}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="subCategories" className="text-sm text-accent px-0.5">
          Sub Categories
        </Label>
        <Select
          id="subCategories"
          options={subCategoryOptions}
          value={subCategoryOptions.filter((option) =>
            localSubCategories.includes(option.value)
          )}
          onChange={handleSubCategoriesChange}
          isMulti
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm text-accent px-0.5">Devices</Label>
        <div className="flex gap-2">
          {["XBOX", "PHONE", "PC", "PLAYSTATION"].map((device) => (
            <label key={device} className="flex items-center">
              <input
                type="checkbox"
                checked={devices.includes(device)}
                onChange={() => handleDeviceChange(device)}
                className="mr-2"
              />
              {device}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm text-accent px-0.5">Inputs</Label>
        {inputs.map((input, index) => {
          return (
            <div key={index} className="flex gap-2">
              <Input
                type="text"
                value={input.name}
                onChange={(e) =>
                  handleInputChange(index, "name", e.target.value)
                }
                placeholder="Input Name"
              />
              <select
                value={input.inputType}
                onChange={(e) =>
                  handleInputChange(index, "inputType", e.target.value)
                }
                className="bg-gray-900 text-sm px-4 py-2 border border-white/10 rounded-md"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                {/* <option value="file">File</option> */}
              </select>
              <Input
                type="text"
                value={input.description}
                onChange={(e) =>
                  handleInputChange(index, "description", e.target.value)
                }
                placeholder="Input Description"
              />
            </div>
          );
        })}
        <Button type="button" onClick={addInput}>
          Add Input
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm text-accent px-0.5">Props</Label>
        <select
          value={props.typeOfProps}
          className="bg-secondary border border-primary  px-4  max-w-[400px]  py-3 rounded-md"
          onChange={(e) => handlePropsChange("typeOfProps", e.target.value)}
        >
          <option value="">Type of Props</option>
          <option value="select">select</option>
          <option value="cards">cards</option>
        </select>
        <Input
          type="text"
          value={props.title}
          onChange={(e) => handlePropsChange("title", e.target.value)}
          placeholder="Props Title"
        />
        {props.details.map((detail, index) => (
          <div key={index} className="flex gap-2">
            <Input
              type="text"
              value={detail.title}
              onChange={(e) =>
                handlePropsDetailChange(index, "title", e.target.value)
              }
              placeholder="Detail Title"
            />
            <Input
              type="number"
              value={detail.price === 0 ? "" : detail.price}
              onChange={(e) =>
                handlePropsDetailChange(index, "price", Number(e.target.value))
              }
              placeholder="Detail Price"
            />
            <Input
              type="number"
              value={detail.quantity === 0 ? "" : detail.quantity}
              onChange={(e) =>
                handlePropsDetailChange(
                  index,
                  "quantity",
                  Number(e.target.value)
                )
              }
              placeholder="Detail Quantity"
            />
          </div>
        ))}
        <Button type="button" onClick={addPropsDetail}>
          Add Detail
        </Button>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-primary text-white rounded-md"
      >
        {isEdit ? "Update Product" : "Add Product"}
      </Button>
    </div>
  );
};

ProductForm.displayName = "ProductForm";

export default ProductForm;

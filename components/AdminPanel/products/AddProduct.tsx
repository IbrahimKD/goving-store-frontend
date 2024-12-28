"use client";
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import AdminPanelLoading from "../utils/AdminPanelLoading";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import APIURL from "@/components/URL";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const ProductForm = dynamic(
  () => import("./ProductForm").then((mod) => mod.ProductForm),
  {
    ssr: false,
    loading: () => <AdminPanelLoading />,
  }
);

interface CategoryType {
  name: string;
  _id: string;
}

interface SubCategoryType {
  name: string;
  category: string;
  _id: string;
}

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

const CATEGORIES = [
  { id: 1, title: "Windows" },
  { id: 2, title: "Programs" },
  { id: 3, title: "Games" },
];

const SUBCATEGORIES = [
  { title: "1", categoryId: 1 },
  { title: "2", categoryId: 1 },
  { title: "3", categoryId: 2 },
  { title: "4", categoryId: 2 },
  { title: "5", categoryId: 3 },
  { title: "6", categoryId: 3 },
];

const AddProduct: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [banner, setBanner] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [beforePrice, setBeforePrice] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [category, setCategory] = useState<CategoryType>({
    name: "",
    _id: "",
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [SUBCATEGORIES, setSUBCATEGORIES] = useState<SubCategoryType[]>([]);
  const [devices, setDevices] = useState<string[]>([]);
  const [croppedBanner, setCroppedBanner] = useState<string | null>(null);
  const cropperRef = useRef<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const cropperImageRef = useRef<any>(null);

  const [inputs, setInputs] = useState<InputType[]>([
    { name: "", inputType: "text", description: "" },
  ]);
  const [props, setProps] = useState<PropsType>({
    typeOfProps: "",
    title: "Item",
    details: [{ title: "", price: 0, quantity: 0 }],
  });

  const getCategories = async () => {
    const res = await fetch(`${APIURL}/products/categoriesForProducts`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await res.json();
    if (data && data.categories) {
      setCategories(data.categories);
    }
    console.log(data);
  };
  const getSubCategories = async () => {
    const res = await fetch(`${APIURL}/products/subCategoriesForProducts`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await res.json();
    if (data && data.subCategories) {
      setSUBCATEGORIES(data.subCategories);
    }
    console.log(data);
  };

  useEffect(() => {
    getCategories();
    getSubCategories();
  }, []);
  console.log(croppedImage);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !price || price === 0 || !croppedImage || !croppedBanner) {
      setLoading(false);

      return toast.warn("Please fill required fields.");
    }
    if (!props && !quantity) {
      setLoading(false);

      return toast.warn("you should add props or quantity");
    }
    const product = {
      name,
      description,
      price,
      quantity,
      beforePrice,

      note,
      category: category?._id,
      subCategories: JSON.stringify(subCategories),
      devices: JSON.stringify(devices),
      inputs: JSON.stringify(inputs),
      props: JSON.stringify(props),
    };

    const formData = new FormData();
    if (croppedBanner instanceof File) {
      formData.append("banner", croppedBanner);
    } else {
      console.error("Cropped banner is not a valid Blob.");
    }
    if (croppedImage instanceof File) {
      formData.append("image", croppedImage);
    } else {
      console.error("Cropped banner is not a valid Blob.");
    }
    Object.entries(product).forEach(([key, value]) => {
      if (value) formData.append(key, value as string);
    });
    console.log(croppedBanner);

    try {
      const response = await fetch(`${APIURL}/products`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: formData,
      });
      console.log(response);
      const data = await response.json();
      console.log(data);
      if (
        data &&
        data.error ===
          "Product validation failed: quantity: Path `quantity` is required."
      ) {
      }
      if (response.ok) {
        console.log("Product added successfully");
        toast.success("Product added successfully");
        setName("");
        setDescription("");
        setBanner("");
        setImage("");
        setPrice("");
        setQuantity(0);
        setBeforePrice("");
        setNote("");
        setCategory({ name: "", _id: "" });
        setSubCategories([]);
        setDevices([]);
        setInputs([{ name: "", inputType: "text", description: "" }]);
        setProps({
          typeOfProps: "",
          title: "Item",
          details: [{ title: "", price: 0, quantity: 0 }],
        });
        setCroppedBanner(null);
        setCroppedImage(null);

        // Reset form or redirect
      } else {
        console.error("Failed to add product");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="flex flex-col gap-y-3 mx-auto p-4 w-[80vw] max-w-[1100px] max-md:w-[95%] rounded-lg shadow-md">
      <ProductForm
        name={name}
        loading={loading}
        setLoading={setLoading}
        setName={setName}
        description={description}
        setDescription={setDescription}
        banner={banner}
        image={image}
        setImage={setImage}
        setBanner={setBanner}
        price={price}
        setPrice={setPrice}
        quantity={quantity}
        setQuantity={setQuantity}
        beforePrice={beforePrice}
        setBeforePrice={setBeforePrice}
        note={note}
        setNote={setNote}
        category={category}
        setCategory={setCategory}
        subCategories={subCategories}
        setSubCategories={setSubCategories}
        devices={devices}
        setDevices={setDevices}
        CATEGORIES={categories}
        SUBCATEGORIES={SUBCATEGORIES}
        inputs={inputs}
        setInputs={setInputs}
        props={props}
        setProps={setProps}
        handleSubmit={handleSubmit}
        croppedBanner={croppedBanner}
        setCroppedBanner={setCroppedBanner}
        cropperRef={cropperRef}
        croppedImage={croppedImage}
        setCroppedImage={setCroppedImage}
        cropperImageRef={cropperImageRef}
      />
    </div>
  );
};

export default AddProduct;

"use client";
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import AdminPanelLoading from "../utils/AdminPanelLoading";

import APIURL from "@/components/URL";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ProductForm from "./ProductForm";

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

// const CATEGORIES = [
//   { id: 1, title: "Windows" },
//   { id: 2, title: "Programs" },
//   { id: 3, title: "Games" },
// ];

const SUBCATEGORIES = [
  { title: "1", categoryId: 1 },
  { title: "2", categoryId: 1 },
  { title: "3", categoryId: 2 },
  { title: "4", categoryId: 2 },
  { title: "5", categoryId: 3 },
  { title: "6", categoryId: 3 },
];
interface ProductType {
  product: {
    _id: string;
    name: string;
    description?: string;
    image: any;
    banner: any;
    price: string;
    beforePrice?: string;
    note?: string;
    category?: CategoryType;
    subCategories: string[];
    devices: string[];
    inputs?: { name: string; inputType: string; description?: string }[];
    props: {
      typeOfProps?: string;
      title: string;
      details: { title: string; price: number; quantity: number }[];
    };
  };
}

const EditProduct = ({ product }: ProductType) => {
  console.log(product);
  const [name, setName] = useState<string>(product.name);
  const [description, setDescription] = useState<string>(
    product.description || ""
  );
  const [loading, setLoading] = useState(false);

  const [banner, setBanner] = useState<string>(product.banner);
  const [price, setPrice] = useState<string>(product.price);
  const [quantity, setQuantity] = useState<number>(
    product && product.props && product.props.title !== ""
      ? ""
      : product?.quantity
  );
  const [beforePrice, setBeforePrice] = useState<string>(
    product.beforePrice || "0"
  );
  const [note, setNote] = useState<string>(product.note || "");
  const [category, setCategory] = useState<CategoryType>(
    product.category || { name: "", _id: "0" }
  );
  const newSubCategories = (product.subCategories || []).map(
    (subCategory: any) => {
      // التحقق من وجود الـ category داخل الـ subCategory
      if (subCategory.category && Array.isArray(subCategory.category)) {
        // إذا كانت الـ category مصفوفة، نأخذ أول عنصر فقط
        const category = subCategory.category[0];
        return {
          ...subCategory,
          category: category, // نجعل الـ category قيمة مفردة
        };
      }
      return subCategory; // في حال لم يوجد category أو كانت قيمة مفردة بالفعل
    }
  );
  const [subCategories, setSubCategories] = useState<string[]>(
    newSubCategories || []
  );
  const [devices, setDevices] = useState<string[]>(product.devices || []);
  const [croppedBanner, setCroppedBanner] = useState<string | null>(null);
  const cropperRef = useRef<any>(null);
  const inputsa: any = product.inputs
    ? product.inputs
    : [{ name: "", inputType: "text", description: "" }];

  const [inputs, setInputs] = useState<InputType[]>(inputsa);
  const [props, setProps] = useState<PropsType>({
    typeOfProps:
      product && product.props && product.props.typeOfProps
        ? product.props.typeOfProps
        : "",
    title:
      product && product.props && product.props.title
        ? product.props.title
        : "",
    details:
      product && product.props && product.props.details
        ? product.props.details
        : [{ title: "", price: 0, quantity: 0 }],
  });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const cropperImageRef = useRef<any>(null);
  const [image, setImage] = useState<string>(product.image);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const [SUBCATEGORIES, setSUBCATEGORIES] = useState<SubCategoryType[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !price) {
      setLoading(false);
      return toast.warn("Please fill required fields.");
    }
    if (!props && !quantity) {
      setLoading(false);

      return toast.warn("you should add props or quantity");
    }
    const filteredProps = props.details.filter(
      (prop) => prop.title && prop.price
    );
    const newProps = {
      typeOfProps: props.typeOfProps,
      title: props.title,
      details: filteredProps,
    };
    const PRODUCT = {
      name,
      description,
      price,
      quantity: quantity || 0,
      beforePrice,
      note,
      category: category?._id,
      subCategories: JSON.stringify(subCategories),
      devices: JSON.stringify(devices),
      inputs: JSON.stringify(inputs),
      props: JSON.stringify(newProps),
    };
    console.log(PRODUCT);

    const formData = new FormData();
    if (croppedBanner instanceof File) {
      formData.append("banner", croppedBanner);
    } else {
      formData.append("banner", banner);
    }
    if (croppedImage instanceof File) {
      formData.append("image", croppedImage);
    } else {
      formData.append("image", image);
    }
    Object.entries(PRODUCT).forEach(([key, value]) => {
      if (value) formData.append(key, value as string);
    });

    try {
      const response = await fetch(`${APIURL}/products/${product._id}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      if (
        data &&
        data.error ===
          "Product validation failed: quantity: Path `quantity` is required."
      ) {
      }
      if (response.ok) {
        console.log("Product updated successfully");
        // Reset form or redirect
        toast.success("Product updated successfully");
        router.refresh();
      } else {
        console.error("Failed to update product");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error("Error updating product:", error);
    }
  };

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
  };
  useEffect(() => {
    getCategories();
    getSubCategories();
  }, []);
  return (
    <div className="flex flex-col mx-auto gap-y-3 p-4 w-[100%] rounded-lg shadow-md">
      <ProductForm
        name={name}
        setName={setName}
        loading={loading}
        setLoading={setLoading}
        description={description}
        setDescription={setDescription}
        banner={banner}
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
        isEdit={true}
        setInputs={setInputs}
        props={props}
        setProps={setProps}
        image={image}
        setImage={setImage}
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

export default EditProduct;

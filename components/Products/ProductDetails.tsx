"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/utils/Loading";
import bannerImage from "@/public/indir.png";
import image from "@/public/image.png";
// استيراد المكونات بشكل ديناميكي
import Cookies from "js-cookie";
export type PRODUCTTYPE = {
  name: string;
  description: string;
  banner: any;
  image?: string | StaticImageData | null;
  price: string;
  quantity: number;
  beforePrice: string;
  note: string;
  category: {
    title: string;
    icon: string;
  };
  devices: string[];
  props?: {
    typeOfProps: string;
    title: string;
    details: {
      title: string;
      price: number;
      quantity: number;
    }[];
  };
  reviews: any;
  views: any;
  inputs?: {
    name: string;
    inputType: string;
    description: string;
  }[];
};
import SubTitle from "@/components/utils/SubTitle";

import { CiStar } from "react-icons/ci";
import { FaPlaystation, FaWindows, FaXbox } from "react-icons/fa6";
import { MdOutlineSmartphone } from "react-icons/md";
import { StaticImageData } from "next/image";
import IMAGEURL from "../IMAGEURL";
import APIURL from "../URL";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/userStore";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useChangeCartItemsCount } from "@/store/useChangeCartItemsCount";
function calculateDiscount(oldPrice: number, newPrice: number): string {
  const discount = ((oldPrice - newPrice) / oldPrice) * 100;
  return `${Math.round(discount)}%`;
}
const formatNumber = (number: number): string => {
  return new Intl.NumberFormat("en-US").format(number);
};

const ProductDetails = ({ product, productBanner }: any) => {
  const [count, setCount] = useState<number>(1);
  const [cartLoading, setCartLoading] = useState(false);
  const userId = useUserStore()?.user?._id || "";
  const [selectedProp, setSelectedProp] = useState<number | null>(null);
  const productImage = `${IMAGEURL}${product.image}`;

  const [currentPrice, setCurrentPrice] = useState<number>(
    Number(product.price) || 0
  );
  console.log(product);
  console.log(selectedProp);
  useEffect(() => {
    if (product.props && selectedProp !== null) {
      const selectedItem = product.props.details[selectedProp];
      setCurrentPrice(selectedItem.price * count);
    } else {
      setCurrentPrice(Number(product.price) * count);
    }
  }, [selectedProp, count, product.price, product.props]);
  const setCountBoolean = useChangeCartItemsCount().setBoolean;

  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  console.log(inputValues);
  const AddToCart = async () => {
    const token = Cookies.get("token");
    if (token && !userId) {
      return toast.error(
        "Please wait while we retrieve your user information. If it takes too long, check your internet connection or try logging in again."
      );
    }
    if (!token) {
      return toast.error("Please login for add to cart");
    }

    // تحقق من إدخال جميع القيم المطلوبة
    if (product.inputs && product.inputs.length > 0) {
      const missingInputs = product.inputs.filter(
        (input: any) => !inputValues[input.name]
      );
      if (missingInputs.length > 0) {
        return toast.error(
          `Please fill in all required fields: ${missingInputs
            .map((i: any) => i.name)
            .join(", ")}`
        );
      }
    }
    if (
      product.props &&
      product.props.title &&
      product.props.typeOfProps &&
      product.props.details &&
      product.props.details.length > 0 &&
      selectedProp == null
    ) {
      return toast.error("Select an item to add");
    }
    setCartLoading(true);
    try {
      const requestBody = {
        productId: product._id,
        title: product.name,
        image: product.image,
        user: userId,
        price:
          product.props && selectedProp !== null
            ? product.props.details[selectedProp].price
            : product.price,
        quantity: count,
        // إضافة Props إذا كانت موجودة
        ...(product.props &&
          selectedProp !== null && {
            props: {
              title: product.props.title,
              details: {
                title: product.props.details[selectedProp].title,
                price: product.props.details[selectedProp].price,
              },
            },
          }),
        // إضافة Inputs إذا كانت موجودة
        ...(product.inputs &&
          product.inputs.length > 0 && {
            inputs: product.inputs.map((input: any) => ({
              title: input.name,
              value: inputValues[input.name],
              inputType: input.inputType,
            })),
          }),
      };
      console.log(requestBody);
      const res = await fetch(`${APIURL}/cart/addToCart`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (res.status === 401) {
        setCartLoading(false);
        return toast.error("Please login for add to cart");
      }
      if (data && data.message == "Unauthorized, invalid token") {
        setCartLoading(false);
        return toast.error("Please login for add to cart");
      }
      console.log(data);
      if (res.ok) {
        toast.success("Added to cart successfully");
      } else {
        toast.error(data.message || "Error adding to cart");
      }
      setCountBoolean(Math.random());
      setCartLoading(false);
    } catch (error) {
      setCartLoading(false);
      console.error(error);
      toast.error("Error adding to cart");
    }
  };

  const renderStars = () => {
    const stars = [];
    const ratingNumber = parseFloat(product.rating);
    const fullStars = Math.floor(ratingNumber);
    const hasHalfStar = ratingNumber % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <div key={i}>
            <FaStar className="text-yellow-400 text-xl" />
          </div>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i}>
            <FaStarHalfAlt className="text-yellow-400 text-xl" />
          </div>
        );
      } else {
        stars.push(
          <div key={i}>
            <FaRegStar className="text-yellow-400 text-xl" />
          </div>
        );
      }
    }
    return stars;
  };
  console.log(product);
  console.log(`${IMAGEURL}${productBanner}`);
  return (
    <div className="w-full border border-white/15 mt-5 rounded-md mx-auto flex flex-col">
      <div className="max-h-[300px]">
        <img
          className="w-full h-max rounded-t-md object-cover"
          src={`${IMAGEURL}${product.banner}`}
          alt={product.name}
        />
      </div>
      <div className="flex max-md:flex-col max-md:justify-center max-md:gap-y-6 max-[450px]:px-3 py-5 px-12 mt-5">
        <div className="w-[30%] max-md:w-full">
          <img
            src={`${productImage}`}
            alt={product.name}
            key={productImage}
            className="w-full rounded-md h-max max-w-[90%] max-md:max-w-full"
          />
        </div>
        <div className="w-[70%] max-md:w-full flex flex-col gap-2">
          <h1 className="text-3xl font-medium text-title">{product.name}</h1>
          <div className="flex gap-2 ">
            <span className="flex gap-1 text-xl text-yellow-400 items-center">
              <span className="text-lg">{product.rating}</span>
              {renderStars()}
            </span>
            <span className="text-accent">
              ({product.reviews.length || 0} Reviews)
            </span>
          </div>
          <div className="flex gap-2 text-accent text-lg">
            {product.devices.map((device: string, index: number) => (
              <span key={index}>
                {device === "PHONE" && <MdOutlineSmartphone />}
                {device === "XBOX" && <FaXbox />}
                {device === "PLAYSTATION" && <FaPlaystation />}
                {device === "PC" && <FaWindows />}
              </span>
            ))}
          </div>
          {product.props &&
            product.props.details &&
            product.props.title &&
            product.props.typeOfProps && (
              <div className="flex flex-col gap-2 my-5">
                <span>{product.props.title}</span>
                <div className="flex w-full flex-wrap gap-3">
                  {product.props.typeOfProps === "cards" &&
                    product.props.details.map((item: any, index: number) => (
                      <button
                        key={item._id}
                        className={`border-2 px-4 rounded-md py-2 ${
                          item.quantity === 0
                            ? "border-red-500 bg-red-500/20 cursor-not-allowed"
                            : "border-accent/40 hover:border-primary"
                        } ${selectedProp === index ? "border-primary" : ""}`}
                        onClick={() => {
                          if (item.quantity > 0) {
                            setSelectedProp(index);
                            setCurrentPrice(item.price * count);
                          }
                        }}
                        disabled={item.quantity === 0}
                      >
                        {item.title} - ${item.price}
                      </button>
                    ))}
                  {product.props.typeOfProps === "select" && (
                    <select
                      className="w-full bg-[#101924] px-3 py-2 rounded-md border border-white/20 focus:border-primary focus:shadow-sm focus:shadow-primary transition-all outline-none"
                      onChange={(e) => {
                        const index = Number(e.target.value);
                        setSelectedProp(index);
                        setCurrentPrice(
                          product.props.details[index].price * count
                        );
                      }}
                    >
                      <option value="">Select an option</option>
                      {product.props.details.map((item: any, index: number) => (
                        <option
                          key={index}
                          value={index}
                          disabled={item.quantity === 0}
                        >
                          {item.title} - ${item.price}{" "}
                          {item.quantity === 0 ? "(Out of stock)" : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            )}
          {product.inputs &&
            product.inputs.map((input: any, index: number) => (
              <div key={index} className="flex flex-col gap-2 mt-3">
                <span>{input.name}</span>
                <input
                  type={input.inputType}
                  placeholder={`Enter your ${input.name.toLowerCase()}`}
                  className="w-[80%] bg-[#101924] px-3 py-2.5 text-[13px] rounded-md border border-white/20 focus:border-primary focus:shadow-sm focus:shadow-primary transition-all outline-none"
                  onChange={(e) => {
                    setInputValues((prev) => ({
                      ...prev,
                      [input.name]: e.target.value,
                    }));
                  }}
                  value={inputValues[input.name] || ""}
                />
                {input.description && (
                  <p className="text-sm text-accent mt-1">
                    {input.description}
                  </p>
                )}
              </div>
            ))}

          <hr className="w-[100%] mx-auto h-[1px] border-none bg-white/20 mb-3 mt-6" />
          {product.props ? (
            <span className="text-2xl">${currentPrice.toFixed(2)} USD</span>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                {product.beforePrice &&
                  Number(product.beforePrice) > Number(product.price) && (
                    <>
                      <span className="text-2xl text-accent line-through">
                        ${formatNumber(Number(product.beforePrice) * count)} USD
                      </span>
                      <span className="text-2xl font-bold">
                        ${formatNumber(currentPrice)} USD
                      </span>
                      <span className="bg-primary text-white px-2 py-1 rounded-md text-sm">
                        {calculateDiscount(
                          Number(product.beforePrice),
                          Number(product.price)
                        )}
                        % OFF
                      </span>
                    </>
                  )}

                {!product.beforePrice ||
                  (Number(product.beforePrice) <= Number(product.price) && (
                    <span className="text-2xl font-bold">
                      ${formatNumber(currentPrice)} USD
                    </span>
                  ))}
              </div>
            </div>
          )}
          <hr className="w-[100%] mx-auto h-[1px] border-none bg-white/20 mt-3 mb-5" />

          <div className="w-full flex-wrap gap-5 flex justify-between items-center mb-6">
            <div>
              <button
                onClick={() => setCount(count + 1)}
                className="border text-accent hover:bg-white/20 active:bg-secondary active:border-primary border-collapse border-white/15 rounded-l-md text-center px-4 py-[9px]"
              >
                +
              </button>
              <span className="bg-[#101924] px-7 py-2.5 border hover:border-primary border-collapse focus:shadow-md border-white/20 focus:shadow-primary transition-all outline-none">
                {count}
              </span>
              <button
                onClick={() => {
                  if (count > 1) {
                    setCount(count - 1);
                  }
                }}
                className="border text-accent border-collapse hover:bg-white/20 active:bg-secondary active:border-primary border-white/15 rounded-r-md text-center px-4 py-[9px]"
              >
                -
              </button>
            </div>
            <button
              onClick={() => {
                if (!cartLoading) {
                  AddToCart();
                }
              }}
              disabled={cartLoading}
              className="border border-white/50 rounded-md px-6 py-2 bg-primary text-white"
              style={{ boxShadow: "0 0 10px #4744e6" }}
            >
              {cartLoading ? (
                <div className="loader ease-linear rounded-full border-2 border-t-8 border-white h-5 w-5"></div>
              ) : (
                "Add To Cart"
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="w-full px-8 bg-[#101924] py-10 border border-collapse border-white/15 rounded-md">
        <div dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>
    </div>
  );
};

export default ProductDetails;

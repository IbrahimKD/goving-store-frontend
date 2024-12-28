"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { FaPlaystation, FaWindows, FaXbox } from "react-icons/fa6";
import { MdOutlineSmartphone } from "react-icons/md";
import { Card, CardContent } from "../ui/card";
import IMAGEURL from "../IMAGEURL";
import { useRouter } from "next/navigation";
import APIURL from "../URL";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/userStore";
import toast from "react-hot-toast";
import { useChangeCartItemsCount } from "@/store/useChangeCartItemsCount";

type Props = {
  _id: string;
  name: string;
  price: string;
  beforePrice?: string;
  discount?: number;
  note: string;
  devices?: string[];
  image: string;
  props: any;
};

// وظيفة للتحقق وإضافة .00 إذا لم تكن موجودة
const formatPrice = (price: string) => {
  return price.includes(".00") ? price : `${price}.00`;
};

const CardProduct = ({
  _id,
  image,
  name,
  price,
  beforePrice,
  discount,
  note,
  devices = [],
  props,
}: Props) => {
  const router = useRouter();
  const isLoaded = useRef(false);

  useEffect(() => {
    isLoaded.current = true;
  }, []);

  const formattedPrice = formatPrice(price);
  const formattedPriceBefore = beforePrice
    ? formatPrice(beforePrice)
    : undefined;

  const userId = useUserStore()?.user?._id;
  const [cartLoading, setCartLoading] = React.useState({
    status: false,
    _id: "",
  });
  const calculatedDiscount =
    formattedPriceBefore &&
    !isNaN(parseFloat(formattedPriceBefore)) &&
    !isNaN(parseFloat(formattedPrice)) &&
    parseFloat(formattedPriceBefore) > parseFloat(formattedPrice)
      ? Math.round(
          ((parseFloat(formattedPriceBefore) - parseFloat(formattedPrice)) /
            parseFloat(formattedPriceBefore)) *
            100
        )
      : undefined;
  const setCountBoolean = useChangeCartItemsCount().setBoolean;
  const countBoolean = useChangeCartItemsCount().countBoolean;
  console.log(countBoolean, "countBoleancardprodu");

  const AddToCart = async () => {
    if (!isLoaded.current) {
      return;
    }

    const token = Cookies.get("token");
    if (token && !userId) {
      return toast.error(
        "Please wait while we retrieve your user information. If it takes too long, check your internet connection or try logging in again."
      );
    }
    if (!token) {
      return toast.error("Please login for add to cart");
    }
    setCartLoading({ status: true, _id });
    try {
      const res = await fetch(`${APIURL}/cart/addToCart`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: _id,
          title: name,
          image,
          user: userId || "",
          price,
        }),
      });

      if (res.status === 401) {
        setCartLoading({ status: false, _id });
        return toast.error("Please login for add to cart");
      }

      const data = await res.json();
      if (data && data.message == "Unauthorized, invalid token") {
        setCartLoading({ status: false, _id });
        return toast.error("Please login for add to cart");
      }
      if (res.ok) {
        setCountBoolean(Math.random());
        toast.success("Added to cart successfully");
      } else {
        toast.error(data.message || "Error adding to cart");
      }
      setCartLoading({ status: false, _id });
      console.log(data);
    } catch (e) {
      setCartLoading({ status: false, _id });
      console.error(e);
    }
  };
  return (
    <Card className="p-0 m-0 relative hover:scale-105 transition-all bg-[#141c26] border-0 shadow-lg">
      <CardContent className="flex p-0 h-[275px] flex-col shadow-lg">
        <div className="relative">
          <img
            src={`${IMAGEURL}${image}`}
            className="rounded-t-xl object-cover w-full h-[120px]"
            alt={name}
          />

          {note && (
            <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white rounded-md px-2 py-0.5 text-xs">
              {note}
            </span>
          )}
        </div>
        <div className="px-2 py-3 flex flex-col flex-grow">
          <div className="flex flex-col gap-1">
            <Link
              href={`/item/${_id}`}
              className="text-sm overflow-hidden text-ellipsis whitespace-nowrap hover:text-primary transition-all"
            >
              {name}
            </Link>
            {!props ||
              (props.typeOfProps === "" && (
                <div>
                  <span className="gap-2 flex items-center">
                    <span>USD {formattedPrice}</span>
                    {beforePrice && (
                      <>
                        <span className="text-accent text-sm line-through">
                          USD {formattedPriceBefore}
                        </span>{" "}
                        <span className=" bg-red-800 text-white rounded-md px-2 py-0.5 text-sm">
                          -{calculatedDiscount}%
                        </span>
                      </>
                    )}
                  </span>
                </div>
              ))}
          </div>
          <div className="flex basis-full justify-between items-end">
            <button
              onClick={() => {
                (cartLoading?.status === false && !props) ||
                props.typeOfProps === ""
                  ? AddToCart()
                  : router.push(`/item/${_id}`);
              }}
              className="text-white bg-secondary px-5 py-2 shadow-lg hover:shadow-primary hover:shadow-md text-2xl rounded-md flex justify-center items-center transition-all hover:bg-primary"
            >
              {cartLoading?.status === true && cartLoading?._id === _id ? (
                <div className="loader ease-linear rounded-full border-2 border-t-8 border-white h-5 w-5"></div>
              ) : (
                <CiShoppingCart />
              )}{" "}
            </button>
            <div className="flex gap-1">
              {devices.includes("PC") && <FaWindows />}
              {devices.includes("PHONE") && <MdOutlineSmartphone />}
              {devices.includes("PLAYSTATION") && <FaPlaystation />}
              {devices.includes("XBOX") && <FaXbox />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardProduct;

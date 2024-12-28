"use client";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { CiShoppingCart } from "react-icons/ci";
import { FaWindows, FaPlaystation, FaXbox } from "react-icons/fa";
import { MdOutlineSmartphone } from "react-icons/md";
import APIURL from "../URL";
import IMAGEURL from "@/components/IMAGEURL";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/userStore";
import { useChangeCartItemsCount } from "@/store/useChangeCartItemsCount";
import { useRouter } from "next/navigation";
// دالة لتنسيق السعر
const formatPrice = (price: string | number | undefined): string => {
  if (price === undefined || price === null) return "0.00";
  const priceString = price.toString();
  return priceString.includes(".00") ? priceString : `${priceString}.00`;
};

const ProductsHome = ({ categoryId }: { categoryId: string }) => {
  const hasFetched = React.useRef(false);
  const [products, setProducts] = React.useState([]);
  const [cartLoading, setCartLoading] = React.useState({
    status: false,
    _id: "",
  });
  const getProductsByCategory = async () => {
    try {
      const res = await fetch(`${APIURL}/products/categoryHome/${categoryId}`);
      const data = await res.json();
      if (data && data.products) {
        setProducts(data.products);
      }
      hasFetched.current = true;
      console.log(data);
    } catch (e) {
      console.error("Error fetching products:", e);
    }
  };
  const router = useRouter();

  React.useEffect(() => {
    if (!hasFetched.current) {
      getProductsByCategory();
    }
  }, []);
  const setCountBoolean = useChangeCartItemsCount().setBoolean;
  const userId = useUserStore()?.user?._id || "";
  const AddToCart = async ({ _id, name, image, price }: any) => {
    if (!hasFetched) {
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
        toast.success("Added to cart successfully");
      } else {
        toast.error(data.message || "Error adding to cart");
      }
      setCartLoading({ status: false, _id });
      console.log(data);
      setCountBoolean(Math.random());
    } catch (e) {
      setCartLoading({ status: false, _id });
      console.error(e);
    }
  };
  return (
    <Carousel className="w-full max-h-[320px]">
      <CarouselContent className="-ml-1 ">
        {products &&
          products.length > 0 &&
          products.map((product: any) => {
            const formattedPrice = formatPrice(product.price);
            const formattedPriceBefore = product.beforePrice
              ? formatPrice(product.beforePrice)
              : undefined;

            const calculatedDiscount = formattedPriceBefore
              ? Math.round(
                  ((parseFloat(formattedPriceBefore) -
                    parseFloat(formattedPrice)) /
                    parseFloat(formattedPriceBefore)) *
                    100
                )
              : undefined;

            return (
              <CarouselItem
                key={product._id}
                className="p-0 w-full  transition-all pl-4 min-[550px]:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <div className="p-0">
                  <Card className="p-0 m-0 hover:scale-[0.99] bg-[#141c26] hover:border hover:border-primary border border-white/15 transition-all shadow-lg group">
                    <CardContent className="flex p-0 h-[265px] flex-col shadow-lg">
                      <div className="relative w-full h-[130px]">
                        <img
                          src={`${IMAGEURL}${product.image}`}
                          className="rounded-t-xl object-cover w-full h-full"
                          alt={product.name}
                        />
                        {product.note && (
                          <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white rounded-md px-2 py-0.5 text-xs">
                            {product.note}
                          </span>
                        )}
                      </div>
                      <div className="px-2 py-3 flex flex-col flex-grow">
                        <div className="flex flex-col gap-1">
                          <Link
                            href={`/item/${product._id}`}
                            className={`text-sm font-medium
 ${
   !product.props ||
   (product.props.typeOfProps === "" &&
     `overflow-hidden text-ellipsis whitespace-nowrap`)
 } 
                                hover:text-primary transition-all`}
                          >
                            {product.name}
                          </Link>
                          {!product.props ||
                            (product.props.typeOfProps === "" && (
                              <div className="flex items-center mt-1 gap-2">
                                <span className="font-semibold">
                                  USD {formattedPrice}
                                </span>
                                {formattedPriceBefore && (
                                  <span className="text-accent text-sm line-through">
                                    USD {formattedPriceBefore}
                                  </span>
                                )}
                                {calculatedDiscount &&
                                  calculatedDiscount > 0 && (
                                    <span className=" bg-red-800 text-white rounded-md px-2 py-0.5 text-sm">
                                      -{calculatedDiscount}%
                                    </span>
                                  )}
                              </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-end mt-auto pt-3">
                          <button
                            onClick={() => {
                              if (cartLoading.status === true) {
                                return;
                              }
                              (cartLoading?.status === false &&
                                !product.props) ||
                              product.props.typeOfProps === ""
                                ? AddToCart({
                                    _id: product._id,
                                    name: product.name,
                                    image: product.image,
                                    price: product.price,
                                  })
                                : router.push(`/item/${product._id}`);
                            }}
                            className="text-white bg-secondary px-5 py-1.5 shadow-lg hover:shadow-primary hover:shadow-md text-xl rounded-md flex justify-center items-center transition-all hover:bg-primary"
                          >
                            {cartLoading?.status === true &&
                            cartLoading?._id === product._id ? (
                              <div className="loader ease-linear rounded-full border-2 border-t-8 border-white h-5 w-5"></div>
                            ) : (
                              <CiShoppingCart />
                            )}
                          </button>
                          <div className="flex gap-1.5 text-gray-300">
                            {product.devices.includes("PC") && (
                              <FaWindows
                                className="transition-transform group-hover:scale-110"
                                title="Windows"
                              />
                            )}
                            {product.devices.includes("PHONE") && (
                              <MdOutlineSmartphone
                                className="transition-transform group-hover:scale-110"
                                title="Mobile"
                              />
                            )}
                            {product.devices.includes("PLAYSTATION") && (
                              <FaPlaystation
                                className="transition-transform group-hover:scale-110"
                                title="PlayStation"
                              />
                            )}
                            {product.devices.includes("XBOX") && (
                              <FaXbox
                                className="transition-transform group-hover:scale-110"
                                title="Xbox"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
      </CarouselContent>
    </Carousel>
  );
};

export default ProductsHome;

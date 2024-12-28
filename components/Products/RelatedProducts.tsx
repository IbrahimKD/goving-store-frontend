"use client";
import React, { useEffect, useState } from "react";
import SubTitle from "../utils/SubTitle";
import APIURL from "../URL";
import ProductsHome from "./ProductsHome";
import Link from "next/link";
import IMAGEURL from "../IMAGEURL";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { CiShoppingCart } from "react-icons/ci";
import { FaPlaystation, FaWindows, FaXbox } from "react-icons/fa";
import { MdOutlineSmartphone } from "react-icons/md";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/userStore";
import { useChangeCartItemsCount } from "@/store/useChangeCartItemsCount";
type Props = {
  productId: string;
};
const formatPrice = (price: string | number | undefined): string => {
  if (price === undefined || price === null) return "0.00";
  const priceString = price.toString();
  return priceString.includes(".00") ? priceString : `${priceString}.00`;
};
const RelatedProducts = ({ productId }: Props) => {
  const userId = useUserStore()?.user?._id || "";
  const [cartLoading, setCartLoading] = useState({
    status: false,
    productId: "",
  });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const setCountBoolean = useChangeCartItemsCount().setBoolean;

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(
          `${APIURL}/products/relatedProducts/${productId}`
        );
        const data = await response.json();
        setRelatedProducts(data.relatedProducts);
        console.log(data);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };
    fetchRelatedProducts();
  }, [productId]);
  const AddToCart = async ({ productId, title, image, price }: any) => {
    const token = Cookies.get("token");
    if (token && !userId) {
      return toast.error(
        "Please wait while we retrieve your user information. If it takes too long, check your internet connection or try logging in again."
      );
    }
    if (!token) {
      return toast.error("Please login for add to cart");
    }
    setCartLoading({ status: true, productId });
    try {
      const res = await fetch(`${APIURL}/cart/addToCart`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          title,
          image,
          user: userId || "",
          price,
        }),
      });

      if (res.status === 401) {
        setCartLoading({ status: false, productId });
        return toast.error("Please login for add to cart");
      }

      const data = await res.json();
      if (data && data.message == "Unauthorized, invalid token") {
        setCartLoading({ status: false, productId });
        return toast.error("Please login for add to cart");
      }
      if (res.ok) {
        toast.success("Added to cart successfully");
      } else {
        toast.error(data.message || "Error adding to cart");
      }
      setCartLoading({ status: false, productId });
      console.log(data);
    } catch (e) {
      setCartLoading({ status: false, productId });
      console.error(e);
    } finally {
      setCountBoolean(Math.random());
    }
  };
  const router = useRouter();
  console.log(relatedProducts, "relatedProducts");
  if (!relatedProducts) {
    return;
  }
  return (
    <div className="mt-8 flex flex-col gap-y-5 ">
      {relatedProducts && relatedProducts.length > 0 && (
        <>
          {" "}
          <SubTitle title="Related Products" others={"text-xl font-semibold"} />
          <Carousel className="w-full max-h-[340px]">
            <CarouselContent className="-ml-1 ">
              {relatedProducts &&
                relatedProducts.length > 0 &&
                relatedProducts.map((product: any) => {
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
     `overflow-hiddentext-ellipsis whitespace-nowrap`)
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
                                  disabled={cartLoading?.status}
                                  onClick={() => {
                                    (cartLoading?.status === false &&
                                      !product.props) ||
                                    product.props.typeOfProps === ""
                                      ? AddToCart({
                                          productId: product._id,
                                          image: product.image,
                                          title: product.name,
                                          price: product.price,
                                        })
                                      : router.push(`/item/${product._id}`);
                                  }}
                                  className="text-white bg-secondary px-5 py-2 shadow-lg hover:shadow-primary hover:shadow-md text-2xl rounded-md flex justify-center items-center transition-all hover:bg-primary"
                                >
                                  {cartLoading?.status === true &&
                                  cartLoading?.productId === product._id ? (
                                    <div className="loader ease-linear rounded-full border-2 border-t-8 border-white h-5 w-5"></div>
                                  ) : (
                                    <CiShoppingCart />
                                  )}{" "}
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
          </Carousel>{" "}
        </>
      )}
    </div>
  );
};

export default RelatedProducts;

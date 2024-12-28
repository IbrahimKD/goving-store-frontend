"use client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FaPlaystation, FaWindows, FaXbox } from "react-icons/fa6";
import { MdOutlineSmartphone } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import { FaEdit } from "react-icons/fa";
import APIURL from "@/components/URL";
import IMAGEURL from "@/components/IMAGEURL";
import { useRouter } from "next/navigation";

type Props = {
  id?: string;
  title?: string;
  price?: string;
  priceBefore?: string;
  discount?: number;
  category?: { name: string; _id: string };
  devices?: string[];
  image?: string;
  onDelete?: (id: string) => void;
  noDelete?: boolean;
};

// دالة لتنسيق السعر
const formatPrice = (price: string | number | undefined): string => {
  if (price === undefined || price === null) return "0.00"; // إذا كان السعر غير موجود
  const priceString = price.toString(); // تحويل السعر إلى سلسلة نصية
  return priceString.includes(".00") ? priceString : `${priceString}.00`;
};

const CardProductAdmin: React.FC<Props> = ({
  id = "",
  title = "Untitled Product",
  price = "0",
  priceBefore,
  discount,
  category = { name: "Uncategorized", _id: "" },
  devices = [],
  image = "/placeholder-image.jpg",
  onDelete,
  noDelete,
}) => {
  // تنسيق الأسعار
  const formattedPrice = price ? formatPrice(price) : "0.00";
  const formattedPriceBefore = priceBefore
    ? formatPrice(priceBefore)
    : undefined;

  // حساب الخصم تلقائياً إذا كان هناك سعر سابق
  const calculatedDiscount =
    formattedPriceBefore && formattedPriceBefore !== "0.00"
      ? Math.round(
          ((parseFloat(formattedPriceBefore) - parseFloat(formattedPrice)) /
            parseFloat(formattedPriceBefore)) *
            100
        )
      : null;

  // التعامل مع أحداث الأزرار
  const router = useRouter();
  const handleEdit = () => {
    router.push(`/admin/products/edit-product/${id}`);
  };

  const handleDelete = () => {
    if (onDelete && id) {
      onDelete(id);
    }
  };

  return (
    <Card className="group p-0 m-0 transition-all duration-300 hover:scale-[1.02] bg-[#141c26] border-0 shadow-lg">
      <CardContent className="flex p-0 h-[275px] flex-col shadow-lg">
        <div className="relative w-full h-[120px]">
          <div className="relative w-full h-full">
            <img
              src={`${IMAGEURL}${image}`}
              className="rounded-t-xl object-cover w-full h-full"
              alt={title}
            />
          </div>
          {calculatedDiscount && calculatedDiscount > 0 && (
            <span className="absolute top-2 right-2 bg-red-800 text-white rounded-md px-2 py-0.5 text-sm">
              -{calculatedDiscount}%
            </span>
          )}
        </div>

        <div className="px-3 py-3 flex flex-col flex-grow">
          <div className="flex flex-col gap-1.5">
            <Link
              href={`/item/${id}`}
              className="text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap hover:text-primary transition-colors duration-200"
            >
              {title}
            </Link>

            <div className="flex items-center gap-2">
              {formattedPrice && formattedPrice !== "0.00" && (
                <span className="font-semibold">USD {formattedPrice}</span>
              )}
              {formattedPriceBefore && formattedPriceBefore !== "0.00" && (
                <span className="text-accent text-sm line-through">
                  USD {formattedPriceBefore}
                </span>
              )}
            </div>

            <div className="text-sm text-gray-300">
              Category: {category.name}
            </div>
          </div>

          <div className="flex justify-between items-end mt-auto pt-3">
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="text-white bg-secondary hover:bg-primary px-3 py-2 rounded-md 
                         shadow-lg hover:shadow-primary/25 transition-all duration-200
                         flex items-center justify-center text-sm"
                aria-label="Edit product"
              >
                <FaEdit />
              </button>
              {noDelete === true ? null : (
                <button
                  onClick={handleDelete}
                  className="text-white bg-secondary hover:bg-red-500 px-3 py-2 rounded-md
                         shadow-lg hover:shadow-red-500/25 transition-all duration-200
                         flex items-center justify-center text-sm"
                  aria-label="Delete product"
                >
                  <GoTrash />
                </button>
              )}
            </div>

            <div className="flex gap-1.5 text-gray-300">
              {devices.includes("PC") && (
                <FaWindows
                  className="transition-transform group-hover:scale-110"
                  title="Windows"
                />
              )}
              {devices.includes("PHONE") && (
                <MdOutlineSmartphone
                  className="transition-transform group-hover:scale-110"
                  title="Mobile"
                />
              )}
              {devices.includes("PLAYSTATION") && (
                <FaPlaystation
                  className="transition-transform group-hover:scale-110"
                  title="PlayStation"
                />
              )}
              {devices.includes("XBOX") && (
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
  );
};

export default CardProductAdmin;

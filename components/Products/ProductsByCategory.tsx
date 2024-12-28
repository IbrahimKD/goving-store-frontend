"use client";
import React, { useEffect, useState } from "react";
import CardProduct from "./CardProduct";
import TitleCats from "../utils/TitleCats";
import APIURL from "../URL";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  price: number;
  beforePrice?: number;
  discount?: number;
  devices?: string[];
  image: string;
};

const ProductsByCategory = ({ id }: { id: string }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<any>({});

  const searchParams = useSearchParams(); // الحصول على searchParams

  const subCategory = searchParams.get("subCategory"); // استخراج قيمة subCategory
    console.log(subCategory,'subcategory')
  const getProducts = async (page = 1) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", "8");

      if (subCategory) {
        queryParams.append("subCategory", subCategory); // إضافة subCategory إذا كان موجودًا
      }
      console.log(queryParams.toString())
      const res = await fetch(
        `${APIURL}/products/category/${id}?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await res.json();
      console.log(data)
      setProducts(data.products);
      setCategory(data.category);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts(); // استدعاء المنتجات عند تغيير المعاملات
  }, [id, subCategory]); // إضافة subCategory في الـ dependency array

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      getProducts(page);
    }
  };

  return (
    <>
      <TitleCats title={category.name} description={category.description} />
      <div className="max-w-[1200px] items-center mx-auto w-full px-5 relative max-[380px]:px-1 grid grid-cols-[repeat(auto-fill,minmax(225px,1fr))] gap-5 mt-10">
        {isLoading ? (
          <div className="w-full mx-auto pt-32 flex justify-center items-center text-center my-6">
            <div className="loader ease-linear rounded-full border-2 border-t-8 border-primary h-16 absolute left-[50%] top-[20%] w-16 my-6"></div>
          </div>
        ) : products && products.length > 0 ? (
          products.map((product: any) => (
            <CardProduct key={product._id} {...product} />
          ))
        ) : (
          <span>No Products Found</span>
        )}
      </div>
      {products && products.length > 7 && (
        <div className="flex justify-center items-center gap-4 mt-5">
          <button
            className={`px-4 py-2 bg-primary text-white rounded ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`px-4 py-2 bg-primary text-white rounded ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default ProductsByCategory;

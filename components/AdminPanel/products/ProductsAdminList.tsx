"use client";
import React, { useState, useEffect } from "react";
import CardProductAdmin from "./CardProductAdmin";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import APIURL from "@/components/URL";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type CardProduct = {
  _id: string;
  name: string;
  price: string;
  image: string;
  category?: { name: string; _id: string };
  beforePrice: string;
  devices: string[];
};

const ITEMS_PER_PAGE = 6; // ثابت لعدد العناصر في كل صفحة

const ProductsAdminList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<CardProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  const getProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== "all" && { filter: selectedCategory }),
      });

      const res = await fetch(`${APIURL}/products?${queryParams}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const data = await res.json();
      console.log(data)
      if (data.status === 200) {
        setProducts(data.products);
        setTotalCount(data.totalCount);
      } else {
        console.error("Error fetching products:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${APIURL}/products/categoriesForProducts`, {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = await res.json();
      if (data && data.status === 200) {
        setCategories([{ _id: "all", name: "All" }, ...data.categories]);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // إنشاء مصفوفة من أرقام الصفحات للعرض
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // عدد الصفحات المرئية في شريط التنقل

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };
  const router = useRouter()
  const onDelete = (id:string)=>{
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      fetch(`${APIURL}/products/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            getProducts();
            router.refresh()
            toast.success("Product deleted successfully");
          }
        })
        .catch((error) => {
          console.error("Failed to delete product:", error);
        });
    }
  }
  return (
    <div className="space-y-4">
      <div className="flex space-x-4" dir="ltr">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-grow"
        />
        <Select
          dir="ltr"
          value={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger
            className="w-[280px] text-left
           bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
            {categories.map((category) => (
              <SelectItem
                key={category._id}
                value={category._id}
                className="hover:bg-primary/10 cursor-pointer p-2 text-gray-700"
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <span className="my-3 flex justify-center items-center px-4 py-24 border border-primary rounded-md text-center w-full text-2xl text-white font-semibold">
          <div className="loader ease-linear rounded-full border-2 border-t-8 border-primary h-12 w-12"></div>
        </span>
      ) : (
        <>
          <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {products.map((product: CardProduct) => (
              <CardProductAdmin
                key={product._id}
                id={product._id}
                title={product.name}
                price={product.price}
                priceBefore={product.beforePrice}
                category={product.category}
                devices={product.devices}
                image={product.image}
                onDelete={onDelete}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1 || loading}
                className="px-3"
              >
                First
              </Button>

              <Button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1 || loading}
                className="px-3"
              >
                Previous
              </Button>

              {getPageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 ${
                    pageNum === currentPage
                      ? "bg-primary text-white"
                      : "bg-secondary"
                  }`}
                  disabled={loading}
                >
                  {pageNum}
                </Button>
              ))}

              <Button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-3"
              >
                Next
              </Button>

              <Button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || loading}
                className="px-3"
              >
                Last
              </Button>
            </div>
          )}

          <div className="text-center mt-2">
            <span className="text-sm">
              Page {currentPage} of {totalPages} | Total Items: {totalCount}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsAdminList;

"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import IMAGEURL from "../IMAGEURL";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import APIURL from "../URL";
import { useRouter } from "next/navigation";

library.add(fas);
type Category = {
  _id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  subCategories: any;
};

const AllCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${APIURL}/allCategoriesPage?page=${currentPage}&limit=4`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        console.log(data);
        setCategories(data.categories);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage]); // فقط currentPage في مصفوفة التبعيات

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage); // سيؤدي هذا إلى تشغيل useEffect تلقائياً
    }
  };

  return (
    <div className="max-w-[1200px] items-center mx-auto w-full px-5 relative max-[380px]:px-1">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(225px,1fr))] gap-5 mt-10">
        {isLoading ? (
          <div className="w-full mx-auto pt-32 flex justify-center items-center text-center my-6">
            <div className="loader ease-linear rounded-full border-2 border-t-8 border-primary h-16 absolute left-[50%] top-[20%] w-16 my-6"></div>
          </div>
        ) : categories && categories.length > 0 ? (
          categories.map((category) => (
            <div
            onClick={()=>router.push(`/category/${category._id}`)}
              key={category._id}
              className="flex max-h-max bg-[#141c26] max-w-max border border-primary/50 rounded-md px-3 py-4 flex-col gap-3"
            >
              <Image
                src={`${IMAGEURL}${category.image}`}
                alt={category.name}
                width={250}
                height={100}
                className="rounded-xl"
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span>
                    <FontAwesomeIcon icon={category.icon as any} />
                  </span>
                  <h2>{category.name}</h2>
                </div>
                <span className="text-accent text-sm">
                  {category.description}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {category.subCategories &&
                  category.subCategories.length > 0 &&
                  category.subCategories.map((subCategory: any) => (
                    <Link
                      key={subCategory._id}
                      className="px-2 py-1 rounded-md border border-primary bg-secondary"
                      href={`/category/${category._id}?subCategory=${subCategory._id}`}
                    >
                      {subCategory.name}
                    </Link>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center">
            <span>No categories found</span>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center gap-4 mt-5">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-primary text-white rounded ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-primary text-white rounded ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllCategories;

"use client";
import React, { useState, useEffect } from "react";
import * as Icons from "react-icons/fa";
import { IconType } from "react-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import APIURL from "@/components/URL";
import Cookies from "js-cookie";
import { useDebounce } from "@/hooks/use-debounce";
import toast from "react-hot-toast";
import IMAGEURL from "@/components/IMAGEURL";

library.add(fas);

interface Category {
  _id: string;
  name: string;
  icon: string;
  description: string;
  image: string;
}

interface CategoryResponse {
  totalCategories: number;
  totalPages: number;
  currentPage: number;
  categories: Category[];
}

const AllCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchCategories = async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "8",
        ...(search && { search }),
      });

      const response = await fetch(
        `${APIURL}/categories?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data: CategoryResponse = await response.json();

      setCategories(data.categories);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };
   useEffect(() => {
    fetchCategories(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  const DynamicIcon = ({ name }: { name: string }) => {
    const IconComponent = Icons[name as keyof typeof Icons] as IconType;
    return IconComponent ? <IconComponent /> : null;
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${APIURL}/categories/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = await response.json();

      if (data && data.message === "Category not found") {
        setDeleteId(null);

        return toast.error("Category not found");
      }
      if (data && data.message === "Category deleted successfully") {
        // إعادة تحميل التصنيفات بعد الحذف
        fetchCategories(currentPage, debouncedSearch);
        setDeleteId(null);
        return toast.success("Category deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink
            className="bg-black"
            onClick={() => setCurrentPage(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Numbered pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-title">All Categories</h1>
        <Link href="/admin/categories/add-category">
          <Button>Add New Category</Button>
        </Link>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {categories.map((category) => {
 
              return (
                <div
                  key={category._id}
                  className="bg-secondary border border-none shadow-primary rounded-lg shadow-sm p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center mb-2 gap-3">
                      <img
                        src={`${
                          category.image
                            ? `${IMAGEURL}${category.image}`
                            : `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc4ydgp0nVX122uVDmQw26huqCUk1NChzWcg&s`
                        }`} // مسار الصورة
                        alt={category.name} // نص بديل للصورة
                        onError={(e) => {
                          e.target.onerror = null; // منع التكرار
                          e.target.src =
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc4ydgp0nVX122uVDmQw26huqCUk1NChzWcg&s";
                        }}
                        className="w-12 h-12 rounded-full object-contain mr-2" // تنسيق الصورة
                      />

                      <FontAwesomeIcon icon={category.icon as any} />
                      <h2 className="text-xl font-semibold">{category.name}</h2>
                    </div>
                    <p className="text-gray-400 line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex justify-end mt-4 space-x-2">
                    <Link
                      href={`/admin/categories/edit-category/${category._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <DynamicIcon name="FaEdit" />
                    </Link>
                    <button
                      onClick={() => setDeleteId(category._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <DynamicIcon name="FaTrash" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {generatePaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-[525px] bg-secondary border border-primary text-white rounded-lg p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-200">
              Confirm deletion
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-300">
              Are you sure you want to delete this category? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => deleteId && handleDelete(deleteId)}
              variant="destructive"
            >
              Yes, delete
            </Button>
            <Button
              onClick={() => setDeleteId(null)}
              variant="outline"
              className="border-gray-300 text-gray-400 hover:text-black hover:bg-gray-100"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllCategories;

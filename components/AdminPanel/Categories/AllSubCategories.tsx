"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLaptop,
  faTshirt,
  faHome,
  faBook,
  faFutbol,
  faMobileAlt,
  faCamera,
  faCouch,
  faLeaf,
  faBookOpen,
  faRunning,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import APIURL from "@/components/URL";
import CategorySelector from "./CategorySelector";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
library.add(fas);
interface SubCategory {
  title: string;
  count: number;
  icon: any;
}

interface Category {
  title: string;
  icon: any;
  description: string;
  count: number;
  id: number;
  subcategories: SubCategory[];
}

const CATEGORIES: Category[] = [
  {
    title: "Electronics",
    icon: faLaptop,
    description: "Electronic devices and accessories",
    count: 1250,
    subcategories: [
      { title: "Mobile Phones", count: 500, icon: faMobileAlt },
      { title: "Laptops", count: 300, icon: faLaptop },
      { title: "Cameras", count: 450, icon: faCamera },
    ],
    id: 1,
  },
  {
    title: "Clothing",
    icon: faTshirt,
    description: "Fashion and apparel",
    count: 980,
    subcategories: [
      { title: "Men's Clothing", count: 500, icon: faTshirt },
      { title: "Women's Clothing", count: 480, icon: faTshirt },
    ],
    id: 2,
  },
  {
    title: "Home & Garden",
    icon: faHome,
    description: "Home decor and gardening supplies",
    count: 750,
    subcategories: [
      { title: "Furniture", count: 400, icon: faCouch },
      { title: "Garden Supplies", count: 350, icon: faLeaf },
    ],
    id: 3,
  },
  {
    title: "Books",
    icon: faBook,
    description: "Books and literature",
    count: 2100,
    subcategories: [
      { title: "Fiction", count: 1200, icon: faBookOpen },
      { title: "Non-Fiction", count: 900, icon: faBookOpen },
    ],
    id: 4,
  },
  {
    title: "Sports",
    icon: faFutbol,
    description: "Sports equipment and accessories",
    count: 560,
    subcategories: [
      { title: "Outdoor Sports", count: 300, icon: faRunning },
      { title: "Indoor Sports", count: 260, icon: faFutbol },
    ],
    id: 5,
  },
];

const AllSubCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchScope, setSearchScope] = useState({ name: "all", _id: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQueryCat, setSearchQueryCat] = useState("");
  const [loadingCat, setLoadingCat] = useState(false);
  const ITEMS_PER_PAGE = 6;
  const [loading, setLoading] = useState(true);
  // خيارات Dropdown باستخدام useMemo لتوفير أداء أفضل
  const [deleteLoading,setDeleteLoading] = useState(false)
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCat(true);
        const queryParams = new URLSearchParams({
          limit: ITEMS_PER_PAGE.toString(),
          search: searchQueryCat,
        });
        const res = await fetch(
          `${APIURL}/categories/forFilter?${queryParams}`,
          {
            method: "GET",
            headers: { authorization: `Bearer ${Cookies.get("token")}` },
          }
        );
        const data = await res.json();
        if (data && data.categories) {
          setCategories(data.categories);
        } else {
          setCategories([]);
        }
        setLoadingCat(false);
      } catch (e) {
        setLoadingCat(false);
return e;       }
    };
    fetchCategories();
  }, [searchQueryCat]);
      const fetchSubCategories = async () => {
       setLoading(true);
       try {
         const queryParams = new URLSearchParams({
           page: currentPage.toString(),
           limit: ITEMS_PER_PAGE.toString(),
           search: searchTerm,
         });

         // إذا كانت هناك معرّفات في searchScope، قم بإضافتها كمعلمات منفصلة
         if (Array.isArray(searchScope) && searchScope.length > 0) {
           searchScope.forEach((id) => {
             queryParams.append("filter", id._id); // استخدم append لإضافة كل ID
           });
         } else {
           // إذا كان searchScope ليس مصفوفة أو فارغ، قم بإضافته كقيمة واحدة
           queryParams.append("filter", searchScope._id);
         }
         console.log(queryParams.toString())
         const res = await fetch(`${APIURL}/subCategories?${queryParams}`, {
           method: "GET",
           headers: { authorization: `Bearer ${Cookies.get("token")}` },
         });
         const data = await res.json();
         setSubCategories(data.subCategories);
         setLoading(false);
       } catch (e) {
          setLoading(false);return e; 
       }
     };
  useEffect(() => {
    fetchSubCategories();
  }, [currentPage, searchTerm, searchScope]);
  const [open, setOpen] = useState(false);
  const deleteSubCategory = async () => {
    setDeleteLoading(true)
   
    if (!deleteId) return;
    try {
      const res = await fetch(`${APIURL}/subCategories/${deleteId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      setDeleteId(null);
      setOpen(false)
      if (!res.ok) {
        const errorData = await res.json();
        return toast.error(
          errorData.message || "An error occurred. Please try again later"
        );
      }
      toast.success("SubCategory deleted successfully");
      setSubCategories((prev) =>
        prev.filter((sub: any) => sub._id !== deleteId)
    );
    fetchSubCategories();
    setDeleteLoading(false);
    
  } catch (e) {
      setOpen(false)
      setDeleteLoading(false);
       return toast.error("A problem occurred, please try again later");
    }
  };
   return (
    <div className="mt-8 w-full z-10">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search subcategories"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <CategorySelector
          categories={categories}
          value={searchScope}
          loadingCat={loadingCat}
          searchQueryCat={searchQueryCat}
          setSearchQueryCat={setSearchQueryCat}
          onChange={(value) => {
            setSearchScope(value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="border rounded-md">
        {loading ? (
          <div className="my-8 mx-auto flex justify-center items-center flex-col gap-2">
            <div className="loader ease-linear rounded-full border-2 border-t-8 border-primary h-10 w-10 mx-auto"></div>
            <span>Loading...</span>
          </div>
        ) : subCategories && subCategories.length > 0 ? ( // Check if subCategories exists and has items
          subCategories.map((subCategory: any, index) => {
             return <div
              key={index}
              className="flex items-center justify-between py-4 px-8 border-b last:border-b-0"
            >
              <div>
                {subCategory.icon && (

                  <FontAwesomeIcon
                  icon={subCategory.icon}
                  className="mr-2"
                  size="lg"
                  />
                )}
                {subCategory.name} ({subCategory.productCount}) -{" "}
                <strong>{subCategory.category?.name}</strong>
              </div>
              <div>
                <Link
                  href={`/admin/categories/edit-sub-category/${subCategory.id}`}
                  className="bg-primary rounded-md text-white px-5 py-2 hover:bg-primary/80 mr-2"
                >
                  Edit
                </Link>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => {
                        setDeleteId(subCategory.id);
                       }}
                      className="rounded-md text-red-500 hover:text-white transition-all px-3 py-1 hover:bg-red-600"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-secondary">
                    <DialogHeader>
                      <DialogTitle>Confirm Delete</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this subcategory?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="secondary"
                        className="shadow-sm shadow-primary"
                        onClick={() => {
                          setDeleteId(null);
                          setOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={deleteLoading}
                        variant="destructive"
                        className="hover:opacity-90 bg-red-500"
                        onClick={() => deleteSubCategory()}
                      >
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
})
        ) : (
          <div className="py-4 px-8 text-center text-gray-500">
            No subcategories found
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSubCategories;

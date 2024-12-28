"use client";
import Link from "next/link";
import { useRouter } from "next/navigation"; // استيراد useRouter
import React, { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { IoDocumentsOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { FaBoxes } from "react-icons/fa";
import { RiCoupon3Fill } from "react-icons/ri";
import { CiHome } from "react-icons/ci";
import { useUserStore } from "@/store/userStore";
import LoadingComp from "../LoadingComp";

type AdminSidebarItemType = {
  name: string;
  icon: React.ReactNode;
  subItems: {
    title: string;
    link: string;
  }[];
};

const AdminSidebarItems: AdminSidebarItemType[] = [
  {
    name: "Users",
    icon: <FaRegUserCircle />,
    subItems: [
      {
        title: "All Users",
        link: "/admin/users",
      },
      {
        title: "Add User",
        link: "/admin/users/add-user",
      },
    ],
  },
  {
    name: "Products",
    icon: <IoDocumentsOutline />,
    subItems: [
      {
        title: "All Products",
        link: "/admin/products",
      },
      {
        title: "Add Product",
        link: "/admin/products/add-product",
      },
    ],
  },
  {
    name: "Categories",
    icon: <BiCategory />,
    subItems: [
      {
        title: "All Categories",
        link: "/admin/categories",
      },
      {
        title: "All Sub Categories",
        link: "/admin/categories/sub-categories",
      },
      {
        title: "Add category",
        link: "/admin/categories/add-category",
      },
      {
        title: "Add sub category",
        link: "/admin/categories/add-sub-category",
      },
    ],
  },
  {
    name: "Coupons",
    icon: <RiCoupon3Fill />,
    subItems: [
      {
        title: "All Coupons",
        link: "/admin/coupons",
      },
      {
        title: "Add Coupon",
        link: "/admin/coupons/add-coupon",
      },
    ],
  },
  {
    name: "Orders",
    icon: <FaBoxes />,
    subItems: [
      {
        title: "All Orders",
        link: "/admin/orders",
      },
    ],
  },
];
const AdminSidebar = (props: {}) => {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const user = useUserStore().user;
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState<boolean[]>(
    Array(AdminSidebarItems.length).fill(false)
  );

  useEffect(() => {
    setIsClient(true);
    setLoading(false);
    setCurrentPath(window.location.pathname);
  }, []);

  const isActiveCategory = (item: AdminSidebarItemType) => {
    return item.subItems.some((subItem) =>
      currentPath.startsWith(subItem.link)
    );
  };

  if (loading) {
    return <LoadingComp />;
  }

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className="w-[15%] max-md:hidden h-screen fixed top-0 left-0 max-md:w-full md:border-r flex flex-col bg-secondary border-white/20">
      <div className="px-5 py-6 border-b border-white/20 flex flex-col justify-center items-start">
        <h2 className="font-semibold text-[15px] text-title">
          Welcome back <br/> {user?.name} admin
        </h2>
        <span className="text-sm text-accent overflow-hidden text-ellipsis whitespace-nowrap max-w-[100%]">
          Your email is: <br /> {user?.email}
        </span>
      </div>
      <div className="py-10 px-6">
        <ul className="flex flex-col justify-center gap-y-7 items-center">
          <li className="w-full">
            <Link
              href={"/admin"}
              className={`flex w-full justify-between items-center cursor-pointer ${
                isClient && currentPath === "/admin"
                  ? "text-primary"
                  : "text-accent"
              }`}
            >
              <span className="flex gap-3 text-sm items-center">
                <CiHome />
                Admin Panel
              </span>
            </Link>
          </li>
          {AdminSidebarItems.map((item, index) => {
            const isActive = isClient && isActiveCategory(item);
            return (
              <li className="w-full" key={index}>
                <div
                  className={`flex w-full justify-between items-center cursor-pointer`}
                  onClick={() => toggleItem(index)}
                >
                  <span
                    className={`flex gap-3 text-sm items-center ${
                      isActive ? "text-primary" : "text-accent"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </span>
                  {openItems[index] ? (
                    <IoIosArrowDown
                      className={isActive ? "text-primary" : "text-accent"}
                    />
                  ) : (
                    <IoIosArrowForward
                      className={isActive ? "text-primary" : "text-accent"}
                    />
                  )}
                </div>
                {openItems[index] && (
                  <ul className="ml-4 mt-3 flex flex-col gap-2">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={subItem.link}
                          className={`flex items-center hover:text-primary transition-all text-sm ${
                            isClient && currentPath === subItem.link
                              ? "text-primary"
                              : "text-accent"
                          }`}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
"use client";
import React, { useState, useEffect, useRef } from "react";
import TopNav from "./TopNav";
import { CiShoppingCart } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import Link from "next/link";
import CategoriesNav from "./CategoriesNav";
import { FaBars } from "react-icons/fa6";

import { PiShoppingBagDuotone } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";

import MobileSidebar from "./MobileSidebar";
import { FaUserShield } from "react-icons/fa";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import LoadingComp from "../LoadingComp";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/userStore";
import APIURL from "../URL";
import IMAGEURL from "../IMAGEURL";
import { SearchProduct } from "@/app/types";
import { useChangeCartItemsCount } from "@/store/useChangeCartItemsCount";
import WebsiteName from "../utils/WebsiteName";

const Nav = ({ user, categories }: any) => {
  const [active, setActive] = useState(false);
  const searchRef = useRef<any>();
  const searchRefFirst = useRef<any>();
  const resultsRef = useRef<any>();
  const popupUserRef = useRef<any>();
  const resultsRefFirst = useRef<any>();
  const [popupUser, setPopupUser] = useState<boolean>(false);
  const router = useRouter();
  const isFirstRender = useRef(true);

 
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);

  const handleClickOutside = (event: any) => {
    if (
      searchRefFirst.current &&
      !searchRefFirst.current.contains(event.target) &&
      resultsRefFirst.current &&
      !resultsRefFirst.current.contains(event.target) &&
      !event.target.closest(".results")
    ) {
      setOpenSearchResults(false);
    }
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target) &&
      resultsRef.current &&
      !resultsRef.current.contains(event.target) &&
      !event.target.closest(".results")
    ) {
      setOpenSearchResults(false);
    }
    if (popupUserRef.current && !popupUserRef.current.contains(event.target)) {
      setPopupUser(false);
    }
    if (
      event.target.closest(".sidebar") === null &&
      event.target.closest(".toggle-sidebar") === null
    ) {
      setActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [loadingRes, setLoadingRes] = useState<boolean>(false);
  const [openSearchResults, setOpenSearchResults] = useState(false);
  const [queryValue, setQueryValue] = useState<string>("");
  const searchAction = async (event: { target: HTMLInputElement }) => {
    if (openSearchResults === false) {
      setOpenSearchResults(true);
    }
    setLoadingRes(true);
    if (event.target.value === "") {
      setSearchResults([]);
      setLoadingRes(false);
      return;
    }

    setTimeout(async () => {
      const res = await fetch(
        `${APIURL}/products/search?search=${event.target.value}`,
        { method: "POST" }
      );
      const data = await res.json();
      console.log(data);

      setSearchResults(data.products || []);
      setLoadingRes(false);
    }, 500);
  };
  const handleLogout = () => {
    // الحصول على دالة clearUser من المتجر
    const clearUser = useUserStore.getState().clearUser;

    // إزالة التوكن من localStorage و Cookies
    localStorage.removeItem("token");
    Cookies.remove("token");

    // مسح بيانات المستخدم
    clearUser();
    // تحديث الواجهة
    router.refresh(); // إذا كنت تستخدم Next.js، هذه الطريقة قد تكون كافية لتحديث الواجهة
  };

  const [itemsCount, setItemsCount] = useState(0);
  const countBoolean = useChangeCartItemsCount().countBoolean;

  const getItemsCount = async () => {
    const res = await fetch(`${APIURL}/cart/getItemsCount`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await res.json();
    if (data && data.itemsCount) {
      setItemsCount(data.itemsCount);
    } else {
      setItemsCount(0);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      getItemsCount();
    }
  }, []);
  useEffect(() => {
    if (countBoolean !== null) {
      getItemsCount();
    }
  }, [countBoolean]);
  console.log(itemsCount, "itemscount");
  return (
    <div className="w-screen flex flex-col bg-[#0d141d] justify-center items-center">
      <TopNav />

      <header className="w-screen sticky top-0 left-0 z-[2] border-b-4 bg-[#101924dc] h-full border-b-primary p-6">
        <div className="flex justify-between items-center max-w-[1200px] w-full mx-auto">
          <Link href={"/"} className="text-2xl font-black tracking-widest">
            {WebsiteName}
          </Link>
          <div className="relative">
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Search.."
              onChange={(e) => {
                searchAction(e);
              }}
              onFocus={() => setOpenSearchResults(true)}
              ref={searchRefFirst}
              className="w-[360px]  max-md:hidden px-3 text-sm py-1.5 focus:border-primary focus:shadow-md
            outline-none text-accent bg-secondary border border-accent/40 rounded-md"
            />
            <div
              ref={resultsRefFirst}
              className={`results bg-secondary ${
                openSearchResults ? "flex" : "hidden"
              } ${
                loadingRes
                  ? "justify-center items-center"
                  : "justify-start items-start"
              } rounded-md max-md:hidden flex-col border top-[110%] left-0 min-h-[200px] 
               max-h-[250px] py-3 px-2 overflow-auto absolute z-20 w-[360px] border-white/20`}
            >
              {loadingRes === true ? (
                <div className="spinner"></div>
              ) : searchResults && searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <Link
                    href={`/item/${item._id}`}
                    key={item._id}
                    className="flex justify-start  items-center gap-3 px-3 py-1.5
                   hover:bg-white/10 backdrop-blur-sm w-full rounded-md"
                  >
                    <img
                      src={`${IMAGEURL}${item.image}`}
                      alt={item.name}
                      className="w-10 h-10 object-cover"
                    />
                    <span className="overflow-hidden text-ellipsis">
                      {item.name}
                    </span>
                  </Link>
                ))
              ) : (
                <h1>No results</h1>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center gap-3">
            <Link href={"/cart"} className="relative pr-3 cursor-pointer">
              <CiShoppingCart className="text-xl text-primary" />
              {itemsCount ? (
                <span
                  className="bg-orange-red/15 flex justify-center items-center align-middle px-1.5 absolute left-4 top-[-60%] text-xs rounded-xl border
               border-red-500 text-red-500 py-[1px]"
                >
                  {itemsCount}
                </span>
              ) : null}
            </Link>
            {!user ? (
              <div className="flex gap-4 items-center">
                <Link href={"/login"}>
                  <button className="border border-primary px-4 py-2 rounded-sm hover:bg-primary transition-all">
                    Login
                  </button>
                </Link>
                <Link href={"/register"}>
                  <button className="border border-primary px-4 py-2 rounded-sm hover:bg-primary transition-all">
                    Register
                  </button>
                </Link>
              </div>
            ) : (
              <span className="flex justify-center items-center gap-2 relative cursor-pointer">
                <div
                  className="group flex gap-2"
                  onClick={() => setPopupUser(!popupUser)}
                >
                  <CiUser className="text-xl group-hover:text-primary" />
                  <span className="max-[400px]:hidden">{user.name}</span>
                </div>

                {popupUser && (
                  <div
                    ref={popupUserRef}
                    className="rounded-sm absolute border border-white/20 bg-secondary
             min-h-[100px] w-[210px] left-[clamp(-50%, -850%, 0)] top-[125%] max-[400px]:left-[-850%]"
                  >
                    <div className="flex flex-col px-3 py-2">
                      <span className="text-sm">{user.name}</span>
                      <span className="text-accent  overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                        {user.email}
                      </span>
                    </div>
                    <ul className="px-1 py-1 border-t flex flex-col gap-1 border-white/20">
                      <Link
                        href={"/user"}
                        className="gap-3 flex  px-4 py-1.5 rounded-md items-center text-sm
                   hover:bg-white/20"
                      >
                        <CiUser className="text-xl" /> Profile
                      </Link>
                      <Link
                        href={"/user/orders"}
                        className="gap-3 flex px-4 py-1.5 rounded-md items-center text-sm
                   hover:bg-white/20"
                      >
                        <PiShoppingBagDuotone className="text-xl" /> My Orders
                      </Link>
                      {user && user.role === "admin" && (
                        <Link
                          href={"/admin"}
                          className="gap-3 flex px-4 py-1.5 rounded-md items-center text-sm
                   hover:bg-white/20"
                        >
                          <FaUserShield className="text-xl" /> Admin
                        </Link>
                      )}
                      <li
                        onClick={handleLogout}
                        className="gap-3 flex px-4 py-1.5 text-red-500 rounded-md items-center text-sm
                   hover:bg-white/20"
                      >
                        <IoIosLogOut className="text-xl" /> Logout
                      </li>
                    </ul>
                  </div>
                )}
              </span>
            )}
            <span
              className=" justify-center items-center max-md:flex hidden gap-2 cursor-pointer toggle-sidebar"
              onClick={() => setActive(!active)}
            >
              <FaBars className="text-xl" />
            </span>
          </div>
        </div>
      </header>

      <MobileSidebar
        active={active}
        setActive={setActive}
        categories={categories}
        openSearchResults={openSearchResults}
        setOpenSearchResults={setOpenSearchResults}
        searchResults={searchResults}
        loadingRes={loadingRes}
        searchAction={searchAction}
        key={6}
      />
      <CategoriesNav categories={categories} />
    </div>
  );
};

export default Nav;

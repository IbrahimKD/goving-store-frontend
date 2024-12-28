import React, { useEffect, useState } from "react";
import { CgGames } from "react-icons/cg";
import { CiShop, CiUser } from "react-icons/ci";
import { FaAward, FaPlaystation, FaXbox } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosLogOut,
  IoMdClose,
} from "react-icons/io";
import { TbCards } from "react-icons/tb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import IMAGEURL from "../IMAGEURL";
library.add(fas);

type Props = {
  active: boolean;
  setActive: Function;
  searchAction: Function;
  setOpenSearchResults: Function;
  loadingRes: boolean;
  openSearchResults: boolean;
  searchResults: any;
  categories: any;
};

const MobileSidebar = ({
  active,
  setActive,
  searchAction,
  setOpenSearchResults,
  loadingRes,
  openSearchResults,
  searchResults,
  categories,
}: Props) => {
  // استخدام useState لتخزين حالة الفتح لكل تصنيف فرعي
  const [openCategories, setOpenCategories] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };

  const resultsRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const handleClickOutside = (event: any) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target) &&
      resultsRef.current &&
      !resultsRef.current.contains(event.target) &&
      !event.target.closest(".results")
    ) {
      setOpenSearchResults(false);
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

  return (
    <div
      className={`sidebar max-md:flex flex-col justify-start gap-6 px-4 py-6 items-start  hidden top-0 fixed w-[280px] h-[100vh] overflow-auto bg-[#101924]
        border border-white/20 z-50 transition-all duration-300 ${
          active ? "left-0" : "left-[-280px]"
        }`}
    >
      <span
        onClick={() => setActive(false)}
        className="absolute cursor-pointer top-4 right-4 text-3xl"
      >
        <IoMdClose />
      </span>
      <Link href={"/"} className="text-3xl text-center font-black">
        Do<span className="text-primary">ze</span>r
      </Link>
      <div className="relative">
        <input
          type="search"
          name="search"
          ref={searchRef}
          id="search"
          onChange={(e) => {
            searchAction(e);
            console.log(e);
          }}
          onFocus={() => setOpenSearchResults(true)}
          placeholder="Search.."
          className="w-[239px] px-3 text-sm py-1.5 focus:border-primary focus:shadow-md outline-none text-accent bg-secondary border border-accent/40 rounded-md"
        />
        <div
          ref={resultsRef}
          className={`results ${
            loadingRes
              ? "justify-center items-center"
              : "justify-start items-start"
          }  bg-secondary ${
            openSearchResults ? "flex" : "hidden"
          } justify-start items-start md:hidden  flex-col border top-[110%] -left-2 rounded-md min-h-[200px] 
               max-h-[250px] py-3 px-2 overflow-auto absolute z-[51] w-[260px] border-white/20`}
        >
          {loadingRes ? (
            <div className="spinner"></div>
          ) : searchResults && searchResults.length > 0 ? (
            searchResults.map((item: any) => (
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
      <ul className="flex flex-col w-full justify-center items-center gap-2">
        {categories &&
          categories.length > 0 &&
          categories.map((category: any) => (
            <li className="w-full" key={category._id}>
              <span
                className={` flex px-2 py-3  rounded-md  ${
                  openCategories[category._id]
                    ? "bg-primary"
                    : " hover:backdrop-blur-sm  hover:bg-white/15"
                } justify-between items-center`}
              >
                <Link
                  href={`/category/${category._id}`}
                  className="flex justify-center items-center gap-1.5"
                >
                  <span className="text-xl">
                    <FontAwesomeIcon icon={category.icon as any} />
                  </span>
                  {category.name}
                </Link>
                {category.subCategories &&
                  category.subCategories.length > 0 && (
                    <span
                      className="text-2xl cursor-pointer"
                      onClick={() => toggleCategory(category._id)}
                    >
                      {openCategories[category._id] ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </span>
                  )}
              </span>
              {openCategories[category._id] && category.subCategories && (
                <ul className="mt-2">
                  {category.subCategories &&
                    category.subCategories.length > 0 &&
                    category.subCategories.map((subCategory: any) => (
                      <li
                        key={subCategory._id}
                        className="px-4 py-2 hover:backdrop-blur-sm  hover:bg-white/15 w-full rounded-md"
                      >
                        <Link
                          href={`/category/${category._id}?subCategory=${subCategory._id}`}
                          className="flex justify-start items-center gap-2"
                        >
                          <span className="text-xl">
                            <FontAwesomeIcon icon={subCategory.icon as any} />
                          </span>
                          <span className="capitalize text-sm">
                            {subCategory.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))}
      </ul>
      <div className="flex flex-col gap-5 flex-1 justify-end">
        <Link
          href={"/"}
          className="text-accent flex justify-start gap-3 items-center"
        >
          <CiUser /> View Profile
        </Link>
        <span className="cursor-pointer text-red-500 flex justify-start gap-3 items-center">
          <IoIosLogOut /> Log Out
        </span>
      </div>
    </div>
  );
};

export default MobileSidebar;

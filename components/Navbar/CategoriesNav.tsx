import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import ContentLoader from "react-content-loader";
import { useChangeCartItemsCount } from "@/store/useChangeCartItemsCount";
import LoadingComp from "../LoadingComp";
library.add(fas);

type Props = {
  categories: any[];
};

const CategoriesNav = ({ categories }: Props) => {
  const [loading, setLoading] = useState(true); // حالة لمعرفة إذا كانت التصنيفات تم تحميلها

  useEffect(() => {
    // إذا كانت التصنيفات قد تم تحميلها بنجاح ولكن كانت فارغة
    if (categories && categories.length === 0) {
      setLoading(false); // إيقاف التحميل إذا كانت التصنيفات فارغة
    }
    // إذا كانت التصنيفات قد تم تحميلها بنجاح ولم تكن فارغة
    else if (categories && categories.length > 0) {
      setLoading(false);
    }
  }, [categories]); // يعتمد التغيير على التصنيفات فقط

  const renderSkeleton = () => (
    <div className="max-w-[1200px] py-7 px-4 max-md:hidden w-full">
      <ul className="flex flex-wrap justify-start items-start gap-">
        {[...Array(4)].map((_, index) => (
          <li key={index} className="w-1/5">
            <ContentLoader
              speed={2}
              width={150}
              height={30}
              viewBox="0 0 150 30"
              backgroundColor="#05191d"
              foregroundColor="#fff"
            >
              <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
            </ContentLoader>
          </li>
        ))}
      </ul>
    </div>
  );
  const countItems = useChangeCartItemsCount().countBoolean;
  const renderCategories = () => (
    <div className="max-w-[1200px] py-7 px-4 max-md:hidden w-full">
      <ul className="flex flex-wrap justify-start items-center gap-5">
        {categories && categories.length
          ? categories.map((category: any) => {
              if (category.subCategories && category.subCategories.length > 0) {
                return (
                  <li className="relative group py-1" key={category._id}>
                    <Link
                      className="flex justify-center hover:text-primary text-accent items-center gap-2"
                      href={`/category/${category._id}`}
                    >
                      <span className="text-xl">
                        <FontAwesomeIcon icon={category.icon as any} />
                      </span>
                      <span className="capitalize text-sm">
                        {category.name}
                      </span>
                      <span>
                        <IoIosArrowDown />
                      </span>
                    </Link>
                    <ul className="hidden z-10 hover:flex p-1 absolute group-hover:flex flex-col top-[100%] border border-white/20 bg-black/20 backdrop-blur-sm rounded-md -left-1.5 min-w-[230px]">
                      {category.subCategories.map((subCategory: any) => (
                        <li
                          key={subCategory._id}
                          className="px-4 py-2 hover:backdrop-blur-sm hover:bg-white/25 w-full rounded-md"
                        >
                          <Link
                            href={`/category/${category._id}?subCategory=${subCategory._id}`}
                            className="flex justify-start items-center gap-2"
                          >
                            <span className="text-[16px]">
                              <FontAwesomeIcon icon={subCategory.icon as any} />
                            </span>
                            <span className="capitalize text-sm">
                              {subCategory.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
              return (
                <li className="relative group py-1" key={category._id}>
                  <Link
                    className="flex justify-center hover:text-primary text-accent items-center gap-2"
                    href={`/category/${category._id}`}
                  >
                    <span className="text-xl">
                      <FontAwesomeIcon icon={category.icon as any} />
                    </span>
                    <span className="capitalize text-sm">{category.name}</span>
                  </Link>
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );

  return loading ? <LoadingComp /> : renderCategories(); // عرض Skeleton إذا كانت التصنيفات لا تزال في حالة تحميل
};

export default CategoriesNav;

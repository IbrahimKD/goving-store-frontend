"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { CiShoppingCart } from "react-icons/ci";
import { FaWindows } from "react-icons/fa";
import { MdOutlineSmartphone } from "react-icons/md";
import { FaPlaystation } from "react-icons/fa";
import { FaXbox } from "react-icons/fa";
import APIURL from "../URL";
import IMAGEURL from "../IMAGEURL";

export default function CategoriesHome() {
  const [categories, setCategories] = React.useState([]);
  const getHomeCategories = async () => {
    try {
      const res = await fetch(`${APIURL}/categories/getHomeCategories`);
      const data = await res.json();
      console.log(data);
      if (data && data.categories) {
        setCategories(data.categories);
      }
    } catch (e) {
      return console.log(e);
    }
  };
  React.useEffect(() => {
    getHomeCategories();
  }, []);
  const CATEGORIES = [
    {
      id: 1,
      image: "https://tranzur.com/uploads/1705343485415-402692021.jpg",
    },
    {
      id: 2,
      image: "https://tranzur.com/uploads/1718131475505-852843226.png",
    },
    {
      id: 3,
      image: "https://tranzur.com/uploads/1718128123089-738637000.png",
    },
    {
      id: 4,
      image: "https://tranzur.com/uploads/1708210380895-920360241.png",
    },
    {
      id: 5,
      image: "	https://tranzur.com/uploads/1718127830495-338725755.png",
    },
  ];
  return (
    <Carousel className="w-full max-h-[150px]">
      <CarouselContent className="-ml-1 ">
        {categories.map((item: { _id: string; image: string }) => (
          <CarouselItem
            key={item._id}
            className="p-0 pl-3 min-[550px]:basis-1/3 md:basis-1/4 lg:basis-1/5"
          >
            <div className="p-0 ">
              <Card className="p-0 m-0  bg-[#141c26] border-0 shadow-lg">
                <CardContent className="flex p-0 h-[150px] flex-col shadow-lg">
                  <Link href={`/category/${item._id}`}>
                    <img
                      src={`${IMAGEURL}${item.image}`}
                      className="rounded-t-xl hover:scale-105 transition-all object-cover w-full h-[150px]"
                    />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

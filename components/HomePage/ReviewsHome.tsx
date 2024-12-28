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

import { IoStarSharp } from "react-icons/io5";
import { CiUser } from "react-icons/ci";

export default function ReviewsHome() {
  return (
    <div>
      <h1 className="text-center text-xl text-accent">Reviews</h1>
      <h2 className="text-center text-[22px] font-semibold mb-4">What our customers say</h2>
      <Carousel className="w-full max-h-[120px]">
        <CarouselContent className="-ml-1 ">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="p-0 pl-3 min-[500px]:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div className="p-0 relative">
                <Card className="p-0 m-0 bg-[#141c26] border border-primary/30 shadow-lg">
                  <CardContent className="flex p-0 h-[120px] flex-col shadow-lg">
                    <div className="px-3 gap-2 py-5 flex flex-col flex-grow">
                      <div className="flex gap-1 items-center text-accent">
                        <CiUser className="text-xl" />
                        <span className="text-sm ">John Doe</span>
                      </div>
                      <span className="flex text-yellow-400 pl-0.5">
                        <IoStarSharp />
                        <IoStarSharp />
                        <IoStarSharp />
                        <IoStarSharp />
                        <IoStarSharp />
                      </span>
                      <span className="text-sm pl-0.5">Thanks</span>
                    </div>
                  </CardContent>
                </Card>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[100%] w-[100px] h-[100px] rounded-full bg-primary blur-xl"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

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
import BannerFirst from "@/public/banner-1.png"
export default function BannersSlider() {
  const CAROUSEL = [
    {
      id: 1,
      image: `/banner-1.png`,
    },
    {
      id: 2,

      image: "https://tranzur.com/uploads/1717771409540-505027301.png",
    },
  ];

  return (
    <Carousel className="w-full max-w-full relative max-h-[130px] mt-5 h-[130px]">
      <CarouselContent>
        {CAROUSEL.map((item) => (
          <CarouselItem key={item.id}>
            <div className="p-1">
              <Card className="w-full h-[130px] border-0 rounded-xl">
                <CardContent className="flex items-start w-full h-full justify-start p-0 relative">
                  <img
                    src={item.image}
                    className="h-full w-full rounded-xl object-cover"
                    alt="Img1"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

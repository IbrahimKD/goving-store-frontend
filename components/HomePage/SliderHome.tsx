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

export default function SliderHome() {
  const CAROUSEL = [
    {
      id: 1,
      title: "Nextflix Subscriptions",
      buttonTitle: "Click Here",
      buttonColor: "#e92525",
      buttonUrl: "/category/671eb4f2e69cb6582f524f7c",

      buttonTitleColor: "#fff",
      titleColor: "#fff",
      image: "https://tranzur.com/uploads/1718126076180-568803944.png",
    },
    {
      id: 2,
      title: "Shaid VIP",
      buttonUrl: "/category/671eb4f2e69cb6582f524f7c",
      buttonTitle: "Click Here",
      buttonColor: "#00db87",
      buttonTitleColor: "#fff",
      titleColor: "#fff",
      image: "https://tranzur.com/uploads/1717769852091-678623949.png",
    },
    {
      id: 3,
      title: "CODMWIII",
      buttonUrl: "/category/671eb491e69cb6582f524f6c",
      buttonTitle: "Order Now",
      buttonColor: "#000",
      buttonTitleColor: "#fff",
      titleColor: "#fff",
      image: "https://tranzur.com/uploads/1718126267842-356660650.jpg",
    },
    {
      id: 4,
      title: "Elden Ring",
      buttonTitle: "Shop Now",
      buttonColor: "#111",
      buttonUrl: "/category/671eb491e69cb6582f524f6c",

      buttonTitleColor: "#fff",
      titleColor: "#fff",
      image: "https://tranzur.com/uploads/1719716484868-643383640.jpeg",
    },
  ];

  return (
    <Carousel className="relative max-h-[460px]  w-full max-w-full ">
      <CarouselContent>
        {CAROUSEL.map((item) => (
          <CarouselItem key={item.id}>
            <div className="p-1">
              <Card className="w-full border-0 rounded-xl">
                <CardContent className="relative flex items-start justify-start w-full p-0">
                  <Link
                    href={item.buttonUrl}
                    className="absolute hover:opacity-90 transition-all text-sm bottom-8 left-[50%] translate-x-[-50%] rounded-xl px-4 py-[4px]"
                    style={{
                      backgroundColor: item.buttonColor,
                      color: item.buttonTitleColor,
                    }}
                  >
                    {item.buttonTitle}
                  </Link>
                  <span
                    className="absolute bottom-20 text-xl translate-x-[-50%] left-[50%]"
                    style={{ color: item.titleColor }}
                  >
                    {item.title}
                  </span>
                  <img
                    src={item.image}
                    className="object-cover w-full    h-[360px] rounded-2xl"
                    alt="Img1"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
      <CarouselPrevious />
    </Carousel>
  );
}

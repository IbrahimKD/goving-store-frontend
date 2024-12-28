"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState, useEffect } from "react";

interface StatsDetailsProps {
  STATS: {
    totalCoupons?: number;
  };
  firstTitle?: string;
  secondTitle?: string;
  lastTitle?: string;
  type?: string;
}

const StatsDetailsCoupons: React.FC<StatsDetailsProps> = ({
  STATS,
  firstTitle,
  secondTitle,
  lastTitle,
}) => {
  const [gridCounts, setGridCounts] = useState<number>(1);
    console.log(STATS)
  return (
    <div
      className={`grid gap-4 md:grid-cols-${
        gridCounts === 1 ? "1" : "2"
      } lg:grid-cols-${gridCounts} w-full mb-8`}
    >
      <Card className="max-w-[500px] w-full text-center mx-auto">
        <CardHeader className=" text-center  pb-2">
          <CardTitle className="text-lg font-medium text-center">
            {secondTitle ? secondTitle : "Total Coupons"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{STATS.totalCoupons || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsDetailsCoupons;

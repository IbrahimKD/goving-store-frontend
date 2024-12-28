"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatsDetailsProps {
  STATS: {
    totalCategories?: number;
    totalProducts?: number;
    averageProductsPerCategory?: number;
    totalCoupons?:number;
  };
  firstTitle?: string;
  secondTitle?: string;
  lastTitle?: string;
  type?:string;
}

const StatsDetails: React.FC<StatsDetailsProps> = ({
  STATS,
  firstTitle,
  secondTitle,
  lastTitle,
}) => {
  const [gridCounts, setGridCounts] = useState<number>(3);

  // استخدام useEffect لتحديث عدد الأعمدة
  useEffect(() => {
    if (
      STATS.totalCategories &&
      STATS.totalProducts &&
      STATS.averageProductsPerCategory 
    ) {
      setGridCounts(3);
    } else if (
      STATS.totalCategories &&
      STATS.totalProducts &&
      !STATS.averageProductsPerCategory
    ) {
      setGridCounts(2);
    } else if (
      !STATS.totalCategories &&
      STATS.totalProducts &&
      STATS.averageProductsPerCategory
    ) {
      setGridCounts(2);
    } else if (
      !STATS.totalCategories &&
      STATS.totalProducts &&
      !STATS.averageProductsPerCategory
    ) {
      setGridCounts(1);
    } else if(STATS.totalCoupons){
      setGridCounts(1);
    } else {
      setGridCounts(1); // في حال لم يتوفر أي من الشروط السابقة
    }
  }, [STATS]); // تحديث في حالة تغير STATS

  return (
    <div
      className={`grid gap-4 md:grid-cols-${
        gridCounts === 1 ? "1" : "2"
      } lg:grid-cols-${gridCounts} w-full mb-8`}
    >
      {STATS.totalCategories && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {firstTitle ? firstTitle : "Total Categories"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{STATS.totalCategories}</div>
          </CardContent>
        </Card>
      )}
      {STATS.totalProducts && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {secondTitle ? secondTitle : "Total Products"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{STATS.totalProducts}</div>
          </CardContent>
        </Card>
      )}
      {STATS.totalCoupons && (
        <Card className="max-w-[500px] w-full text-center mx-auto">
          <CardHeader className=" text-center  pb-2">
            <CardTitle className="text-lg font-medium text-center">
              {secondTitle ? secondTitle : "Total Coupons"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{STATS.totalCoupons}</div>
          </CardContent>
        </Card>
      )}
      {STATS.averageProductsPerCategory && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {lastTitle ? lastTitle : "Avg Products per Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {STATS.averageProductsPerCategory}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatsDetails;

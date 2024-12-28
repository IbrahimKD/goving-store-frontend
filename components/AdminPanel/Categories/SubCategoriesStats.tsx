"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsDetailsProps {
  STATS: {
    totalProductsThatHaveSubCategories?: number;
    averageProductsPerSubCategory?: number;
    toatalSubCategories?: number;
 
  };
  firstTitle?: string;
  secondTitle?: string;
  lastTitle?: string;
  type?: string;
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
      STATS.toatalSubCategories &&
      STATS.totalProductsThatHaveSubCategories &&
      STATS.averageProductsPerSubCategory
    ) {
      setGridCounts(3);
    } else if (
      STATS.toatalSubCategories &&
      STATS.totalProductsThatHaveSubCategories &&
      !STATS.averageProductsPerSubCategory
    ) {
      setGridCounts(2);
    } else if (
      !STATS.toatalSubCategories &&
      STATS.totalProductsThatHaveSubCategories &&
      STATS.averageProductsPerSubCategory
    ) {
      setGridCounts(2);
    } else if (
      !STATS.toatalSubCategories &&
      STATS.totalProductsThatHaveSubCategories &&
      !STATS.averageProductsPerSubCategory
    ) {
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
      {STATS.toatalSubCategories && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {firstTitle ? firstTitle : "Total Categories"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {STATS.toatalSubCategories}
            </div>
          </CardContent>
        </Card>
      )}
      {STATS.totalProductsThatHaveSubCategories && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {secondTitle ? secondTitle : "Total Products"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {STATS.totalProductsThatHaveSubCategories}
            </div>
          </CardContent>
        </Card>
      )}
      {STATS.averageProductsPerSubCategory && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {lastTitle ? lastTitle : "Avg Products per Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {STATS.averageProductsPerSubCategory}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatsDetails;

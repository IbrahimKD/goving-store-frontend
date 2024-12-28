"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsDetailsProps {
  STATS: {
    totalSubCategories?: number;
    totalProductsThatHaveSubCategories?: number;
    avgProductsPerSubCategory?: number;
  };
  firstTitle?: string;
  secondTitle?: string;
  lastTitle?: string;
  type?: string;
}

const AllSubCategoriesStats: React.FC<StatsDetailsProps> = ({
  STATS,
  firstTitle,
  secondTitle,
  lastTitle,
}) => {
  const [gridCounts, setGridCounts] = useState<number>(3);
   // استخدام useEffect لتحديث عدد الأعمدة

  return (
    <div
      className={`grid gap-4 md:grid-cols-${
        gridCounts === 1 ? "1" : "2"
      } lg:grid-cols-${gridCounts} w-full mb-8`}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {firstTitle ? firstTitle : "Total Categories"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{STATS.totalSubCategories}</div>
        </CardContent>
      </Card>

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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {lastTitle ? lastTitle : "Avg Products per Category"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {STATS.avgProductsPerSubCategory}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllSubCategoriesStats;

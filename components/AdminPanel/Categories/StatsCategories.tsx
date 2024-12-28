"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

interface StatsDetailsProps {
  STATS: {
    totalCategories: number;
    totalProducts: number;
    totalProductsWithCategories: number;
    avgProductsPerCategory: string;
    topCategories: { name: string; percentage: string }[];
  };
  firstTitle?: string;
  secondTitle?: string;
  thirdTitle?: string;
  fourthTitle?: string;
}

const StatsCategories: React.FC<StatsDetailsProps> = ({
  STATS,
  firstTitle,
  secondTitle,
  thirdTitle,
  fourthTitle,
}) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {firstTitle || "Total Categories"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{STATS.totalCategories}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {secondTitle || "Total Products"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{STATS.totalProducts}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {thirdTitle || "Products With Categories"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {STATS.totalProductsWithCategories}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {fourthTitle || "Avg Products per Category"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {STATS.avgProductsPerCategory}
          </div>
        </CardContent>
      </Card>

      {STATS.topCategories && STATS.topCategories.length > 0 && (
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Top Categories Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {STATS.topCategories.map((category: any, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg"
                >
                   <span className="flex text-[23px] justify-center items-center gap-2 font-medium mb-2">
                    <FontAwesomeIcon icon={category.icon as any} />
                    <span className="text-[14px]">{category.name}</span>
                  </span>
                  <span className="text-lg font-bold">
                    {category.percentage}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatsCategories;

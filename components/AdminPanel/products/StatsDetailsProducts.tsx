"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface StatsDetailsProps {
  STATS: {
    totalProductInCategories?: number;
    totalProducts?: number;
    avgProductsPerCategory?: number;
  };
}

const StatsDetailsProducts: React.FC<StatsDetailsProps> = ({ STATS }) => {
  const [gridCounts, setGridCounts] = useState<number>(3);

  return (
    <div
      className={`grid gap-4 md:grid-cols-${
        gridCounts === 1 ? "1" : "2"
      } lg:grid-cols-${gridCounts} w-full mb-8`}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Products in Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {STATS.totalProductInCategories}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{STATS.totalProducts}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg Products per Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {STATS.avgProductsPerCategory?.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsDetailsProducts;

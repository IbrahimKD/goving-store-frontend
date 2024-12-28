"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface StatsDetailsProps {
  STATS: {
    totalOrders?: number;
    completedOrders?: number;
    cancelledOrders?: number;
    pendingOrders?: number;
    resituteOrders?: number;
  };
}

const StatsDetailsOrders: React.FC<StatsDetailsProps> = ({ STATS }) => {
  const [gridCounts, setGridCounts] = useState<number>(3);

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`grid gap-4 text-center md:grid-cols-1 w-full max-w-[400px] mx-auto mb-8`}
      >
        <Card>
          <CardHeader className=" text-center space-y-0 pb-2">
            <CardTitle className="text-lg text-center font-medium">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-center font-bold">
              {STATS.totalOrders}
            </div>
          </CardContent>
        </Card>
      </div>
      <div
        className={`grid max-sm:px-12 gap-4 md:grid-cols-2 lg:grid-cols-4 grid-cols-1 w-full mb-8`}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{STATS.completedOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resitute Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{STATS.resituteOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{STATS.pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cancelled Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{STATS.cancelledOrders}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsDetailsOrders;

"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BiCategory } from "react-icons/bi";
import { CiShop } from "react-icons/ci";
import { MdOutlineDataSaverOff } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { BiCheckCircle } from "react-icons/bi";
import { GiDuration } from "react-icons/gi";
import { FaUserCheck } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import { GrMoney } from "react-icons/gr";
interface StatsDetailsProps {
  STATS: {
    totalCategories?: number;
    totalProducts?: number;
    averageProductsPerCategory?: string;
  };
  stats: any;
}

const AdminStatsDetails: React.FC<StatsDetailsProps> = ({ STATS, stats }) => {
  const [gridCounts, setGridCounts] = useState<number>(3);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full mb-8 mt-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex gap-2 items-center ">
            <BiCategory size={22} />
            <span>Total Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{STATS.totalCategories}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex gap-2 items-center ">
            <CiShop size={22} />
            <span> Total Products</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{STATS.totalProducts}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex gap-2 items-center ">
            <MdOutlineDataSaverOff size={22} />
            <span> Avg Products per Category</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {STATS.averageProductsPerCategory}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex gap-2 items-center ">
            <FcSalesPerformance size={22} />
            <span> Total Sales</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">
            {stats.totalSales ? stats.totalSales.toLocaleString("en-US") : 0}$
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex gap-2 items-center ">
            <BiCheckCircle size={22} />
            <span> Completed Orders</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.completedOrders
              ? stats.completedOrders.toLocaleString("en-US")
              : 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex gap-2 items-center ">
            <GiDuration size={22} />
            <span>Pending Orders</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.pendingOrders
              ? stats.pendingOrders.toLocaleString("en-US")
              : 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex gap-2 items-center ">
            <FaUserCheck size={22} />
            <span>Active Customers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.activeCustomers
              ? stats.activeCustomers.toLocaleString("en-US")
              : 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex gap-2 items-center">
            <FaUserPlus size={22} />
            <span>New Customers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.newCustomers
              ? stats.newCustomers.toLocaleString("en-US")
              : 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex text-green-400 flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm  font-medium flex gap-2 items-center">
            <GrMoney size={22} />
            <span className="">Average Order Value</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-green-400 font-bold">
            $
            {stats.averageOrderValue
              ? stats.averageOrderValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })
              : 0}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatsDetails;

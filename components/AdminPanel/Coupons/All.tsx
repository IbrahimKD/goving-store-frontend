"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { toast } from "react-toastify";
import APIURL from "@/components/URL";
import Cookies from "js-cookie";
type Coupon = {
  _id: string;
  discountPercent: number;
  expiryDate: Date | string;
  createdBy?: string;
  name: string;
  isActive: boolean;
};

const AllCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "true" | "false">("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { user } = useUserStore();

  // جلب الكوبونات من API
  const fetchCoupons = async () => {
    try {
      const response = await fetch(
        `${APIURL}/coupons?search=${searchTerm}&filter=${filter}&page=${page}&limit=${limit}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCoupons(data.coupons);
      } else {
        toast.error(data.message || "Failed to fetch coupons.");
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Something went wrong.");
    }
  };

  // جلب الكوبونات عند تغيير الفلاتر أو البحث
  useEffect(() => {
    fetchCoupons();
  }, [searchTerm, filter, page, limit]);

  // تحويل التاريخ إلى تنسيق طبيعي
  const formatDate = (date: Date | string) => {
    return format(new Date(date), "PPP");
  };

  return (
    <Card>
      <CardHeader>Coupon Manager</CardHeader>
      <CardContent>
        {/* مربع البحث */}
        <Input
          placeholder="Search for coupons"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        {/* فلاتر الكوبونات */}
        <div className="flex gap-4 mb-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All Coupons
          </Button>
          <Button
            variant={filter === "true" ? "default" : "outline"}
            onClick={() => setFilter("true")}
          >
            Active Coupons
          </Button>
          <Button
            variant={filter === "false" ? "default" : "outline"}
            onClick={() => setFilter("false")}
          >
            Unactive Coupons
          </Button>
        </div>

        {/* عرض الكوبونات */}
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="flex transition-all flex-col gap-2 hover:shadow-md hover:shadow-primary bg-secondary border border-primary rounded-md px-6 py-2"
            >
              <div className="flex justify-between items-center">
                <h2>Coupon Name: {coupon.name}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCoupon(item);
                      setIsDialogOpen(true);
                    }}
                    className="border border-primary text-white bg-secondary px-3 py-2 shadow-lg
                hover:shadow-primary hover:shadow-md text-sm rounded-md flex
                justify-center items-center transition-all hover:bg-primary"
                  >
                    <FaEdit />{" "}
                  </button>
                  <button
                    className="border border-primary text-white bg-secondary px-3 py-2 shadow-lg
                hover:shadow-red-500 hover:border-transparent hover:shadow-md text-[16px] rounded-md flex
                justify-center items-center transition-all hover:bg-red-500"
                  >
                    <GoTrash />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span>Discount Percent :{item.discountPer}%</span>
                <span>Expiry Date: {item.expiryDate}</span>
                <span>Created By: {item.createdBy}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* التنقل بين الصفحات */}
      <CardFooter className="flex justify-between">
        <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
          Previous
        </Button>
        <Button onClick={() => setPage((prev) => prev + 1)}>Next</Button>
      </CardFooter>
    </Card>
  );
};

export default AllCoupons;

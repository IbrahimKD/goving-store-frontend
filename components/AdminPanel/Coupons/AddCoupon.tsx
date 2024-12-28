"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format, addDays, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Cookies from "js-cookie";
import { CalendarIcon } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { toast } from "react-toastify";
import APIURL from "@/components/URL";

type Coupon = {
  discountPer: any;
  expiryDate: Date | string;
  createdBy?: string;
  name: string;
};

const AddCoupon: React.FC = () => {

  const tomorrow = addDays(new Date(), 1); // تاريخ يوم غد
  const [date, setDate] = useState<Date | undefined>(tomorrow);
    const { user } = useUserStore();
    console.log(user);
  const [coupon, setCoupon] = useState<Coupon>({
    discountPer: 0,
    expiryDate: tomorrow, // تعيين التاريخ الافتراضي ليوم غد
    name: "",
  });

  const handleInputChange = (e: any, field: keyof Coupon) => {
    setCoupon({ ...coupon, [field]: e });
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate && isBefore(newDate, tomorrow)) {
      toast.error("You cannot select today or a past date.");
      return;
    }
    setDate(newDate);
    setCoupon({
      ...coupon,
      expiryDate: newDate || "",
    });
  };

  const handleSubmit = async () => {
    // التحقق من صلاحية التاريخ
    if (!coupon.expiryDate || isNaN(Date.parse(String(coupon.expiryDate)))) {
      toast.error("Please enter a valid expiry date.");
      return;
    }

    // التحقق من صلاحية نسبة الخصم
    console.log(coupon);
    const discount = parseFloat(coupon.discountPer);
    if (discount < 0 || discount > 100) {
      toast.error("Discount Percentage must be between 0% and 100%.");
      return;
    }

    console.log("Coupon created:", coupon);
    try {
      const response = await fetch(`${APIURL}/coupons`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: coupon.name,
          discountPercent: coupon.discountPer,
          createdBy: user._id,
          expiryDate: coupon.expiryDate,
        }),
      });
      const data = await response.json();
      console.log(data)
      if (!data) {
        return toast.error("Not response and data, try again later.");
      }
      if (data.status === 500) {
        return toast.error("An error occurred while creating the coupon.");
      }
      if (data && data.message === "Please fill in all required fields.") {
        return toast.warn("Please fill in all fields.");
      }
      if (
        data &&
        data.message === "Discount percent must be between 1 and 100."
      ) {
        return toast.error("Discount percent must be between 1 and 100.");
      }
      if (data && data.message === "Expiry date must be in the future.") {
        return toast.error("Expiry date must be in the future.");
      }

      console.log(response);
      console.log(data);

      setCoupon({
        name: "",
        discountPer: 0,
        expiryDate: tomorrow,
        createdBy: "",
      });
      return toast.success("Coupon created successfully");
    } catch (e) {
      toast.error("Sorry, something went wrong please try again later.");
      return console.log(e);
    }
  };

  return (
    <Card>
      <CardHeader>Add Coupon</CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-6 ">
            <Input
              placeholder="Coupon Name"
              value={coupon.name}
              onChange={(e) => handleInputChange(e.target.value, "name")}
            />
            <Input
              placeholder="Discount Percentage"
              type="text"
              value={coupon.discountPer}
              onChange={(e: any) => {
                // Only allow numbers and period
                const inputValue = e.target.value.replace(/[^0-9.]/g, "");

                // Ensure only one period is allowed
                const periodCount = (inputValue.match(/\./g) || []).length;
                if (periodCount > 1) {
                  return;
                }

                // Validate the value before setting
                const numericValue = inputValue.replace(",", ".");
                const parsedValue = parseFloat(numericValue);

                // Check if the parsed value is valid and within range
                if (
                  (parsedValue >= 0 && parsedValue <= 100) ||
                  inputValue === "" ||
                  inputValue === "."
                ) {
                  handleInputChange(inputValue, "discountPer");
                } else {
                  toast.error(
                    "Discount Percentage must be between 0% and 100%"
                  );
                }
              }}
              onBlur={() => {
                // When leaving the input, convert to proper number format
                if (coupon.discountPer) {
                  const numericValue = String(coupon.discountPer).replace(
                    ",",
                    "."
                  );
                  const parsedValue = parseFloat(numericValue);

                  if (parsedValue >= 0 && parsedValue <= 100) {
                    // Convert back to a string with comma as decimal separator
                    handleInputChange(
                      parsedValue.toString().replace(".", ","),
                      "discountPer"
                    );
                  } else {
                    handleInputChange("", "discountPer");
                    toast.error(
                      "Discount Percentage must be between 0% and 100%"
                    );
                  }
                }
              }}
            />
          </div>
          <div className="grid grid-cols-1 max-md:grid-cols-1 gap-6 ">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[270px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  disabled={(date) => isBefore(date, tomorrow)} // تعطيل التواريخ قبل يوم غد
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit}>Create Coupon</Button>
      </CardFooter>
    </Card>
  );
};

export default AddCoupon;

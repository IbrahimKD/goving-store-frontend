"use client";
import React, { useEffect, useState } from "react";
import { GoTrash } from "react-icons/go";
import { FaEdit } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import APIURL from "@/components/URL";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
type Props = {};

type Coupon = {
  _id: string;
  discountPercent: any;
  expiryDate: string;
  createdBy?: string;
  name: string;
};

const AllCoupons = (props: Props) => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState(selectedCoupon?.name || "");
  const [expiryDate, setExpiryDate] = useState("");
  const [discountPercent, setDiscountPercent] = useState(
    selectedCoupon?.discountPercent || 0
  );
  const [couponsLoading, setCouponsLoading] = useState(true);
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(6);
  const router = useRouter();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
     const [coupons, setCoupons] = useState([]);
  const [updated, setUpdated] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const fetchCoupons = async () => {
    setCouponsLoading(true);
    try {
      const response = await fetch(
        `${APIURL}/coupons?search=${searchTerm}&filter=${filter}&page=${currentPage}&limit=${limit}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setTotalPages(data.totalPages); // افترض أن الخادم يعيد العدد الإجمالي للصفحات

        setCoupons(data.coupons);
      } else {
        toast.error(data.message || "Failed to fetch coupons.");
      }
      setCouponsLoading(false);
    } catch (error) {
      setCouponsLoading(false);
      console.error("Error fetching coupons:", error);
      toast.error("Something went wrong.");
    }
  };
  useEffect(() => {
    fetchCoupons();
  }, [searchTerm, filter, limit, updated, currentPage]);
  useEffect(() => {
    if (selectedCoupon) {
      setName(selectedCoupon.name);
      setExpiryDate(formatDate(selectedCoupon.expiryDate));
      setDiscountPercent(selectedCoupon.discountPercent);
    }
  }, [selectedCoupon]);

  const handleSaveChanges = async () => {
    if (selectedCoupon) {
      // Update the coupon with new values
      const updatedCoupon = {
        ...selectedCoupon,
        name,
        expiryDate,
        discountPercent,
      };
      console.log(updatedCoupon);
      // Here you can handle the updated coupon (send to server, update state, etc.)
      try {
        const res = await fetch(`${APIURL}/coupons/${selectedCoupon._id}`, {
          method: "PUT",
          headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            expiryDate: expiryDate,
            discountPercent: discountPercent,
          }),
        });

        const data = await res.json();
        setIsDialogOpen(false);

        if (!data) {
          return toast.error(
            "Something went wrong try again later. \n (No Response Or Data)"
          );
        }
        if (data && data.message === "Invalid coupon ID.") {
          return toast.error("Invalid coupon ID.");
        }
        if (data && data.message === "Please fill in all required fields.") {
          return toast.error("Please fill in all required fields.");
        }
        if (
          data &&
          data.message ===
            "Discount percent must be a number between 1 and 100."
        ) {
          return toast.error(
            "Discount percent must be a number between 1 and 100."
          );
        }
        if (
          data &&
          data.message === "Expiry date must be a valid future date"
        ) {
          return toast.error("Expiry date must be a valid future date");
        }
        if (
          data &&
          data.message === "Coupon not found or could not be updated."
        ) {
          return toast.error("Coupon not found or could not be updated.");
        }
        if (
          data &&
          data.message === "An error occurred while updating the coupon."
        ) {
          return toast.error("An error occurred while updating the coupon.");
        }

        toast.success("Coupon Updated Successfully.");
        console.log(data);
        setUpdated(!updated);
        return router.refresh();
      } catch (e) {
        setIsDialogOpen(false);

        return console.log(e);
      }
      // Close the dialog after saving
    }
  };
  const handleDelete = async (id: any) => {
    try {
      const res = await fetch(`${APIURL}/coupons/${selectedCoupon?._id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = await res.json();
      setDeleteDialog(false);
      if (!data || !res.ok) {
        return toast.error("Something went wrong, Please try again later.");
      }
      if (data && data.message === "Invalid coupon ID.") {
        return toast.error("Invalid coupon ID.");
      }
      if (data && data.message === "Coupon not found, please try again later") {
        return toast.error("Coupon not found, please try again later");
      }

      console.log(data);
      setUpdated(!updated);
      return toast.success("Coupon Deleted Successfully.");
    } catch (e) {
      setDeleteDialog(false);
      return console.log(e);
    }
  };
  const generatePaginationItems = () => {
    let items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <button
            onClick={() => setCurrentPage(i)}
            className={`px-3 py-1 rounded ${
              currentPage === i
                ? "bg-primary text-white"
                : "bg-secondary hover:bg-primary/20"
            }`}
          >
            {i}
          </button>
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <>
      <div className="flex flex-col gap-7">
        <h2 className="text-2xl text-center font-bold">All Coupons</h2>
        <div className="flex justify-between items-center gap-3">
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
        </div>
        <div
          className={`${"flex justify-center items-center text-center w-full"}`}
        >
          {couponsLoading ? (
            <span className="my-3 flex justify-center items-center px-4 py-24 border border-primary rounded-md text-center w-full text-2xl text-white font-semibold">
              <div className="loader ease-linear rounded-full border-2 border-t-8 border-primary h-12 w-12"></div>
            </span>
          ) : coupons && coupons.length > 0 ? (
            <div className="grid w-full grid-cols-2 gap-6 max-md:grid-cols-1">
              {coupons.map((item: any, i) => (
                <div
                  key={i}
                  className="flex text-left transition-all flex-col gap-2 hover:shadow-md hover:shadow-primary bg-secondary border border-primary rounded-md px-6 py-2"
                >
                  <div className="flex justify-between items-center">
                    <h2>Coupon Name: {item.name}</h2>
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
                        onClick={() => {
                          setSelectedCoupon(item);
                          setDeleteDialog(true);
                        }}
                        className="border border-primary text-white bg-secondary px-3 py-2 shadow-lg
                hover:shadow-red-500 hover:border-transparent hover:shadow-md text-[16px] rounded-md flex
                justify-center items-center transition-all hover:bg-red-500"
                      >
                        <GoTrash />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span>Discount Percent :{item.discountPercent}%</span>
                    <span>Expiry Date: {formatDate(item.expiryDate)}</span>
                    <span>Created By: {item.createdBy.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="my-3 px-4 py-24 border border-primary rounded-md text-center w-full mx-auto text-2xl text-white font-semibold">
              There is no coupon
            </span>
          )}
        </div>

        <Pagination>
          <PaginationPrevious
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <button
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-primary/20"
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </PaginationPrevious>

          <PaginationContent>{generatePaginationItems()}</PaginationContent>

          <PaginationNext
            onClick={() => {
              console.log(currentPage);
              setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              console.log(currentPage);
            }}
          >
            <button
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-primary/20"
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </PaginationNext>
        </Pagination>
      </div>
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="sm:max-w-[425px] bg-[#09090b] border-white/20">
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this coupon?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                setDeleteDialog(false);
              }}
              className="bg-white/95 hover:bg-primary hover:text-white text-black"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                handleDelete(selectedCoupon?._id);
              }}
              className="bg-red-900 hover:bg-red-600 hover:text-white text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#09090b] border-white/20">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
            <DialogDescription>
              Make changes to your coupon here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {selectedCoupon && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="couponName" className="text-right">
                  Coupon Name
                </Label>
                <Input
                  id="couponName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3 bg-[#09090b]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expiryDate" className="text-right">
                  Expiry Date
                </Label>
                <input
                  type="date"
                  id="expiryDate"
                  min={formatDate(addDays(new Date(), 1))} // Set minimum date to tomorrow
                  value={
                    expiryDate
                      ? expiryDate
                      : formatDate(selectedCoupon.expiryDate)
                  }
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const tomorrow = addDays(new Date(), 1);

                    // Ensure selected date is not before tomorrow
                    if (selectedDate < tomorrow) {
                      toast.error("Please select a date from tomorrow onwards");
                      setExpiryDate(formatDate(tomorrow));
                    } else {
                      setExpiryDate(e.target.value);
                    }
                  }}
                  className="col-span-3 text-black border-white border rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discountPer" className="text-right">
                  Discount Percent
                </Label>
                <Input
                  id="discountPer"
                  type="text"
                  value={discountPercent}
                  onChange={(e) => {
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
                      setDiscountPercent(inputValue);
                    } else {
                      toast.error("Discount must be between 0 and 100");
                    }
                  }}
                  onBlur={() => {
                    // When leaving the input, convert to proper number format
                    if (discountPercent) {
                      const numericValue = discountPercent.replace(",", ".");
                      const parsedValue = parseFloat(numericValue);

                      if (parsedValue >= 0 && parsedValue <= 100) {
                        // Convert back to a string with comma as decimal separator
                        setDiscountPercent(
                          parsedValue.toString().replace(".", ",")
                        );
                      } else {
                        setDiscountPercent("");
                        toast.error("Discount must be between 0 and 100");
                      }
                    }
                  }}
                  className="col-span-3 bg-[#09090b]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              onClick={handleSaveChanges}
              className="bg-white/95 hover:bg-primary hover:text-white text-black"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AllCoupons;

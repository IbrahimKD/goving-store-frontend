"use client";
import React, { useEffect, useState } from "react";
import APIURL from "../URL";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/userStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const UserOrdersTable = (props: any) => {
  const user = useUserStore().user;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user) {
      getOrders(1);
    }
  }, [user]);

  const getOrders = async (page: number) => {
    setLoading(true);
    if (user?._id) {
      try {
        const res = await fetch(
          `${APIURL}/user/${user._id}/orders?page=${page}&limit=8`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        const data = await res.json();
        setOrders(data.orders);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.error("Error fetching orders:", e);
      }
    }
  };
  const router = useRouter();
  return (
    <div className="w-[78%] h-full max-md:w-full flex-col flex px-6 max-md:px-2 py-6">
      <h1 className="text-xl font-semibold text-title max-md:px-4">Orders</h1>
      {!loading ? (
        <>
          <Table className="mt-6">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-blue-500">
                  Order No.
                </TableHead>
                <TableHead className="text-yellow-400">
                  Payment Method
                </TableHead>
                <TableHead className="text-purple-500">Date</TableHead>
                <TableHead className="text-green-600">Total</TableHead>
                <TableHead className="text-right text-red-500">
                  Payment Status
                </TableHead>
                <TableHead className="text-right text-red-500">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order: any) => (
                  <TableRow
                    onClick={() => router.push(`/user/orders/${order._id}`)}
                    key={order._id}
                    className="cursor-pointer hover:bg-primary/5 transition-all"
                  >
                    <TableCell className="font-medium text-accent">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="text-indigo-300">
                      {order.paymentMethod}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{`$${Number(order.total).toFixed(
                      2
                    )}`}</TableCell>
                    <TableCell
                      className={`text-center ${
                        order.paymentStatus === "Completed"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {order.paymentStatus}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        order.status === "Pending"
                          ? "text-yellow-500"
                          : order.status === "Resitute"
                          ? "text-purple-600"
                          : order.status === "Cancelled"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {order.status}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No orders
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* أزرار التصفح */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                onClick={() => getOrders(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="mx-2 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => getOrders(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="w-full my-6 flex items-center justify-center">
          <div className="loader ease-linear rounded-full border-2 border-t-8 border-primary h-12 w-12"></div>
        </div>
      )}
    </div>
  );
};

export default UserOrdersTable;

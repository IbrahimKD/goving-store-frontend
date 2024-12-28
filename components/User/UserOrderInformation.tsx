"use client";
import React, { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import IMAGEURL from "../IMAGEURL";
import Link from "next/link";
import { useRouter } from "next/navigation";
import APIURL from "../URL";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const UserOrderInformation = ({ order, fullWidth }: any) => {
  const user = useUserStore().user;
  const [formattedDate, setFormattedDate] = useState<string>("");
  console.log(order);
  useEffect(() => {
    setFormattedDate(new Date(order.createdAt).toLocaleString());
  }, [order.createdAt]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-500";
      case "Processing":
        return "text-blue-500";
      case "Completed":
        return "text-green-500";
      default:
        return "text-red-500";
    }
  };
  const router = useRouter();
 
  return (
    <>
      <div
        className={`${
          fullWidth ? "w-full" : " w-[78%]"
        } h-full max-md:w-full flex-col flex px-6 max-md:px-2 py-6 gap-6`}
      >
        <h1 className="text-xl font-semibold text-title max-md:px-4">
          Order Information #{order.orderNumber}
        </h1>
        {/* Order Details */}
        <div className="grid grid-cols-2 gap-4 bg-gray-800/50 p-4 rounded-lg">
          <div>
            <h2 className="font-semibold mb-2 text-gray-200">Order Details</h2>
            <div className="space-y-2 text-gray-300">
              <p>Order Date: {formattedDate}</p>
              <p>
                Status:{" "}
                <span className={getStatusColor(order.status)}>
                  {order.status}
                </span>
              </p>
              <p>
                Payment Status:{" "}
                <span className={getStatusColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </span>
              </p>
              <p>Payment Method: {order.paymentMethod}</p>
            </div>
          </div>
          <div>
            <h2 className="font-semibold mb-2 text-gray-200">Price Details</h2>
            <div className="space-y-2 text-gray-300">
              <p>Subtotal: ${Number(order.subTotal).toFixed(2)}</p>
              <p>Tax: ${Number(order.taxPrice).toFixed(2)}</p>
              {order.discount > 0 && (
                <p>Discount: ${Number(order.discount).toFixed(2)}</p>
              )}
              <p className="font-semibold text-white">
                Total: ${Number(order.total).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        {/* Order Items */}
        <div className="mt-6">
          <h2 className="font-semibold mb-4 text-gray-200">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div
                key={item._id}
                className="bg-gray-800/50 rounded-lg p-4 flex flex-col md:flex-row gap-4"
              >
                {/* صورة المنتج */}
                <Link
                  href={`/item/${item.item.productId}`}
                  className="flex-shrink-0"
                >
                  <img
                    src={`${IMAGEURL}${item.item.image}`}
                    alt={item.item.title}
                    className="w-full hover:scale-105 hover:opacity-95 transition-all md:w-32 h-32 object-cover rounded-lg"
                  />
                </Link>

                {/* تفاصيل المنتج */}
                <div className="flex-grow space-y-3">
                  {/* اسم المنتج والسعر */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <h3
                      onClick={() =>
                        router.push(`/item/${item.item.productId}`)
                      }
                      className="text-lg cursor-pointer font-medium text-gray-200"
                    >
                      {item.item.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400">
                        Quantity: {item.quantity}
                      </span>
                      <span className="text-lg font-semibold text-gray-200">
                        ${Number(item.totalPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* المدخلات والخصائص */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* المدخلات */}
                    {item.item.inputs.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400 mb-1">Details:</p>
                        {item.item.inputs.map((input: any) => (
                          <div
                            key={input._id}
                            className="flex items-center gap-2 text-gray-300"
                          >
                            <span className="text-gray-400">
                              {input.title}:
                            </span>
                            <span>{input.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* الخصائص */}
                    {item.item.props &&
                      item.item.props.details &&
                      item.item.props.title && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-300">
                            <span>{item.item.props.title}</span>
                            {item.item.props.details && (
                              <>
                                <span className="text-gray-500">•</span>
                                <span>{item.item.props.details.title}</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Payment Information */}
        {order.paymentMethod === "Credit Card" && (
          <div className="mt-6 bg-gray-800/50 p-4 rounded-lg">
            <h2 className="font-semibold mb-4 text-gray-200">
              Payment Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-300">
              <p>Card Holder: {order.paymentDetails.cardHolderName}</p>
              <p>
                Card Number: **** **** ****{" "}
                {String(order.paymentDetails.cardNumber).slice(-4)}
              </p>
            </div>
          </div>
        )}
      </div>
    
    </>
  );
};

export default UserOrderInformation;

"use client";
import APIURL from "@/components/URL";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const OrderStatus = ({ order }: any) => {
  const [deliveryStatus, setDeliveryStatus] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const updateStatus = async () => {
    if (!deliveryStatus) return toast.error("Please select a status");

    setLoading(true);

    try {
      const res = await fetch(`${APIURL}/orders/updateStatus/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          status: deliveryStatus,
        }),
      });

      const data = await res.json();
      console.log(data);
      if (res.ok && data.message) {
        toast.success(data.message);
        router.refresh();
        // إعادة تحميل البيانات أو تحديث الحالة
        // على سبيل المثال:
        // updateOrderState(data.order);
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("An error occurred, please try again");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {" "}
      <hr className="w-full border-0 outline-none bg-primary h-[1px]" />
      <div className="mt-2">
        <div className="flex gap-2 items-center">
          <select
            onChange={(e) => setDeliveryStatus(e.target.value)}
            value={deliveryStatus}
            className="border cursor-pointer border-primary rounded-md px-3 py-2 bg-secondary"
          >
            <option value="">Delivery Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Restitute">Restitute</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => updateStatus()}
            disabled={loading}
            className="bg-secondary border border-primary
                       hover:bg-primary transition-all rounded-md px-7 py-2"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderStatus;

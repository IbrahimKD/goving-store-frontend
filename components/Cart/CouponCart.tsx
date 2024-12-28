import React, { useState } from "react";
import APIURL from "../URL";
import Cookies from "js-cookie";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
type Props = {
  cart: any;
  refreshCart: () => void;
};

const CouponCart = ({ cart, refreshCart }: Props) => {
  const [coupon, setCoupon] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const applyCoupon = async () => {
    if (!cart.cartId || !Cookies.get("token")) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${APIURL}/coupons/applyCoupon`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: coupon,
          cartId: cart.cartId,
        }),
      });
      const data = await res.json();
      refreshCart();
      if (data && data.error) {
        return toast.error(data.error);
      }
      if (data && data.message && data.status !== 200) {
        return toast.error(data.message);
      }
      if (data && data.message && data.status === 200) {
        return toast.success(data.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const removeCoupon = async () => {
    setLoading(true);
    console.log(cart.cartId);
    try {
      const res = await fetch(
        `${APIURL}/cart/removeCouponFromCart/${cart.cartId}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      refreshCart();
      if (data && data.error) {
        return toast.error(data.error);
      }
      if (data && data.message && data.status !== 200) {
        return toast.error(data.message);
      }
      if (data && data.message && data.status === 200) {
        return toast.success(data.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-[#101924] rounded-lg px-5 py-6 flex-col flex gap-y-3">
      <span className="text-title">Have coupon?</span>
      <div className="flex ">
        <input
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          type="text"
          placeholder=" coupon code"
          className="w-full border-l text-sm placeholder:text-[15px] hover:shadow-sm hover:shadow-primary px-2 py-2 outline-none rounded-l-md focus:border-primary bg-[#101924] border-t border-b border-white/15"
        />
        <Button
          disabled={loading}
          onClick={() => applyCoupon()}
          className="bg-primary text-sm px-2 py-1 rounded-r-md"
        >
          Apply
        </Button>
      </div>
      {cart &&
        cart.appliedCoupon &&
        typeof cart.appliedCoupon === "string" &&
        cart.appliedCoupon.trim() !== "" && (
          <Button
            disabled={loading}
            onClick={() => removeCoupon()}
            className="bg-secondary border border-primary hover:bg-red-600 hover:border-transparent text-sm px-2 py-1 rounded-r-md"
          >
            Remove Coupon {`(${cart.appliedCoupon.code})`}
          </Button>
        )}
    </div>
  );
};

export default CouponCart;

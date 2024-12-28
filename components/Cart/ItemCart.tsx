import { CartItem } from "@/app/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import IMAGEURL from "../IMAGEURL";
import APIURL from "../URL";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { useChangeCartItemsCount } from "@/store/useChangeCartItemsCount";
import { FaRegCheckCircle } from "react-icons/fa";

type Props = {
  item: CartItem;
  onDelete: () => void; // Changed from setUpdateItems to onDelete
};

const ItemCart = ({ item, onDelete }: Props) => {
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const qty:number = item.quantity;
  const [quantity, setQuantity] = useState<number | null>(qty);
  const [needUpdate, setNeedUpdate] = useState(false);
  useEffect(() => {
    if (quantity !== item.quantity && needUpdate === false) {
      setNeedUpdate(true);
    } else if (quantity === item.quantity) {
      setNeedUpdate(false);
    }
  }, [quantity]);
  const deleteItemFromCart = async (itemId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${APIURL}/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || data.message || "Failed to delete item");
        return;
      }

      toast.success(data.message || "Item deleted successfully");
      onDelete();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    } finally {
      setLoading(false);
    }
  };
  const updateItemQuantity = async (itemId: string) => {
    setUpdateLoading(true);
    try {
      const res = await fetch(`${APIURL}/cart/${itemId}?quantity=${quantity}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const data = await res.json();
      onDelete();
      setNeedUpdate(false);
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
      setUpdateLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-h-max flex justify-between items-center">
        <div className="flex items-center gap-x-4">
          <Link href={`/item/${item.item?.productId}`}>
            <img
              src={`${IMAGEURL}${item.item.image}`}
              alt={item.item.title}
              className="w-[80px] h-max object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <Link
              href={`/item/${item.item?.productId}`}
              className="hover:text-primary"
            >
              {item.item.title}
            </Link>
            <span className="text-accent text-xs">
              {item.item.price}$ Per one
            </span>
            <div className="flex flex-col">
              {item.item.props && item.item.props.details && (
                <div className="flex flex-col my-2 text-accent">
                  <span className="text-sm">{item.item.props.title}:</span>
                  <span className="text-xs w-max">
                    {item.item.props.details.title}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              {item.item.inputs &&
                item.item.inputs?.length > 0 &&
                item.item.inputs.map((input: any) => (
                  <div key={input.title} className="flex gap-x-1 text-accent">
                    <span className="text-xs">{input.title}:</span>
                    <span className="text-xs">{input.value}</span>
                  </div>
                ))}
            </div>
            <div className="flex gap-x-2 items-center mt-3 text-[13px]">
              <span className="font-bold bg-secondary rounded-md px-1.5 py-0.5">
                X{item.quantity}
              </span>
              <span className="">{item.totalPrice} EUR</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between  gap-3">
          <div className="flex flex-col gap-3 justify-between items-center">
            <div className="flex items-center">
              {needUpdate && (
                <button
                  disabled={updateLoading}
                  onClick={() => updateItemQuantity(item._id)}
                  className="text-2xl hover:text-white hover:scale-105 transition-all text-primary"
                >
                  <FaRegCheckCircle />
                </button>
              )}
              <button
                disabled={loading}
                onClick={() => deleteItemFromCart(item._id)}
                className="text-red-600 text-xl px-2 py-1 rounded-md"
              >
                <AiOutlineDelete />
              </button>
            </div>
            <div className="flex flex-col ">
              <button
                onClick={() => {
                  setQuantity((prev: number) => prev + 1);
                }}
                className="border text-accent hover:bg-white/20
                 active:bg-secondary active:border-primary border-collapse
                  border-white/15 rounded-t-md text-center px-4 py-[3px]"
              >
                +
              </button>
              <span
                className="bg-[#101924] px-4 py-1.5 border hover:border-primary
               border-collapse focus:shadow-md border-white/20 focus:shadow-primary
                transition-all justify-center flex items-center outline-none"
              >
                {quantity}
              </span>
              <button
                onClick={() => {
                  if (quantity > 1) {
                    setQuantity((prev: number) => prev - 1);
                  }
                }}
                className="border text-accent border-collapse hover:bg-white/20
                 active:bg-secondary active:border-primary border-white/15 rounded-b-md 
                 text-center px-4 py-[3px]"
              >
                -
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemCart;

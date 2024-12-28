import Link from "next/link";
import React from "react";

type Props = {
  cartDetails: any;
};

const TotalPrice = ({ cartDetails }: Props) => {
  return (
    <div className="bg-[#101924] rounded-lg  pt-6 flex-col flex gap-y-5">
      <ul className="flex flex-col gap-y-3 px-5">
        <li className="w-full text-[15px] justify-between flex items-center">
          <span>Sub Total:</span>
          <span>
            {cartDetails && cartDetails?.subTotal
              ? Number(cartDetails?.subTotal).toFixed(2)
              : "0"}
            $
          </span>
        </li>
        {cartDetails && cartDetails?.discount ? (
          <>
            {" "}
            <li className="w-full text-[15px] text-green-400 justify-between flex items-center">
              <span>Discount Percent:</span>
              <span>
                -
                {cartDetails && cartDetails?.discount
                  ? cartDetails?.discount.toFixed(2)
                  : "0"}
                %
              </span>
            </li>
            <li className="w-full text-[15px] text-green-400 justify-between flex items-center">
              <span>Discount:</span>
              <span>
                -
                {cartDetails && cartDetails?.discount
                  ? ((cartDetails.total * cartDetails.discount) / 100).toFixed(
                      2
                    )
                  : "0.00"}{" "}
                $
              </span>
            </li>
          </>
        ) : null}
        <li className="w-full  text-yellow-400 text-[15px] justify-between flex items-center">
          <span>VAT:</span>
          <span>
            {cartDetails && cartDetails?.taxPrice
              ? cartDetails?.taxPrice.toFixed(2)
              : "0"}
            $
          </span>
        </li>
        <li className="w-full text-[15px] justify-between flex items-center">
          <span>Total(USD):</span>
          <span>
            {cartDetails && cartDetails?.total
              ? Number(cartDetails?.total).toFixed(2)
              : "0"}
            $
          </span>
        </li>
      </ul>
      <div className="bg-[#161f2a] w-full flex-col flex p-3 py-4 rounded-b-lg">
        {cartDetails && Number(cartDetails?.total) > 0 ? (
          <div className="flex flex-col gap-y-3">
            <Link
              href={"/cart/checkout"}
              className="w-full py-2 text-[15px]  transition-all hover:shadow-md hover:shadow-primary px-6 rounded-md
                  bg-primary text-center border border-primary"
            >
              {`Checkout >`}
            </Link>
            <Link
              href={"/"}
              className="w-full text-center py-2 text-[15px] hover:bg-primary transition-all hover:shadow-2xl hover:shadow-primary px-6 rounded-md border border-primary"
            >
              Conteniue Shopping
            </Link>
          </div>
        ) : (
          <Link
            href={"/"}
            className="w-full text-center py-2 text-[15px] hover:bg-primary transition-all hover:shadow-2xl hover:shadow-primary px-6 rounded-md border border-primary"
          >
            Conteniue Shopping
          </Link>
        )}
      </div>
    </div>
  );
};

export default TotalPrice;

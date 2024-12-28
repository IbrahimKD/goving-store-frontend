import React from 'react'
import { BsCartX } from 'react-icons/bs';

type Props = {}

const EmptyCart = (props: Props) => {
  return (
    <div className="flex flex-col justify-center items-center text-[#434b54] gap-3">
      <BsCartX className="text-4xl " />
      <h2>Your cart is empty</h2>
    </div>
  );
}

export default EmptyCart
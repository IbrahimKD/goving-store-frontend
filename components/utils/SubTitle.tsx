import Link from "next/link";
import React from "react";
import { FaChevronRight } from "react-icons/fa";

type Props = {
  title: string;
  lineColor?: string;
  others?: any;
  buttonURL?: string;
  buttonTitle?: string;
  noRight?: boolean;
};

const SubTitle: React.FC<Props> = ({
  title,
  lineColor,
  others,
  buttonURL,
  buttonTitle,
  noRight,
}) => {
  return (
    <>
      {buttonURL ? (
        <div className="flex flex-wrap justify-between gap-2 items-center">
          <span className={`${others} relative pl-4 capitalize  `}>
            <span
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-full  ${
                lineColor
                  ? lineColor.startsWith("#")
                    ? `bg-[${lineColor}]`
                    : `bg-${lineColor}`
                  : "bg-primary"
              }`}
              style={{ width: "6px" }}
            ></span>
            {title}
          </span>
          <Link
            className="bg-primary px-4 py-2 rounded-md text-sm hover:bg-secondary
                     border border-transparent flex items-center gap-2 hover:border-primary transition-all hover:scale-105"
            href={buttonURL}
          >
            {buttonTitle}
            {!noRight && <FaChevronRight />}
          </Link>
        </div>
      ) : (
        <span className={`${others} relative pl-4 capitalize  `}>
          <span
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-full  ${
              lineColor
                ? lineColor.startsWith("#")
                  ? `bg-[${lineColor}]`
                  : `bg-${lineColor}`
                : "bg-primary"
            }`}
            style={{ width: "6px" }}
          ></span>
          {title}
        </span>
      )}
    </>
  );
};

export default SubTitle;

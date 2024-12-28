import React from "react";

type Props = {
  title: string;
  description: string;
};

const TitleCats = ({ title, description }: Props) => {
  return (
    <div className="bg-[#141c26] max-md:mt-5 border-t border-b border-white/20">
      <div className="max-w-[1200px] flex flex-col mx-auto py-6 gap-y-2.5 px-2">
        <span className="relative pl-6 text-xl text-title capitalize">
          <span
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-full bg-primary`}
            style={{ width: "7px" }}
          ></span>
          {title}
        </span>
        <span className="text-accent pl-6">{description}</span>
      </div>
    </div>
  );
};

export default TitleCats;

import React from "react";

type Props = {};

const AdminPanelContainer = ({ children, title }: any) => {
  return (
    <div className="w-[84%] max-md:mt-5 max-[520px]:px-1 max-md:w-full flex-col flex px-1 py-6">
      <h1 className="text-2xl max-[450px]:text-lg text-center  max-[450px]:px-6 px-10 font-semibold text-title">
        {title}
      </h1>
      <div className="mt-6 max-md:mt-4 min-w-[95%] min-[1100px]:mx-auto mx-0 w-full">
        {children}
      </div>
    </div>
  );
};

export default AdminPanelContainer;

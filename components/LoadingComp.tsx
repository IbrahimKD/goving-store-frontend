import React from 'react'

const LoadingComp = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-secondary z-[5000]">
      <div className="loader ease-linear rounded-full border-2 border-t-8 border-primary h-12 w-12"></div>
    </div>
  );
};

export default LoadingComp;
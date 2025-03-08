import React from 'react'
import AdminHeader from '../AdminHeader'

type Props = {}

const InsideAdminContainer = ({ children }: any) => {
  return <div className="bg-[#101924] flex min-h-[500px]">{children}</div>;
};

export default InsideAdminContainer
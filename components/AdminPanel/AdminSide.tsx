'use server';
import React from 'react'
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminHeaderWrapper from './AdminHeaderWrapper';

type Props = {}

const AdminSide = (props: Props) => {
  return (
    <div dir="ltr relative">
      <AdminSidebar />
      <AdminHeaderWrapper />
    </div>
  );
}

export default AdminSide
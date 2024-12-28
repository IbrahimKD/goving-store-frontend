"use client";
import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { BiSearch, BiExport, BiEdit, BiTrash } from "react-icons/bi";
import Pagination from "./Pagination";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Link from "next/link";
import APIURL from "@/components/URL";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import WebsiteName from "@/components/utils/WebsiteName";

interface Order {
  _id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  orderDeliveryDate: string;
  total: string;
  deliveryStatus: string;
  payment: string;
}

interface Column {
  Header: string;
  accessor: keyof Order | string;
}

const AllOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deliveryStatus, setDeliveryStatus] = useState<string>("all");
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fixed page size to 2
  const pageSize = 2;

  const columns: Column[] = [
    { Header: "Order Number", accessor: "orderNumber" },
    { Header: "Customer", accessor: "customerName" },
    { Header: "Delivery Date", accessor: "orderDeliveryDate" },
    { Header: "Total", accessor: "total" },
    { Header: "Delivery Status", accessor: "deliveryStatus" },
    { Header: "Payment", accessor: "payment" },
    { Header: "Actions", accessor: "actions" },
  ];

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${APIURL}/orders?page=${currentPage}&limit=${pageSize}&search=${searchTerm}&filter=${deliveryStatus}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return toast.error("Something went wrong, try again later.");
      }

      setOrders(data.orders || []);
      setTotalPages(data.totalPages);
    } catch (e) {
      console.error("Fetch Orders Error:", e);
      toast.error("Failed to fetch orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search function
  const debounceTimeout = useRef<NodeJS.Timeout>();
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setCurrentPage(1);
    }, 500);
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, deliveryStatus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const router = useRouter();
  const handleEdit = (id: string) => {
    router.push(`/admin/orders/${id}`);
  };

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (confirmDelete) {
      fetch(`${APIURL}/orders/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            fetchOrders();
            toast.success("Order deleted successfully");
          }
        })
        .catch((error) => {
          toast.error(error.message || "Failed to delete order");
          console.error("Failed to delete order:", error);
        });
    }
  };

  const handleDeliveryStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDeliveryStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleExportToXLSX = () => {
    const exportData = orders.map((order) => ({
      "Order Number": order.orderNumber,
      Customer: order.customerName,
      "Delivery Date": format(new Date(order.orderDeliveryDate), "dd.MM.yyyy"),
      Total: `$${Number(order.total).toFixed(2)}`,
      Status: order.deliveryStatus,
      Payment: order.payment,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "orders.xlsx");
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A4",
    });

    const tableColumns = columns
      .filter((col) => col.accessor !== "actions")
      .map((col) => col.Header);

    const tableData = orders.map((order) => [
      order.orderNumber,
      order.customerName,
      format(new Date(order.orderDeliveryDate), "dd.MM.yyyy"),
      `$${Number(order.total).toFixed(2)}`,
      order.deliveryStatus,
      order.payment,
    ]);

    const currentDate = format(new Date(), "dd.MM.yyyy");

    doc.autoTable({
      head: [tableColumns],
      body: tableData,
      startY: 50,
      theme: "grid",
      styles: {
        fillColor: [45, 45, 45],
        textColor: 255,
        fontSize: 10,
        cellPadding: 5,
      },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 100 },
        2: { cellWidth: 100 },
        3: { cellWidth: 100 },
        4: { cellWidth: 100 },
        5: { cellWidth: 100 },
      },
      margin: { top: 30 },
      didDrawPage: function (data: any) {
        doc.setFontSize(14);
        doc.text("Order Details", data.settings.margin.left, 40);

        const pageHeight = doc.internal.pageSize.height;
        const footerText = `Printed from: www.${WebsiteName.toLowerCase()}.com | Date: ${currentDate} | Website: ${WebsiteName}`;

        doc.setFontSize(10);
        doc.text(footerText, data.settings.margin.left, pageHeight - 20);
      },
    });

    doc.save("orders.pdf");
  };

  return (
    <div className="bg-gray-900 w-full pb-36 text-gray-300 p-8 max-md:p-2 max-md:py-12">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>

      <div className="flex items-center mb-4 space-x-4">
        <input
          type="text"
          placeholder="Search by order number..."
          value={searchTerm}
          onChange={handleSearch}
          className="bg-gray-800 border-gray-700 text-gray-300 px-4 py-2 rounded-md w-full"
        />
        <select
          value={deliveryStatus}
          onChange={handleDeliveryStatusChange}
          className="bg-gray-800 border-gray-700 text-gray-300 px-4 py-2 rounded-md"
        >
          <option value="all">All</option>
          <option value="Pending">Pending</option>
          <option value="Complete">Complete</option>
          <option value="Canceled">Canceled</option>
        </select>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="flex items-center bg-gray-800 border-gray-700 text-gray-300 px-4 py-2 rounded-md"
          >
            <span>Export</span>
            <BiExport className="ml-2" />
          </button>

          {isExportMenuOpen && (
            <div className="absolute mt-2 right-0 bg-gray-800 border border-gray-700 rounded-md shadow-lg w-48">
              <button
                onClick={handleExportToXLSX}
                className="block px-4 py-2 text-left text-gray-300 hover:bg-gray-700 w-full"
              >
                Export to XLSX
              </button>
              <button
                onClick={handleExportToPDF}
                className="block px-4 py-2 text-left text-gray-300 hover:bg-gray-700 w-full"
              >
                Export to PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="bg-gray-800 text-gray-500">
                {columns.map((column) => (
                  <th
                    key={column.accessor}
                    className="px-4 py-3 text-left font-medium"
                  >
                    {column.Header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`border-b border-gray-700 ${
                    index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                  }`}
                >
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.orderId}`}>
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 max-w-[140px] overflow-hidden text-ellipsis">
                    {order.customerName}
                  </td>
                  <td className="px-4 py-3">
                    {format(new Date(order.orderDeliveryDate), "dd.MM.yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">{order.deliveryStatus}</td>
                  <td className="px-4 py-3">{order.payment}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(order._id)}>
                        <BiEdit className="text-blue-500 text-xl" />
                      </button>
                      <button onClick={() => handleDelete(order._id)}>
                        <BiTrash className="text-red-500 text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center w-full mt-4">
        <Pagination
          currentPageIndex={currentPage - 1}
          pageRowCount={pageSize}
          totalRows={totalPages * pageSize}
          onPageChange={(pageIndex: number) => setCurrentPage(pageIndex + 1)}
          onPageSizeChange={null} // Removed page size changing since we want fixed size of 2
        />
      </div>
    </div>
  );
};

export default AllOrders;

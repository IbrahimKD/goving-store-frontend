"use client";
import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, UserX, MapPin, Search, ChevronDown } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Cookies from "js-cookie";
import APIURL from "@/components/URL";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ConfirmModal from "../ConfirmModel";

const DynamicAccordion = dynamic(
  () =>
    import("@/components/ui/accordion").then((mod) => ({
      default: mod.Accordion,
    })),
  { loading: () => <p>Loading...</p>, ssr: false }
);

// تعديل مكون AddressCard ليتناسب مع هيكل البيانات الجديد
const AddressCard = memo(({ address }: any) => (
  <motion.div
    key={address._id}
    className="mb-2 p-2 bg-secondary rounded shadow-sm hover:shadow-md transition-shadow"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <p className="text-sm">Address Line1: {address.addressLine1}</p>
    <p className="text-sm">Address Line2: {address.addressLine2}</p>
    <p className="text-sm">
      Building House Number: {address.buildingHouseNumber}
    </p>
    <p className="text-sm">
      City:{address.city}, Country:{address.country}
    </p>
    <p className="text-sm">Phone Number: {address.phone}</p>
  </motion.div>
));

// تعديل مكون UserItem ليتناسب مع هيكل البيانات الجديد
const UserItem = memo(({ user, fetchUsers }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const deleteUser = async (id: string) => {
    try {
      const res = await fetch(`${APIURL}/user/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const data = await res.json();
      if (res.status === 200) {
        toast.success(data.message || "User deleted successfully");
        router.refresh();
        await fetchUsers();
      } else {
        toast.error(data.message || "Error deleting user");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // منع انتشار الحدث
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteUser(user._id);
    setIsModalOpen(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // منع انتشار الحدث
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AccordionItem
      value={`user-${user._id}`}
      className="border-b border-primary/20"
    >
      <div className="hover:bg-primary/5 px-4 py-2 rounded-t-lg">
        <div
          onClick={toggleAccordion}
          className="flex items-center justify-between w-full cursor-pointer"
        >
          <motion.div
            className="flex items-center justify-between w-full"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-primary">{user.name}</span>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {user.ordersCount} orders
              </Badge>
              <Badge variant={user.active ? "success" : "destructive"}>
                {user.active ? "Active" : "Blocked"}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div
                onClick={handleDeleteClick}
                className="p-2 rounded-full hover:bg-red-500/10 text-red-500 cursor-pointer"
              >
                <UserX className="h-4 w-4" />
              </div>
              <Link
                href={`/admin/users/edit-user/${user._id}`}
                onClick={handleEdit}
                className="p-2 rounded-full hover:bg-primary/10 text-primary"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-primary"
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {isOpen && (
        <AccordionContent className="px-4 py-2 bg-primary/5 rounded-b-lg">
          <motion.div
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm text-gray-600">Email: {user.email}</p>
          </motion.div>
          <div>
            <h4 className="font-semibold text-primary mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" /> Addresses
            </h4>
            {user.addresses ? (
              user.addresses.map((address: any) => (
                <AddressCard key={address._id} address={address} />
              ))
            ) : (
              <p>No Addresses</p>
            )}
          </div>
        </AccordionContent>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </AccordionItem>
  );
});

const UsersList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_PAGE = 6;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        search: searchTerm,
        status: filter, // إرسال الفلتر هنا
      });

      const res = await fetch(`${APIURL}/user/getAllUsers?${queryParams}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = await res.json();
      console.log(data);
      setUsers(data.users);
      setTotalUsers(data.totalUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, filter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = useCallback((e: any) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((value: any) => {
    setFilter(value);
    setCurrentPage(1);
  }, []);

  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Users List
        </CardTitle>
        <div className="flex space-x-4 mt-4">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active Users</SelectItem>
              <SelectItem value="blocked">Blocked Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="mx-auto my-12 w-full flex justify-center items-center">
            <div className="loader ease-linear rounded-full border-2 border-t-8 border-primary h-12 w-12"></div>
          </div>
        ) : users ? (
          <DynamicAccordion>
            {users.map((user) => (
              <UserItem key={user?._id} user={user} fetchUsers={fetchUsers} />
            ))}
          </DynamicAccordion>
        ) : (
          ""
        )}
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default UsersList;

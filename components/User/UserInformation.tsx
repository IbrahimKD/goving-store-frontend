"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineMail, MdOutlinePersonPin } from "react-icons/md";
 import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import LoadingComp from "../LoadingComp";
import { useUserStore } from "@/store/userStore";
import APIURL from "../URL";

const UserInformation = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pLoad, setPLoad] = useState(true);

  const router = useRouter();
  const token = Cookies.get("token");
  const user = useUserStore().user;
  const setUser = useUserStore().setUser;
  useEffect(() => {
    const loadUserData = () => {
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone);
      }
    };

    loadUserData();
    setPLoad(false); // Update loading state after data is loaded
  }, [user]);

  // Function to update user data
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${APIURL}/user/${user?._id}`,
        {
          method: "PUT",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, phone }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update user");
        setLoading(false);
        return;
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
      setIsDialogOpen(false);
      setLoading(false);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while updating the profile.");
      setLoading(false);
      setIsDialogOpen(false);
    }
  };
  const handleLogout = () => {
    // الحصول على دالة clearUser من المتجر
    const clearUser = useUserStore.getState().clearUser;

    // إزالة التوكن من localStorage و Cookies
    localStorage.removeItem("token");
    Cookies.remove("token");

    // مسح بيانات المستخدم
    clearUser();

    // تحديث الواجهة
    router.refresh(); // إذا كنت تستخدم Next.js، هذه الطريقة قد تكون كافية لتحديث الواجهة
  };
  if (pLoad) {
    return <LoadingComp />;
  }

  return (
    <div className="w-[79%] max-[520px]:px-1 max-md:w-full flex-col flex px-10 py-6">
      <h1 className="text-xl font-semibold text-title">Personal Information</h1>
      <div className="mt-16 max-md:mt-5">
        <ul>
          <li className="w-full flex-wrap justify-between items-center border-b border-white/20 py-4 px-2 flex flex-grow">
            <span className="flex gap-2 items-center w-3/6 text-title text-sm justify-start">
              <MdOutlinePersonPin className="text-accent text-xl" /> Full Name
            </span>
            <span className="flex justify-start items-start text-accent text-sm flex-grow">
              {user?.name || "N/A"}
            </span>
          </li>
          <li className="w-full justify-between items-center border-b border-white/20 py-4 px-2 flex flex-grow">
            <span className="flex gap-2 items-center w-3/6 text-title text-sm justify-start">
              <MdOutlineMail className="text-accent text-xl" /> Email
            </span>
            <span className="flex justify-start items-start text-accent text-sm flex-grow">
              {user?.email || "N/A"}
            </span>
          </li>
          <li className="w-full justify-between items-center border-b border-white/20 py-4 px-2 flex flex-grow">
            <span className="flex gap-2 items-center w-3/6 text-title text-sm justify-start">
              <FaPhoneAlt className="text-accent text-lg" /> Phone Number
            </span>
            <span className="flex justify-start items-start text-accent text-sm flex-grow">
              {user?.phone || "N/A"}
            </span>
          </li>
        </ul>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="flex gap-3">
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="max-w-[200px] bg-primary mt-5"
              onClick={() => setIsDialogOpen(true)}
            >
              Edit Profile
            </Button>
          </DialogTrigger>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="max-w-[200px] bg-red-500 mt-5"
          >
            Logout
          </Button>
        </div>
        <DialogContent className="sm:max-w-[425px] bg-[#09090b] border-white/20">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 bg-[#09090b]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3 bg-[#09090b]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => {
                  let inputValue = e.target.value;

                  // إذا كانت المدخلة فارغة، تعيين القيمة الافتراضية "+"
                  if (inputValue === "") {
                    setPhone("+");
                    return;
                  }

                  // السماح بإضافة علامة "+" فقط في البداية
                  if (inputValue[0] !== "+") {
                    inputValue = "+" + inputValue;
                  }

                  // السماح بأرقام ومسافتين فقط بين الأرقام بعد علامة "+"
                  const validInput = inputValue
                    .replace(/[^0-9 ]/g, "")
                    .replace(/( {2,})/g, " ");

                  // تحديد الحد الأقصى لعدد الأرقام والمسافات
                  if (validInput.length > 18) return;

                  setPhone("+" + validInput);
                }}
                className="col-span-3 bg-[#09090b]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={loading}
              type="button"
              onClick={handleUpdate}
              className="bg-white/95 hover:bg-primary hover:text-white text-black"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserInformation;

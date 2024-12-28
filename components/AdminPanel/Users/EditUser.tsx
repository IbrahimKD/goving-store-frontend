"use client";
import React, { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import APIURL from "@/components/URL";
// import AvatarEditor from "react-avatar-editor";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
type Props = {
  _id: string;
  name: string;
  email: string;
  active: boolean;
  password: string;
  addresses: Address[];
  phone: string;
  role: string;
  image: string;
};
type Address = {
  phone: string;
  city: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  buildingHouseNumber: string;
};

const EditUser = (props: Props) => {
  const [name, setName] = useState<string>(props.name);
  const [email, setEmail] = useState<string>(props.email);
  const [phone, setPhone] = useState(props.phone);
  const [inActive, setInActive] = useState<string | boolean>(
    props.active === true ? "true" : "false"
  );
  const [password, setPassword] = useState<string>(props.password);
  const [addresses, setAddresses] = useState<Address[]>(props.addresses);
  const [role, setRole] = useState<string>(props.role);
  const [loading, setLoading] = useState(false);

  // const [avatar, setAvatar] = useState<string | null>(props.image);
  // const [avatarScale, setAvatarScale] = useState(1);
  // const editorRef = useRef<AvatarEditor>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteAddress = (index: number) => {
    if (addresses.length > 1) {
      const newAddresses = addresses.filter((_, i) => i !== index);
      setAddresses(newAddresses);
    }
  };

  const handleAddAddress = () => {
    setAddresses([
      ...(addresses || []), // إذا كانت addresses غير موجودة، استخدم مصفوفة فارغة
      {
        phone: "",
        city: "",
        country: "",
        addressLine1: "",
        addressLine2: "",
        buildingHouseNumber: "",
      },
    ]);
  };

  const handleAddressChange = (
    index: number,
    field: keyof Address,
    value: string
  ) => {
    // تأكد من أن addresses موجودة وتحتوي على قيم قبل النسخ
    let newAddresses = addresses ? [...addresses] : [];

    // تحقق مما إذا كان العنصر المطلوب موجودًا في المصفوفة
    if (newAddresses[index]) {
      newAddresses[index] = {
        ...newAddresses[index],
        [field]: value,
      };
    }

    setAddresses(newAddresses);
  };
  const router = useRouter();

  console.log(props);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    // التأكد من أن active هي قيمة Boolean
    const activeStatus = inActive === "true";

    // التحقق مما إذا كانت البيانات قد تم تعديلها
    const isDataChanged =
      email !== props.email ||
      name !== props.name ||
      password !== props.password ||
      activeStatus !== props.active ||
      JSON.stringify(addresses) !== JSON.stringify(props.addresses) ||
      role !== props.role ||
      phone !== props.phone;

    // إذا لم يتم تعديل البيانات، عرض إشعار بعدم وجود تغييرات
    if (!isDataChanged) {
      toast.warn("No data has been edited");
      return;
    }

    try {
      console.log(phone);
      // إرسال الطلب إلى السيرفر لتحديث بيانات المستخدم إذا تم التعديل
      const res = await fetch(`${APIURL}/user/updateUser/${props._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          email,
          name,
          password,
          active: activeStatus,
          phone: phone,
          addresses,
          role,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (data.status === 200) {
        setLoading(false)
        router.refresh();
        // في حالة نجاح التحديث، عرض إشعار نجاح
        toast.success("User data has been edited successfully!");
      } else {
        setLoading(false)
        // إذا كان هناك خطأ، الحصول على الرسالة من الاستجابة وعرضها
        const errorData = await res.json();
        toast.error(
          `A problem occured: ${errorData.message || "Please try again later"}`
        );
      }
    } catch (error) {
      setLoading(false)
      // في حالة حدوث خطأ غير متوقع، عرض رسالة خطأ عامة
      toast.error("Unexpected problem occured , please try again later");
      console.log(error);
    }
  };

  // const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setAvatar(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleAvatarDoubleClick = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };
  return (
    <form
      className="flex flex-col gap-6 px-12 py-6 w-full"
      onSubmit={handleSubmit}
    >
      <div className="flex gap-6 items-center w-full">
        <div className="w-2/4 flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div className="w-2/4 flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
      </div>
      {/* <div className="flex flex-col mt-4 items-center gap-4">
        <Label htmlFor="avatar" className="text-lg text-white px-0.5">
          User Avatar
        </Label>
        <input
          type="file"
          id="avatar"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          accept="image/*"
          className="hidden"
        />
        <div
          className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed
           border-gray-300 rounded-full cursor-pointer bg-transparent transition duration-150 ease-in-out"
          onDoubleClick={handleAvatarDoubleClick}
        >
          {avatar ? (
            <AvatarEditor
              ref={editorRef}
              image={avatar}
              width={128}
              height={128}
              border={0}
              borderRadius={64}
              color={[255, 255, 255, 0.6]}
              scale={avatarScale}
              rotate={0}
            />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="text-gray-500 text-sm text-center">
                Double-click to upload avatar
              </span>
            </div>
          )}
        </div>
        {avatar && (
          <input
            type="range"
            min="1"
            max="2"
            step="0.01"
            value={avatarScale}
            onChange={(e) => setAvatarScale(parseFloat(e.target.value))}
            className="w-full max-w-xs"
          />
        )}
      </div> */}

      <div className="flex gap-6 items-center w-full">
        <div className="w-2/4 flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type="text"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div className="w-2/4 flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>

          <Select value={inActive} onValueChange={setInActive}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className="bg-black">
              <SelectItem value={"true"} className="cursor-pointer bg-black">
                Active
              </SelectItem>
              <SelectItem value="false" className="cursor-pointer bg-black">
                Blocked
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-6 items-center w-full">
        <div className="w-2/4 flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone Numbre</Label>
          <Input
            type="text"
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
            placeholder="Phone Number"
          />
        </div>
        <div className="w-2/4 min-w-[200px] flex flex-col gap-1.5">
          <Label htmlFor="status">User Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className="bg-black">
              <SelectItem value={"user"} className="cursor-pointer bg-black">
                User
              </SelectItem>
              <SelectItem value="admin" className="cursor-pointer bg-black">
                Admin
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 flex flex-col">
        <Label>Addresses</Label>
        {addresses && addresses.length > 0 ? (
          addresses.map((address, index) => (
            <Card key={index} className="relative">
              {addresses.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 w-[32px] h-[29px] bg-red-500 right-2"
                  onClick={() => handleDeleteAddress(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <CardContent className="space-y-2 pt-4">
                <h1>Add a new address</h1>
                <Input
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) =>
                    handleAddressChange(index, "country", e.target.value)
                  }
                  required
                />
                <Input
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    handleAddressChange(index, "city", e.target.value)
                  }
                />
                <Input
                  placeholder="First Address"
                  value={address.addressLine1}
                  onChange={(e) =>
                    handleAddressChange(index, "addressLine1", e.target.value)
                  }
                />
                <Input
                  placeholder="Second Address"
                  value={address.addressLine2}
                  onChange={(e) =>
                    handleAddressChange(index, "addressLine2", e.target.value)
                  }
                />
                <Input
                  placeholder="Building and house number"
                  value={address.buildingHouseNumber}
                  onChange={(e) =>
                    handleAddressChange(
                      index,
                      "buildingHouseNumber",
                      e.target.value
                    )
                  }
                />
                <Input
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={(e) =>
                    handleAddressChange(index, "phone", e.target.value)
                  }
                />
              </CardContent>
            </Card>
          ))
        ) : (
          <span>No addresses</span>
        )}
        <Button
          type="button"
          className="max-w-[210px]"
          onClick={handleAddAddress}
        >
          Add address
        </Button>
      </div>
      <Button type="submit" disabled={loading}>
        {" "}
        {!loading ? (
          "Edit User"
        ) : (
          <div className="loader ease-linear rounded-full border-2 border-t-8 border-white h-6 w-6"></div>
        )}
      </Button>
    </form>
  );
};

export default EditUser;

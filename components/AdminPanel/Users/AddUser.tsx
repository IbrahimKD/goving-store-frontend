'use client'
import React, { useState } from "react";
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
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Props = {};
type Address = {
  phone: string;
  city: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  buildingHouseNumber: string;
};

const AddUser = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("+");
  const [active, setActive] = useState<string>("true");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [addresses, setAddresses] = useState<Address[]>([
    {
      phone: "",
      city: "",
      country: "",
      addressLine1: "",
      addressLine2: "",
      buildingHouseNumber: "",
    },
  ]);
  const [loading,setLoading] = useState(false)

  const router = useRouter();

  const handleDeleteAddress = (index: number) => {
    if (addresses.length > 1) {
      const newAddresses = addresses.filter((_, i) => i !== index);
      setAddresses(newAddresses);
    }
  };

  const handleAddAddress = () => {
    setAddresses([
      ...addresses,
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
    const newAddresses = [...addresses];
    newAddresses[index] = {
      ...newAddresses[index],
      [field]: value,
    };
    setAddresses(newAddresses);
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true)
  // تحقق مما إذا كانت جميع الحقول في العنوان فارغة
  const areAllAddressesEmpty =
    addresses &&
    addresses.length > 0 &&
    addresses.every(
      (addr) =>
        !addr.addressLine1 &&
        !addr.addressLine2 &&
        !addr.buildingHouseNumber &&
        !addr.city &&
        !addr.country &&
        !addr.phone
    );

  try {
    const res = await fetch(`${APIURL}/user/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({
        email,
        name,
        password,
        active: active === "true",
        phone: phone,
        addresses: areAllAddressesEmpty ? [] : addresses, // أرسل مصفوفة فارغة إذا كانت جميع الحقول فارغة
        role: role || "user",
      }),
    });

    const data = await res.json();

    if (data.message === "This email is already in use.") {
      return toast.error("This email is already in use.");
    }

    if (data.status === 201) {
      router.refresh();
      toast.success("User has been created successfully!");

      // Reset form
      setName("");
      setEmail("");
      setPhone("+");
      setActive("true");
      setPassword("");
      setRole("user");
      setAddresses([
        {
          phone: "",
          city: "",
          country: "",
          addressLine1: "",
          addressLine2: "",
          buildingHouseNumber: "",
        },
      ]);
      setLoading(false)
    } else {
      setLoading(false)
      toast.error(`Error: ${data.message || "Please try again later"}`);
    }
  } catch (error) {
    setLoading(false)
    toast.error("Unexpected error occurred, please try again later");
    console.error(error);
  }
};



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

      <div className="flex gap-6 items-center w-full">
        <div className="w-2/4 flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div className="w-2/4 flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select value={active} onValueChange={setActive}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className="bg-black">
              <SelectItem value="true" className="cursor-pointer bg-black">
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
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            type="text"
            id="phone"
            required
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
        <div className="w-2/4 flex flex-col gap-1.5">
          <Label htmlFor="role">User Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent className="bg-black">
              <SelectItem value="user" className="cursor-pointer bg-black">
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
        {addresses.map((address, index) => (
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
        ))}
        <Button
          type="button"
          className="max-w-[210px]"
          onClick={handleAddAddress}
        >
          Add address
        </Button>
      </div>
      <Button type="submit" disabled={loading}>
        {!loading ? (
          "Add User"
        ) : (
          <div className="loader ease-linear rounded-full border-2 border-t-8 border-white h-6 w-6"></div>
        )}
      </Button>
    </form>
  );
};

export default AddUser;

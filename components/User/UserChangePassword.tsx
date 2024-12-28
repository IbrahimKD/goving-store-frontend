'use client'
import React, { useState } from "react";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import APIURL from "../URL";
type Props = {};

const UserChangePassword = (props: Props) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate new passwords match
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    // Call the change password API
    try {
      const response = await fetch(`${APIURL}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get('token')}`, // Adjust based on your auth strategy
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message);
      } else {
        setSuccessMessage(data.message);
        // Clear input fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (error) {
      setErrorMessage("Failed to change password. Please try again.");
    }
  };

  return (
    <div className="w-[77%] max-[560px]:px-3 max-[380px]:px-1 max-md:w-full flex-col flex px-10 py-6">
      <h1 className="text-xl font-semibold text-title">Security Settings</h1>
      <div className="mt-16 max-[560px]:mt-8 border max-[380px]:px-3 rounded-md border-white/10 flex-col px-6 py-8 w-full flex">
        <h2 className="text-xl">Change Password</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <form className="mt-5 flex flex-col gap-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="currentPassword"
              className="text-sm text-accent px-0.5"
            >
              Current Password
            </label>
            <input
              type="password"
              placeholder="Current Password"
              className="w-full bg-[#101924] text-sm px-4 py-2 focus:shadow-sm focus:shadow-primary focus:border-primary outline-none border border-white/10 rounded-md"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="newPassword" className="text-sm text-accent px-0.5">
              New Password
            </label>
            <input
              type="password"
              placeholder="New Password"
              className="w-full bg-[#101924] text-sm px-4 py-2 focus:shadow-sm focus:shadow-primary focus:border-primary outline-none border border-white/10 rounded-md"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmNewPassword"
              className="text-sm text-accent px-0.5"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full bg-[#101924] text-sm px-4 py-2 focus:shadow-sm focus:shadow-primary focus:border-primary outline-none border border-white/10 rounded-md"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          <Button
            variant="destructive"
            className="max-w-[200px] hover:shadow-sm active:border-primary border border-white/0 active:bg-[#101924] hover:shadow-primary bg-primary mt-1"
            type="submit"
          >
            Change Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserChangePassword;

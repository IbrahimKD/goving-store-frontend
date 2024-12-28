import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const ConfirmModal = ({ isOpen, onClose, onConfirm }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        className="bg-secondary rounded-lg p-6 w-96"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <h2 className="text-lg font-bold">
          Are you sure you want to delete this user?
        </h2>
        <p className="text-red-600">
          Warning: You cannot recover the data after deletion.
        </p>
        <div className="mt-4 flex justify-between">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-red-500 hover:opacity-80 transition-all" variant="destructive">
            Delete
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmModal;

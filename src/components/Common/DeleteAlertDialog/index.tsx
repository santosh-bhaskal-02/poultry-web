"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface DialogBoxProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

const DeleteAlertDialog: React.FC<DialogBoxProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent
        className={cn(
          "rounded-2xl shadow-2xl border border-gray-200 bg-white max-w-sm w-full transition-all duration-300 ease-in-out transform scale-100 animate-in fade-in-0 zoom-in-95"
        )}>
        {/* Header with Icon */}
        <div className="flex flex-col items-center justify-center text-center py-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-3 shadow-sm">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-gray-900">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-sm leading-relaxed mt-2 px-2">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        {/* Footer Buttons */}
        <AlertDialogFooter className="flex justify-center gap-3 mt-4 pb-2">
          <AlertDialogCancel asChild>
            <Button
              onClick={onClose}
              variant="outline"
              className="rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100 transition-all px-5">
              Cancel
            </Button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 px-5">
              <AlertTriangle className="w-4 h-4" />
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>

        {/* Close Button (top-right corner) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlertDialog;

"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlertBoxProps {
  open: boolean;
  type?: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
}

const AlertBox: React.FC<AlertBoxProps> = ({
  open,
  type = "success",
  title,
  message,
  onClose,
}) => {
  const isSuccess = type === "success";

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent
        className={cn(
          "relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl border-t-4 z-[60]",
          isSuccess ? "border-green-500" : "border-red-500"
        )}>
        {/* Icon */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          {isSuccess ? (
            <CheckCircle2 className="w-14 h-14 text-green-500 bg-white rounded-full p-2 shadow-md" />
          ) : (
            <AlertTriangle className="w-14 h-14 text-red-500 bg-white rounded-full p-2 shadow-md" />
          )}
        </div>

        {/* Content */}
        <AlertDialogHeader className="mt-8 text-center space-y-2">
          <AlertDialogTitle className="text-lg font-semibold text-gray-800">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 text-sm">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogAction asChild>
            <Button
              onClick={onClose}
              className={cn(
                "w-full py-3 rounded-xl font-medium transition duration-300",
                isSuccess
                  ? "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400"
                  : "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400"
              )}>
              {isSuccess ? "Continue" : "Go Back"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertBox;

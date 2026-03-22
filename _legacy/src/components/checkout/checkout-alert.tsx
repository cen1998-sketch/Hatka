"use client";

import { Clock } from "lucide-react";

interface CheckoutAlertProps {
  message: string;
}

export function CheckoutAlert({ message }: CheckoutAlertProps) {
  return (
    <div className="w-full p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
        <Clock className="w-4 h-4 text-green-600" />
      </div>
      <p className="text-green-900 text-sm font-medium">{message}</p>
    </div>
  );
}

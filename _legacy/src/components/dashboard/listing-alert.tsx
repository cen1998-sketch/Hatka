"use client";

interface ListingAlertProps {
  title: string;
  description: string;
}

export function ListingAlert({ title, description }: ListingAlertProps) {
  return (
    <div className="w-full p-6 bg-red-50 border border-red-100 rounded-xl flex flex-col gap-1.5">
      <p className="text-red-900 text-sm font-semibold leading-5">{title}</p>
      <p className="text-red-900/70 text-xs font-medium leading-4">
        {description.split("настройках отеля")[0]}
        <button className="text-red-900 underline hover:no-underline">настройках отеля</button>
        {description.split("настройках отеля")[1]}
        {" "}
        <button className="text-red-900 underline hover:no-underline font-semibold leading-3 border-b border-red-900/30">Единому Реестру</button>
      </p>
    </div>
  );
}

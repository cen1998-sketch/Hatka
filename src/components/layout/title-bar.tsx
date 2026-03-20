"use client";

import { Filter, ChevronDown } from "lucide-react";

export function TitleBar() {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-3 mb-8">
      <div className="w-full inline-flex justify-start items-start">
        {/* Left side: Title */}
        <div className="w-80 flex justify-start items-center gap-2.5">
          <h2 className="text-neutral-950 text-4xl font-normal leading-9">Все хатки</h2>
        </div>

        {/* Right side: Tabs & Counter & Sorting */}
        <div className="flex-1 flex justify-between items-center">
          <div className="flex justify-start items-center gap-4">
            {/* Rental Duration Tabs */}
            <div className="h-11 p-0.5 bg-white rounded-2xl flex justify-center items-center shadow-sm">
              <button className="h-full px-4 py-1 bg-gray-200 rounded-2xl inline-flex flex-col justify-center items-center gap-2.5 transition-colors">
                <span className="text-neutral-950 text-sm font-medium leading-5">Посуточно</span>
              </button>
              <button className="h-full px-4 py-1 rounded-md inline-flex flex-col justify-center items-center gap-2.5 hover:bg-gray-50 transition-colors">
                <span className="text-foreground text-sm font-medium leading-5">Долгосрочно</span>
              </button>
            </div>

            {/* Total Count */}
            <div className="text-neutral-400 text-lg font-medium leading-7">130</div>

            {/* Filter Toggle Icon Button */}
            <button className="h-11 px-3.5 bg-white rounded-2xl flex justify-center items-center gap-1.5 shadow-sm hover:bg-gray-50 transition-all active:scale-95 group">
              <Filter className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Sorting / Viewed Dropdown */}
          <div className="h-11 pl-4 pr-3 py-2 bg-white rounded-2xl flex justify-start items-center gap-1.5 overflow-hidden shadow-sm hover:bg-gray-50 cursor-pointer transition-all">
            <span className="text-foreground text-sm font-medium leading-5">Просмотренные</span>
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

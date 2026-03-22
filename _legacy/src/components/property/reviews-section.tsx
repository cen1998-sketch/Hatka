"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
  userName: string;
  avatarColor: string;
  avatarLetter: string;
  date: string;
  stayDuration: string;
  pros: string;
  cons: string;
  timeAgo: string;
  hostReply?: {
    text: string;
    timeAgo: string;
  };
}

interface ReviewsSectionProps {
  rating: string;
  count: number;
  items: Review[];
}

export function ReviewsSection({ rating, count, items }: ReviewsSectionProps) {
  return (
    <div className="flex-1 p-6 bg-white rounded-xl flex flex-col gap-5 overflow-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-neutral-950 text-xl font-semibold leading-7">Отзывы</h2>
        <div className="flex items-center gap-1">
          <div className="h-6 px-2.5 bg-amber-500/30 rounded-tl-[10px] rounded-tr-sm rounded-bl-[10px] rounded-br-sm flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-amber-500 text-xs font-medium leading-4">{rating}</span>
          </div>
          <div className="h-6 px-2.5 bg-gray-200 rounded-tl-sm rounded-tr-[10px] rounded-bl-sm rounded-br-[10px] flex items-center">
            <span className="text-neutral-950 text-xs font-medium leading-4">{count} шт</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {items.map((review, i) => (
          <div key={i} className="flex flex-col gap-3 pb-6 border-b border-gray-100 last:border-none last:pb-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-11 h-11 ${review.avatarColor} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-lg font-semibold">{review.avatarLetter}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground text-sm font-medium">{review.userName}</span>
                  <span className="text-muted-foreground text-xs font-medium">
                    {review.date}, {review.stayDuration}
                  </span>
                </div>
              </div>
              <span className="text-muted-foreground text-xs font-medium">{review.timeAgo}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <h4 className="text-neutral-950 text-base font-semibold leading-6">Плюсы</h4>
                <p className="text-neutral-950 text-xs font-medium leading-4">{review.pros}</p>
              </div>
              {review.cons && (
                <div className="flex-1 flex flex-col gap-1">
                  <h4 className="text-neutral-950 text-base font-semibold leading-6">Минусы</h4>
                  <p className="text-neutral-950 text-xs font-medium leading-4">{review.cons}</p>
                </div>
              )}
            </div>

            {review.hostReply ? (
              <div className="flex flex-col gap-2 pl-4 border-l-2 border-orange-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">M</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-foreground text-sm font-medium">Мария, хозяин жилья</span>
                    <span className="text-muted-foreground text-xs font-medium">{review.hostReply.timeAgo}</span>
                  </div>
                </div>
                <p className="text-neutral-950 text-xs font-medium leading-4">{review.hostReply.text}</p>
              </div>
            ) : (
              <button className="text-muted-foreground text-xs font-medium hover:underline text-left">
                Показать ответ хозяина
              </button>
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" className="h-11 px-6 bg-neutral-950 text-white rounded-2xl hover:bg-neutral-800 border-none">
        Показать все {count} отзыва
      </Button>
    </div>
  );
}

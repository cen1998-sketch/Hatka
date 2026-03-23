import * as React from "react";
import { Star } from "lucide-react";
import s from "./ReviewsSection.module.css";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: { name: string; avatarLetter?: string };
  createdAt: string;
}

interface ReviewsSectionProps {
  rating: number;
  count: number;
  items: Review[];
}

export function ReviewsSection({ rating, count, items }: ReviewsSectionProps) {
  return (
    <div className={s.container}>
      <div className={s.header}>
        <h2 className={s.title}>Отзывы</h2>
        <div className={s.scoreWrapper}>
          <div className={s.rating}>
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className={s.ratingValue}>{rating}</span>
          </div>
          <div className={s.count}>
            <span className={s.countValue}>{count} шт</span>
          </div>
        </div>
      </div>

      <div className={s.reviewsList}>
        {items.length === 0 ? (
          <p className="text-gray-400 py-4">Отзывов пока нет. Будьте первым!</p>
        ) : (
          items.map((review) => (
            <div key={review.id} className={s.reviewItem}>
              <div className={s.reviewHeader}>
                <div className={s.authorInfo}>
                  <div className={s.avatar} style={{ backgroundColor: '#f87171' }}>
                    {review.user.name?.[0] || 'U'}
                  </div>
                  <div className={s.authorText}>
                    <span className={s.authorName}>{review.user.name}</span>
                    <span className={s.stayInfo}>
                      {new Date(review.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold">{review.rating}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className={s.feedbackText}>{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <button className={s.showAllBtn}>
        Показать все {count} отзыва
      </button>
    </div>
  );
}

import * as React from "react";
import { Star } from "lucide-react";
import s from "./ReviewsSection.module.css";

interface Review {
  userName: string;
  avatarColor?: string;
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
        {items.map((review, i) => (
          <div key={i} className={s.reviewItem}>
            <div className={s.reviewHeader}>
              <div className={s.authorInfo}>
                {/* Simplified avatar color handling for CSS Modules */}
                <div className={s.avatar} style={{ backgroundColor: review.avatarColor || '#f87171' }}>
                  {review.avatarLetter}
                </div>
                <div className={s.authorText}>
                  <span className={s.authorName}>{review.userName}</span>
                  <span className={s.stayInfo}>
                    {review.date}, {review.stayDuration}
                  </span>
                </div>
              </div>
              <span className={s.timeAgo}>{review.timeAgo}</span>
            </div>

            <div className={s.feedbackGrid}>
              <div className={s.feedbackCol}>
                <h4 className={s.feedbackTitle}>Плюсы</h4>
                <p className={s.feedbackText}>{review.pros}</p>
              </div>
              {review.cons && (
                <div className={s.feedbackCol}>
                  <h4 className={s.feedbackTitle}>Минусы</h4>
                  <p className={s.feedbackText}>{review.cons}</p>
                </div>
              )}
            </div>

            {review.hostReply ? (
              <div className={s.hostReply}>
                <div className={s.authorInfo}>
                  <div className={s.avatar} style={{ backgroundColor: '#000', width: '2rem', height: '2rem', fontSize: '0.75rem' }}>
                    M
                  </div>
                  <div className={s.authorText}>
                    <span className={s.authorName}>Мария, хозяин жилья</span>
                    <span className={s.stayInfo}>{review.hostReply.timeAgo}</span>
                  </div>
                </div>
                <p className={s.feedbackText}>{review.hostReply.text}</p>
              </div>
            ) : (
              <button className={s.replyBtn}>
                Показать ответ хозяина
              </button>
            )}
          </div>
        ))}
      </div>

      <button className={s.showAllBtn}>
        Показать все {count} отзыва
      </button>
    </div>
  );
}

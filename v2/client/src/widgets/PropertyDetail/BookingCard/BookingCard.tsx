import * as React from "react";
import { useSelector } from "react-redux";
import { ChevronDown, Zap } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import type { RootState } from "../../../app/store.ts";
import s from "./BookingCard.module.css";

interface BookingCardProps {
  price: number;
  basePrice?: number;
  cancelation?: {
    title: string;
    deadline: string;
    description: string;
  };
}

export function BookingCard({ price, basePrice, cancelation }: BookingCardProps) {
  const { id } = useParams<{ id: string }>();
  const search = useSelector((state: RootState) => state.search);
  const { checkIn, checkOut, guests } = search;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Выберите дату";
    return new Date(dateStr).toLocaleDateString("ru-RU", { day: 'numeric', month: 'short' });
  };

  const checkoutUrl = `/checkout/${id}?checkIn=${checkIn || ""}&checkOut=${checkOut || ""}&guests=${guests}`;

  return (
    <div className={s.card}>
      <div className={s.priceHeader}>
        <span className={s.price}>{price.toLocaleString()} ₽</span>
        <span className={s.pricePeriod}>за 1 сутки</span>
      </div>

      <div className={s.inputsGroup}>
        <div className={s.datesRow}>
          <div className={s.inputBox}>
            <span className={s.label}>Заезд</span>
            <span className={s.value}>{formatDate(checkIn)}</span>
          </div>
          <div className={s.inputBox}>
            <span className={s.label}>Отъезд</span>
            <span className={s.value}>{formatDate(checkOut)}</span>
          </div>
        </div>
        <div className={s.guestsBox}>
          <div className={s.col}>
            <span className={s.label}>Гости</span>
            <span className={s.value}>{guests} гостей</span>
          </div>
          <ChevronDown size={16} color="#a3a3a3" />
        </div>
      </div>

      {cancelation && (
        <div className={s.cancelationInfo}>
          <h3 className={s.cancelTitle}>{cancelation.title}</h3>
          <p className={s.cancelDesc}>
            {cancelation.deadline}
            <br />
            {cancelation.description}
          </p>
          <button className={s.cancelLink}>
            Правила отмены
          </button>
        </div>
      )}

      <div className={s.bookBtnGroup}>
        <Link to={checkoutUrl} className={s.bookBtn}>
          <Zap size={16} fill="white" color="white" />
          <span className={s.bookBtnText}>Забронировать</span>
        </Link>
        <p className={s.bookNote}>
          Внесите предоплату сейчас – остальное при заселении
        </p>
      </div>
    </div>
  );
}

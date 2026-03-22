import * as React from "react";
import { ChevronDown, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import s from "./BookingCard.module.css";

interface BookingCardProps {
  price: string;
  basePrice: number;
  cancelation: {
    title: string;
    deadline: string;
    description: string;
  };
}

export function BookingCard({ price, basePrice, cancelation }: BookingCardProps) {
  return (
    <div className={s.card}>
      <div className={s.priceHeader}>
        <span className={s.price}>{price}</span>
        <span className={s.pricePeriod}>за 1 сутки</span>
      </div>

      <div className={s.inputsGroup}>
        <div className={s.datesRow}>
          <div className={s.inputBox}>
            <span className={s.label}>Заезд</span>
            <span className={s.value}>19 июн, пт</span>
          </div>
          <div className={s.inputBox}>
            <span className={s.label}>Отъезд</span>
            <span className={s.value}>27 июн, сб</span>
          </div>
        </div>
        <div className={s.guestsBox}>
          <div className={s.col}>
            <span className={s.label}>Гости</span>
            <span className={s.value}>2 взрослых без детей</span>
          </div>
          <ChevronDown size={16} color="#a3a3a3" />
        </div>
      </div>

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

      <div className={s.bookBtnGroup}>
        <Link to="/property/1/checkout" className={s.bookBtn}>
          <Zap size={16} fill="white" color="white" />
          <span className={s.bookBtnText}>Забронировать</span>
        </Link>
        <p className={s.bookNote}>
          13 312 ₽ оплатить сейчас – остальное при заселении
        </p>
      </div>
    </div>
  );
}

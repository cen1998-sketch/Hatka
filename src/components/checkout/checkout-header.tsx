"use client";

interface CheckoutHeaderProps {
  bookingId: string;
}

export function CheckoutHeader({ bookingId }: CheckoutHeaderProps) {
  return (
    <div className="w-full flex justify-between items-baseline mb-2">
      <h1 className="text-neutral-950 text-3xl font-semibold leading-9">Подтвердить и оплатить</h1>
      <span className="text-muted-foreground text-xs font-medium">Номер бронирования: {bookingId}</span>
    </div>
  );
}

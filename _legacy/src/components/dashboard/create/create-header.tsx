"use client";

export function CreateListingHeader() {
  return (
    <div className="w-full flex flex-col items-center gap-2 py-12">
      <h1 className="text-neutral-950 text-4xl font-bold leading-tight">Сдавайте своё жильё на Хатка</h1>
      <p className="text-muted-foreground text-lg font-medium">
        Бесплатное размещение объявлений, оплата только за успешные бронирования
      </p>
    </div>
  );
}

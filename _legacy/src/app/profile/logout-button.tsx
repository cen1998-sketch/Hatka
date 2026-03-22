"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 h-12 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition duration-200"
      >
        <LogOut className="w-5 h-5" />
        Выйти из аккаунта
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900">Выход из аккаунта</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Вы уверены, что хотите выйти из профиля? Вам придется снова запрашивать ссылку для входа, чтобы вернуться.
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 h-11 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-xl transition"
              >
                Отмена
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

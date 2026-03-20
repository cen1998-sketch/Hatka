"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Info, Mail, Zap, User, Hotel } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { UserRole } from "@/lib/types";

const STEPS = [
  {
    number: 1,
    text: "Укажи почту\nи выбери роль «Арендатор»",
  },
  {
    number: 2,
    text: "Перейди по ссылке из письма, чтобы войти в профиль",
  },
  {
    number: 3,
    text: "Настрой фильтры\nи начни искать квартиры :)",
  },
];

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("tenant");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      // Use Auth.js signIn with nodemailer provider
      await signIn("nodemailer", { 
        email, 
        callbackUrl: "/",
        redirect: false, // We handle the success state manually in the UI
      });
      setIsSent(true);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-100 p-4">
        <div className="w-full max-w-md bg-white rounded-[32px] p-10 shadow-xl border border-neutral-100 text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center">
            <Mail className="w-10 h-10 text-orange-500" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-neutral-950">Письмо отправлено!</h2>
            <p className="text-muted-foreground text-sm font-medium">
              Мы отправили магическую ссылку для входа на почту <span className="text-neutral-950 font-bold">{email}</span>. 
              Проверьте папку "Входящие" или "Спам".
            </p>
          </div>
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-2xl"
            onClick={() => setIsSent(false)}
          >
            Вернуться назад
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-neutral-100 overflow-hidden font-['NT_Somic']">
      {/* Left Column - Information */}
      <div className="hidden lg:flex w-1/2 h-full p-8 flex-col justify-start items-start">
        <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-gradient-to-br from-[#E88C52] via-[#E67E42] to-[#D66D32] p-12 flex flex-col justify-between items-start shadow-2xl">
          {/* Subtle noise/texture overlay */}
          <div className="absolute inset-0 mix-blend-overlay opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6-dark.png")' }}></div>
          
          <h1 className="text-white text-5xl font-medium leading-[60px] max-w-md z-10">
            Найдите квартиру <br /> за 3 простых шага
          </h1>
          
          <div className="grid grid-cols-3 gap-4 w-full z-10">
            {STEPS.map((step) => (
              <div 
                key={step.number} 
                className="h-72 p-6 bg-white/20 backdrop-blur-md rounded-2xl flex flex-col justify-between items-start border border-white/20 transition-all hover:bg-white/30"
              >
                <div className="w-11 h-11 bg-white/30 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {step.number}
                </div>
                <p className="text-white text-lg font-medium leading-7 whitespace-pre-line">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 h-full flex flex-col justify-between items-center bg-neutral-50 p-8">
        <div className="w-full flex justify-end">
          <Link href="/" className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:bg-neutral-100 transition-colors">
            <X className="w-5 h-5 text-neutral-500" />
          </Link>
        </div>

        <div className="w-full max-w-[320px] flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
               <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-neutral-950 font-bold text-xl tracking-tight">Хатка</span>
          </div>

          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-5 text-left">
              <h2 className="text-2xl font-bold text-neutral-950">Вход</h2>
              
              {/* Role Toggle */}
              <div className="w-full p-1 bg-white border border-neutral-100 rounded-2xl flex relative h-12 shadow-sm">
                <button 
                  onClick={() => setRole("tenant")}
                  className={cn(
                    "flex-1 z-10 flex items-center justify-center text-sm font-bold transition-all duration-300",
                    role === "tenant" ? "text-neutral-950" : "text-neutral-400"
                  )}
                >
                  Арендатор
                </button>
                <button 
                  onClick={() => setRole("landlord")}
                  className={cn(
                    "flex-1 z-10 flex items-center justify-center text-sm font-bold transition-all duration-300",
                    role === "landlord" ? "text-neutral-950" : "text-neutral-400"
                  )}
                >
                  Арендадатель
                </button>
                {/* Active slider background */}
                <div 
                  className={cn(
                    "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#EBEBEB] rounded-xl transition-all duration-300 ease-out",
                    role === "tenant" ? "left-1" : "left-[calc(50%+1px)]"
                  )}
                />
              </div>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="relative">
                <Input 
                  type="email" 
                  placeholder="Email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 px-5 bg-white border-neutral-100 rounded-2xl focus-visible:ring-orange-500 text-sm font-medium"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20"
              >
                {isLoading ? "Отправка..." : "Получить через ссылку"}
              </Button>
            </form>

            <p className="text-neutral-400 text-xs text-center leading-5 px-2">
              Когда вы нажмёте кнопку, то согласитесь с{" "}
              <Link href="/terms" className="text-neutral-500 underline decoration-neutral-300">офертой</Link> и{" "}
              <Link href="/privacy" className="text-neutral-500 underline decoration-neutral-300">конфиденциальностью</Link>. 
              Ознакомьтесь там все стандартно, больше не забираем души:)
            </p>
          </div>
        </div>

        <div className="h-11"></div> {/* Spacer for bottom balance */}
      </div>
    </div>
  );
}

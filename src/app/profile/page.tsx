import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Mail, Phone, ShieldCheck, MapPin, User as UserIcon } from "lucide-react";
import { LogoutButton } from "./logout-button";
import { ProfileEditor } from "./profile-editor";

export default async function ProfilePage() {
  const session = await auth();

  // Защита роута - если не авторизован, кидаем на страницу логина
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Запрашиваем полные и самые свежие данные пользователя напрямую из базы данных
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!dbUser) {
    redirect("/login");
  }

  // Деструктурируем свежие данные из БД
  const { name, email, role, fullName, lastName, phone, city } = dbUser;
  
  // Логика сборки Имени для отображения
  const actualName = name || "";
  const actualLastName = lastName || "";
  const combinedName = `${actualName} ${actualLastName}`.trim();
  const fallbackDisplayName = fullName || null;
  const userDisplayName = combinedName || fallbackDisplayName || "Пользователь";
  
  // Генерация инициалов для красивой аватарки
  const initials = userDisplayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "П";

  // Подготовка существующей информации для передачи в форму модального окна
  const initialProfileData = {
    name: actualName,
    lastName: actualLastName,
    phone: phone || "",
    city: city || "",
    email: email || "",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-[calc(100vh-80px)] flex flex-col pt-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Мой профиль</h1>
      </div>
      
      <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-6 relative overflow-hidden">
        {/* Декоративный бэкграунд шапки карточки */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-orange-50 to-orange-100/30 -z-10" />

        {/* Аватарка и основная информация */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-4">
          <div className="w-[100px] h-[100px] rounded-full bg-white flex items-center justify-center text-orange-500 font-bold text-3xl shadow-sm border border-orange-100 shrink-0 leading-none relative">
            {initials}
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
          </div>
          <div className="text-center sm:text-left w-full mt-2 sm:mt-0">
            <h2 className="text-2xl font-bold text-gray-900">{userDisplayName}</h2>
            <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-orange-100 text-[11px] font-bold text-orange-700 uppercase tracking-widest">
              {role === "landlord" ? "Арендодатель" : "Арендатор"}
            </div>
            
            <p className="mt-4 text-sm text-gray-500 max-w-sm mx-auto sm:mx-0">
              Управляйте личной информацией и контактными данными для удобного бронирования жилья.
            </p>
          </div>
        </div>

        <div className="h-px bg-gray-100 w-full my-6" />

        {/* Встроенный редактор профиля (заменяет старые карточки и модалки) */}
        <ProfileEditor initialData={initialProfileData} />
      </div>

      <div className="flex-1" />

      {/* Зона выхода из аккаунта */}
      <div className="mt-8 mb-6">
        <LogoutButton />
      </div>
    </div>
  );
}

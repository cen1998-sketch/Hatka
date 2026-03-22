"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, ShieldCheck, MapPin, User as UserIcon, Loader2, Check } from "lucide-react";
import { updateProfile } from "@/actions/profile";

export interface UserProfileData {
  name: string;
  lastName: string;
  phone: string;
  city: string;
  email: string;
}

interface ProfileEditorProps {
  initialData: UserProfileData;
}

export function ProfileEditor({ initialData }: ProfileEditorProps) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData);

  // Синхронизируем локальный стейт, когда сервер присылает обновленные данные
  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Состояния редактирования отдельных полей
  const [editingField, setEditingField] = useState<"name" | "phone" | "city" | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Проверяем, есть ли несохраненные изменения относительно начальных данных
  const hasChanges = 
    formData.name !== initialData.name ||
    formData.lastName !== initialData.lastName ||
    formData.phone !== initialData.phone ||
    formData.city !== initialData.city;

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateProfile({
      name: formData.name,
      lastName: formData.lastName,
      phone: formData.phone,
      city: formData.city,
    });
    
    setIsSaving(false);
    if (result.success) {
      setEditingField(null); // Скрываем инпуты
      router.refresh(); // Жесткое обновление кэша Next.js роутера
    } else {
      alert(result.error || "Ошибка сохранения");
    }
  };

  const combinedName = `${initialData.name} ${initialData.lastName}`.trim();

  return (
    <div className="space-y-4 relative z-10 w-full">
      {/* ФИО */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-700 bg-white border border-gray-100 shadow-sm rounded-2xl p-4 transition-all">
        <div className="bg-gray-50/80 p-2.5 rounded-full shrink-0 hidden sm:block">
          <UserIcon className="w-[18px] h-[18px] text-gray-400" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ФИО</p>
          {editingField === "name" ? (
            <div className="flex gap-2 w-full max-w-sm mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="Имя"
                autoFocus
              />
              <input 
                type="text" 
                value={formData.lastName} 
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="Фамилия"
              />
            </div>
          ) : (
            <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
              {combinedName || <span className="text-gray-400 font-medium">Не указано</span>}
            </p>
          )}
        </div>
        <button 
          onClick={() => setEditingField(editingField === "name" ? null : "name")}
          className="text-[13px] font-bold text-orange-500 hover:text-orange-600 transition-colors shrink-0 px-2 py-1 rounded-lg hover:bg-orange-50 self-end sm:self-center"
        >
          {editingField === "name" ? "Отмена" : "Изменить"}
        </button>
      </div>

      {/* Email */}
      <div className="flex items-center gap-4 text-gray-700 bg-white border border-gray-100 shadow-sm rounded-2xl p-4">
        <div className="bg-gray-50/80 p-2.5 rounded-full shrink-0 hidden sm:block">
          <Mail className="w-[18px] h-[18px] text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email адрес</p>
          <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{initialData.email}</p>
        </div>
        <div title="Email подтвержден">
          <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
        </div>
      </div>
      
      {/* Телефон */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-700 bg-white border border-gray-100 shadow-sm rounded-2xl p-4 transition-all">
        <div className="bg-orange-50 p-2.5 rounded-full shrink-0 hidden sm:block">
          <Phone className="w-[18px] h-[18px] text-orange-400" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Телефон</p>
          {editingField === "phone" ? (
            <div className="mt-1 w-full max-w-sm animate-in fade-in slide-in-from-top-1 duration-200">
              <input 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="+7 (999) 000-00-00"
                autoFocus
              />
            </div>
          ) : (
            <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
              {initialData.phone || <span className="text-gray-400 font-medium whitespace-nowrap">Номер не привязан</span>}
            </p>
          )}
        </div>
        <button 
          onClick={() => setEditingField(editingField === "phone" ? null : "phone")}
          className="text-[13px] font-bold text-orange-500 hover:text-orange-600 transition-colors shrink-0 px-2 py-1 rounded-lg hover:bg-orange-50 self-end sm:self-center"
        >
          {editingField === "phone" ? "Отмена" : (initialData.phone ? "Изменить" : "Привязать")}
        </button>
      </div>

      {/* Город */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-700 bg-white border border-gray-100 shadow-sm rounded-2xl p-4 transition-all">
        <div className="bg-blue-50 p-2.5 rounded-full shrink-0 hidden sm:block">
          <MapPin className="w-[18px] h-[18px] text-blue-400" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Город</p>
          {editingField === "city" ? (
            <div className="mt-1 w-full max-w-sm animate-in fade-in slide-in-from-top-1 duration-200">
              <input 
                type="text" 
                value={formData.city} 
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="Например, Москва"
                autoFocus
              />
            </div>
          ) : (
            <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
              {initialData.city || <span className="text-gray-400 font-medium whitespace-nowrap">Город не указан</span>}
            </p>
          )}
        </div>
        <button 
          onClick={() => setEditingField(editingField === "city" ? null : "city")}
          className="text-[13px] font-bold text-orange-500 hover:text-orange-600 transition-colors shrink-0 px-2 py-1 rounded-lg hover:bg-orange-50 self-end sm:self-center"
        >
          {editingField === "city" ? "Отмена" : (initialData.city ? "Изменить" : "Указать")}
        </button>
      </div>

      {/* Кнопка "Сохранить" - появляется с анимацией если есть изменения */}
      <div className={`transition-all duration-300 ease-in-out ${hasChanges ? 'opacity-100 max-h-24 pt-4' : 'opacity-0 max-h-0 overflow-hidden pt-0 m-0 border-none'}`}>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full h-12 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-medium rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
             <>
               <Check className="w-5 h-5" />
               Сохранить конфигурацию
             </>
          )}
        </button>
      </div>
    </div>
  );
}

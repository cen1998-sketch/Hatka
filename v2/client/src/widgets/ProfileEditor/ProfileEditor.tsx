import * as React from "react";
import { Mail, Phone, ShieldCheck, MapPin, User as UserIcon, Loader2, Check } from "lucide-react";
import { cn } from "../../shared/lib/clsx.ts";
import s from "./ProfileEditor.module.css";
import { useUpdateProfileMutation } from "../../entities/user/api/userApi.ts";

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
  const [formData, setFormData] = React.useState(initialData);
  const [editingField, setEditingField] = React.useState<"name" | "phone" | "city" | null>(null);
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const hasChanges = 
    formData.name !== initialData.name ||
    formData.lastName !== initialData.lastName ||
    formData.phone !== initialData.phone ||
    formData.city !== initialData.city;

  const handleSave = async () => {
    try {
      await updateProfile({
        firstName: formData.name,
        lastName: formData.lastName,
        phone: formData.phone,
        city: formData.city,
      }).unwrap();
      setEditingField(null);
    } catch (err) {
      console.error("Failed to save profile:", err);
      // Здесь можно добавить уведомление об ошибке
    }
  };

  const combinedName = `${formData.name} ${formData.lastName}`.trim();

  return (
    <div className={s.container}>
      {/* ФИО */}
      <div className={s.rowBox}>
        <div className={cn(s.iconCircle, s.iconCircleGray)}>
          <UserIcon size={18} color="#9ca3af" />
        </div>
        <div className={s.contentCol}>
          <p className={s.label}>ФИО</p>
          {editingField === "name" ? (
            <div className={s.inputGroup}>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={s.input}
                placeholder="Имя"
                autoFocus
              />
              <input 
                type="text" 
                value={formData.lastName} 
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className={s.input}
                placeholder="Фамилия"
              />
            </div>
          ) : (
            <p className={s.value}>
              {combinedName || <span className={s.placeholder}>Не указано</span>}
            </p>
          )}
        </div>
        <button 
          onClick={() => setEditingField(editingField === "name" ? null : "name")}
          className={s.actionBtn}
        >
          {editingField === "name" ? "Отмена" : "Изменить"}
        </button>
      </div>

      {/* Email */}
      <div className={s.rowBox}>
        <div className={cn(s.iconCircle, s.iconCircleGray)}>
          <Mail size={18} color="#9ca3af" />
        </div>
        <div className={s.contentCol}>
          <p className={s.label}>Email адрес</p>
          <p className={s.value}>{initialData.email}</p>
        </div>
        <div>
          <ShieldCheck size={20} color="#22c55e" />
        </div>
      </div>
      
      {/* Телефон */}
      <div className={s.rowBox}>
        <div className={cn(s.iconCircle, s.iconCircleOrange)}>
          <Phone size={18} color="#fb923c" />
        </div>
        <div className={s.contentCol}>
          <p className={s.label}>Телефон</p>
          {editingField === "phone" ? (
            <div className={s.inputGroup}>
              <input 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className={s.input}
                placeholder="+7 (999) 000-00-00"
                autoFocus
              />
            </div>
          ) : (
            <p className={s.value}>
              {formData.phone || <span className={s.placeholder}>Номер не привязан</span>}
            </p>
          )}
        </div>
        <button 
          onClick={() => setEditingField(editingField === "phone" ? null : "phone")}
          className={s.actionBtn}
        >
          {editingField === "phone" ? "Отмена" : (formData.phone ? "Изменить" : "Привязать")}
        </button>
      </div>

      {/* Город */}
      <div className={s.rowBox}>
        <div className={cn(s.iconCircle, s.iconCircleBlue)}>
          <MapPin size={18} color="#60a5fa" />
        </div>
        <div className={s.contentCol}>
          <p className={s.label}>Город</p>
          {editingField === "city" ? (
            <div className={s.inputGroup}>
              <input 
                type="text" 
                value={formData.city} 
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className={s.input}
                placeholder="Например, Москва"
                autoFocus
              />
            </div>
          ) : (
            <p className={s.value}>
              {formData.city || <span className={s.placeholder}>Город не указан</span>}
            </p>
          )}
        </div>
        <button 
          onClick={() => setEditingField(editingField === "city" ? null : "city")}
          className={s.actionBtn}
        >
          {editingField === "city" ? "Отмена" : (formData.city ? "Изменить" : "Указать")}
        </button>
      </div>

      {/* Кнопка "Сохранить" */}
      <div className={cn(s.saveContainer, hasChanges ? s.saveContainerVisible : s.saveContainerHidden)}>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={s.saveBtn}
        >
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : (
             <>
               <Check size={20} />
               Сохранить конфигурацию
             </>
          )}
        </button>
      </div>
    </div>
  );
}

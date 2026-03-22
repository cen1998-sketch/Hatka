import * as React from "react";
import { ChevronLeft, Plus, Trash2, Upload, Loader2, Bed, Maximize2, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { Button } from "../../shared/ui/Button/Button.tsx";
import { Input } from "../../shared/ui/Input/Input.tsx";
import { Badge } from "../../shared/ui/Badge/Badge.tsx";
import { api } from "../../shared/api/api-base.ts";
import { cn } from "../../shared/lib/clsx.ts";
import s from "./RoomCreation.module.css";

const ROOM_AMENITIES = [
  "Кондиционер", "Wi-Fi", "Телевизор", "Мини-бар", "Сейф", 
  "Фен", "Халаты", "Тапочки", "Рабочий стол", "Балкон", 
  "Душ", "Ванна", "Вид на город", "Вид на море"
];

export function RoomCreation() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [images, setImages] = React.useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>([]);

  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    price: "",
    capacity: "2",
    beds: "1",
    size: ""
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };

    try {
      const compressedFiles = await Promise.all(
        Array.from(files).map(async (file) => {
          console.log(`Оригинал: ${file.name}, размер: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
          const compressed = await imageCompression(file, options);
          console.log(`Сжато: ${file.name}, размер: ${(compressed.size / 1024 / 1024).toFixed(2)} MB`);
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(compressed);
          });
        })
      );
      setImages(prev => [...prev, ...compressedFiles]);
    } catch (error) {
      console.error("Compression error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title) {
        alert("Укажите название категории номера");
        return;
    }
    if (!formData.price) {
        alert("Укажите цену за ночь");
        return;
    }
    if (!propertyId) {
        alert("Ошибка: отсутствует ID объекта (propertyId). Попробуйте вернуться назад и зайти снова.");
        return;
    }
    
    setIsSaving(true);
    try {
      const response = await api.post(`/properties/${propertyId}/rooms`, {
        ...formData,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        beds: parseInt(formData.beds),
        size: formData.size ? parseFloat(formData.size) : null,
        amenityIds: selectedAmenities,
        images: images 
      });

      if (response.status === 200 || response.status === 201 || response.data?.success) {
        alert("Категория номера успешно добавлена!");
        navigate(-1);
      } else {
        alert("Ошибка при сохранении: " + (response.data?.error || "Неизвестная ошибка"));
      }
    } catch (err: any) {
      console.error(err);
      alert("Ошибка сети или сервера: " + (err.response?.data?.details || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAmenity = (name: string) => {
    setSelectedAmenities(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <button onClick={() => navigate(-1)} className={s.backBtn}>
          <ChevronLeft size={24} />
          Назад
        </button>
        <h1 className={s.title}>Добавление номера</h1>
      </div>

      <div className={s.content}>
        <div className={s.section}>
          <h2>Основная информация</h2>
          <div className={s.fieldGroup}>
            <label>Название категории номера</label>
            <Input 
              placeholder="например, Стандартный двухместный с видом на море" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className={s.fieldGroup}>
            <label>Описание (необязательно)</label>
            <textarea 
              className={s.textarea}
              placeholder="Опишите особенности номера..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        <div className={s.grid}>
          <div className={s.section}>
            <h2>Характеристики</h2>
            <div className={s.inputsGrid}>
              <div className={s.fieldGroup}>
                <label><Users size={16} /> Вместимость (чел)</label>
                <Input 
                  type="number" 
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                />
              </div>
              <div className={s.fieldGroup}>
                <label><Bed size={16} /> Кроватей</label>
                <Input 
                  type="number" 
                  value={formData.beds}
                  onChange={(e) => setFormData({...formData, beds: e.target.value})}
                />
              </div>
              <div className={s.fieldGroup}>
                <label><Maximize2 size={16} /> Площадь (м²)</label>
                <Input 
                  type="number" 
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                />
              </div>
              <div className={s.fieldGroup}>
                <label>Цена за ночь (₽)</label>
                <Input 
                  type="number" 
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className={s.section}>
            <h2>Удобства номера</h2>
            <div className={s.amenities}>
              {ROOM_AMENITIES.map(item => (
                <Badge
                  key={item}
                  variant={selectedAmenities.includes(item) ? "default" : "outline"}
                  className={cn(s.amenityBadge, selectedAmenities.includes(item) && s.activeAmenity)}
                  onClick={() => toggleAmenity(item)}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className={s.section}>
          <h2>Фотографии номера</h2>
          <div className={s.uploadArea}>
            <input 
              type="file" 
              id="room-photos" 
              multiple 
              accept="image/*" 
              onChange={handleImageUpload} 
              hidden 
            />
            <label htmlFor="room-photos" className={s.uploadLabel}>
              {isUploading ? (
                <>
                  <Loader2 className={s.spin} />
                  <span>Сжатие фотографий...</span>
                </>
              ) : (
                <>
                  <Upload size={32} />
                  <span>Нажмите или перетащите фото</span>
                  <p>До 10 фотографий в формате JPG, PNG</p>
                </>
              )}
            </label>
          </div>

          <div className={s.photoGrid}>
            {images.map((img, idx) => (
              <div key={idx} className={s.photoItem}>
                <img src={img} alt="" />
                <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className={s.deletePhoto}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={s.actions}>
          <Button variant="outline" onClick={() => navigate(-1)}>Отмена</Button>
          <Button onClick={handleSubmit} disabled={isSaving || !formData.title || !formData.price}>
            {isSaving ? <Loader2 className={s.spin} /> : "Добавить категорию номера"}
          </Button>
        </div>
      </div>
    </div>
  );
}


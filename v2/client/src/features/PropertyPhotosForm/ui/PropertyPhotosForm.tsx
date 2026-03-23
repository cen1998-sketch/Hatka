import * as React from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "../../../shared/ui/Button/Button";
import { cn } from "../../../shared/lib/clsx";
import { compressAndConvertImage } from "../../../shared/lib/image-utils";

interface PropertyPhotosFormProps {
  images?: string[];
  onChange: (data: { images: string[] }) => void;
}

export const PropertyPhotosForm: React.FC<PropertyPhotosFormProps> = ({
  images = [],
  onChange
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const newImages: string[] = [...images];

    for (let i = 0; i < files.length; i++) {
      try {
        const compressed = await compressAndConvertImage(files[i]);
        newImages.push(compressed);
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }

    onChange({ images: newImages });
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange({ images: newImages });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[var(--foreground)]">Ваши фотографии</h3>
          <p className="text-sm text-[var(--muted-foreground)]">Минимум 3 фотографии. Первая будет главной.</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="rounded-full border-[var(--border)] font-bold text-xs uppercase tracking-widest px-6"
        >
          {isUploading ? "Загрузка..." : "Добавить фото"}
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/*"
      />

      {images.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-video w-full rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] bg-[var(--background)] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-50 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-[var(--border)] shadow-sm group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-[var(--muted-foreground)]" />
          </div>
          <p className="text-sm font-bold text-[var(--foreground)]">Перетащите сюда фото или нажмите для выбора</p>
          <p className="text-xs text-[var(--muted-foreground)]">JPG, PNG, WEBP (до 10МБ)</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={cn(
                "group relative aspect-square rounded-[var(--radius)] overflow-hidden border border-[var(--border)] shadow-sm",
                index === 0 && "md:col-span-2 md:aspect-video"
              )}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-black/50 text-[10px] font-bold text-white uppercase tracking-widest pointer-events-none">
                  Главное фото
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] bg-[var(--background)] flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[var(--border)] shadow-sm group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4 text-[var(--muted-foreground)]" />
            </div>
            <span className="text-xs font-bold text-[var(--foreground)]">Добавить</span>
          </button>
        </div>
      )}
    </div>
  );
};

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

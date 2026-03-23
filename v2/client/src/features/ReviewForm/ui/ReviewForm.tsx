import * as React from "react";
import { Star, Loader2 } from "lucide-react";
import { api } from "../../../shared/api/api-base.ts";
import { Button } from "../../../shared/ui/Button/Button.tsx";
import { cn } from "../../../shared/lib/clsx.ts";

interface ReviewFormProps {
  propertyId: string;
  onSuccess: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ propertyId, onSuccess }) => {
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hoveredRating, setHoveredRating] = React.useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;
    setIsSubmitting(true);
    try {
      await api.post(`/properties/${propertyId}/reviews`, { rating, comment });
      setComment("");
      setRating(5);
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.error || "Ошибка при отправке отзыва");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 p-8 bg-gray-50 rounded-3xl border border-gray-100">
      <h3 className="text-xl font-black text-gray-900 mb-2">Оставить отзыв</h3>
      <p className="text-gray-500 mb-6 text-sm">Поделитесь вашими впечатлениями о проживании</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Ваша оценка</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onMouseEnter={() => setHoveredRating(s)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(s)}
                className="p-1 transition-transform active:scale-90"
              >
                <Star 
                  size={32} 
                  className={cn(
                    "transition-colors",
                    (hoveredRating || rating) >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                  )} 
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Текст отзыва</label>
          <textarea
            className="w-full min-h-[120px] p-4 rounded-2xl border-2 border-white bg-white focus:border-blue-600 focus:outline-none transition-all text-sm"
            placeholder="Что вам больше всего понравилось? Были ли какие-то недостатки?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting || !comment}
          className="w-full md:w-auto px-10 h-12 rounded-xl"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Отправить отзыв"}
        </Button>
      </form>
    </div>
  );
};

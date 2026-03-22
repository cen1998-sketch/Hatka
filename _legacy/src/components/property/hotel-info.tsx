import { PropertyDetail } from "@/lib/types";
import { Star, ShieldCheck, Wifi, Car, CreditCard, CigaretteOff, CalendarDays, Hotel } from "lucide-react";
import { cn } from "@/lib/utils";

interface HotelInfoProps {
  property: PropertyDetail;
}

export function HotelInfo({ property }: HotelInfoProps) {
  if (!property.infrastructure && !property.registryNumber) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Registry & Stars */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-100 flex flex-wrap items-center gap-6">
        {property.stars !== undefined && (
          <div className="flex border-r border-neutral-100 pr-6 mr-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-5 h-5",
                  i < (property.stars || 0) ? "text-amber-400 fill-amber-400" : "text-neutral-200"
                )}
              />
            ))}
          </div>
        )}

        {property.registryNumber && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">Реестровая запись</span>
              <span className="text-sm font-bold text-neutral-900">{property.registryNumber}</span>
            </div>
          </div>
        )}
      </div>

      {/* Infrastructure Grid */}
      {property.infrastructure && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <InfoCard 
            icon={<Wifi className="w-4 h-4" />} 
            label="Интернет" 
            value={property.infrastructure.internet === "Free" ? "Бесплатно" : property.infrastructure.internet === "Paid" ? "Платно" : "Нет"}
            color="bg-orange-50 text-orange-600"
          />
          <InfoCard 
            icon={<Car className="w-4 h-4" />} 
            label="Парковка" 
            value={property.infrastructure.parking === "Free" ? "Бесплатно" : property.infrastructure.parking === "Paid" ? "Платно" : "Нет"}
            color="bg-blue-50 text-blue-600"
          />
          <InfoCard 
            icon={<CalendarDays className="w-4 h-4" />} 
            label="Год постройки" 
            value={property.infrastructure.yearBuilt?.toString() || "—"}
            color="bg-green-50 text-green-600"
          />
          <InfoCard 
            icon={<Hotel className="w-4 h-4" />} 
            label="Количество номеров" 
            value={property.infrastructure.roomCount?.toString() || "—"}
            color="bg-purple-50 text-purple-600"
          />
          <InfoCard 
            icon={<CreditCard className="w-4 h-4" />} 
            label="Оплата" 
            value={property.infrastructure.paymentMethods?.join(", ") || "—"}
            color="bg-neutral-50 text-neutral-600"
          />
          <InfoCard 
            icon={<CigaretteOff className="w-4 h-4" />} 
            label="Курение" 
            value={property.infrastructure.smokingPolicy || "—"}
            color="bg-red-50 text-red-600"
          />
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm border border-neutral-100 flex items-center gap-4">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold text-neutral-900">{value}</span>
      </div>
    </div>
  );
}

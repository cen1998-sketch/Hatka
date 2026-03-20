import { getPropertyById } from "@/lib/mock-data";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertyHeader } from "@/components/property/property-header";
import { PropertyDescription } from "@/components/property/property-description";
import { SleepingArrangements } from "@/components/property/sleeping-arrangements";
import { AmenitiesList } from "@/components/property/amenities-list";
import { HouseRules } from "@/components/property/house-rules";
import { ReviewsSection } from "@/components/property/reviews-section";
import { BookingCard } from "@/components/property/booking-card";
import { HostCard } from "@/components/property/host-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, Info } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HotelInfo } from "@/components/property/hotel-info";

export default async function PropertyPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ preview?: string }>
}) {
  const { id } = await params;
  const { preview } = await searchParams;
  const property = getPropertyById(id);

  if (!property) {
    notFound();
  }

  const isPreview = preview === "true";

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-100 min-h-screen">
      {isPreview && (
        <div className="sticky top-0 z-50 w-full bg-blue-600 text-white py-2.5 px-4 text-center shadow-lg backdrop-blur-sm bg-blue-600/90">
          <div className="flex items-center justify-center gap-2">
            <Info className="w-4 h-4" />
            <p className="text-sm font-bold uppercase tracking-wide italic">Это предпросмотр вашего объявления</p>
          </div>
        </div>
      )}
      <div className="w-full max-w-[1140px] mx-auto pt-6 pb-20 px-4 xl:px-0">
        
        {/* Navigation Bar */}
        <div className="flex justify-start items-center gap-3 mb-3">
          <Link href="/dashboard">
            <Button variant="outline" className="h-11 px-3.5 bg-background rounded-2xl flex items-center gap-1.5 border-none shadow-sm hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Вернуться в кабинет</span>
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" className="h-11 px-3.5 bg-background rounded-2xl flex items-center gap-1.5 border-none shadow-sm hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Все варианты</span>
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* Main Content (Left) */}
          <div className="flex-1 w-full flex flex-col gap-3 min-w-0">
            <PropertyGallery images={property.images} location={property.location} />
            
            <div className="flex flex-col gap-3">
              <PropertyHeader 
                title={property.title} 
                tags={property.tags}
              />

              {property.propertyType === "Гостиница" && (
                <HotelInfo property={property} />
              )}
              
              <PropertyDescription text={property.description} />
              
              <SleepingArrangements 
                summary={property.sleepingPlaces.summary} 
                items={property.sleepingPlaces.items} 
              />
              
              <AmenitiesList 
                main={property.amenities.main} 
                groups={property.amenities.groups} 
              />
              
              <HouseRules 
                summary={property.rules.summary} 
                checkIn={property.rules.checkIn}
                checkOut={property.rules.checkOut}
                items={property.rules.items} 
              />
              
              <div className="flex flex-col lg:flex-row gap-3">
                <ReviewsSection 
                  rating={property.detailedReviews.rating}
                  count={property.detailedReviews.count}
                  items={property.detailedReviews.items}
                />
                <HostCard host={property.host} />
              </div>

              <div className="p-6 bg-white rounded-xl">
                <p className="text-muted-foreground text-xs font-medium">Размещен 15.02.2025</p>
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <aside className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-6 flex flex-col gap-3">
            <div className="flex justify-start items-center gap-1 w-full">
              <Button variant="outline" className="flex-1 h-11 bg-background rounded-2xl border-none shadow-sm font-['NT_Somic']">
                Поделиться
              </Button>
              <Button variant="outline" className="flex-1 h-11 bg-background rounded-2xl border-none shadow-sm font-['NT_Somic']">
                Избранное
              </Button>
            </div>
            
            <BookingCard 
              price={property.price}
              basePrice={property.basePrice}
              cancelation={property.cancelationPolicy}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

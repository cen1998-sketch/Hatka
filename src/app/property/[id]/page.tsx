import { MOCK_PROPERTY_DETAIL } from "@/lib/mock-data";
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
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";

export default function PropertyPage({ params }: { params: { id: string } }) {
  // Use mock data for now, ignoring params.id
  const property = MOCK_PROPERTY_DETAIL;

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-100 min-h-screen">
      <div className="w-full max-w-[1140px] mx-auto pt-6 pb-20 px-4 xl:px-0">
        
        {/* Navigation Bar */}
        <div className="flex justify-start items-center gap-3 mb-3">
          <Link href="/search">
            <Button variant="outline" className="h-11 px-3.5 bg-background rounded-2xl flex items-center gap-1.5 border-none shadow-sm hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Все варианты</span>
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="h-11 px-3.5 bg-background rounded-2xl flex items-center gap-1.5 border-none shadow-sm hover:bg-gray-50">
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">Новый поиск</span>
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

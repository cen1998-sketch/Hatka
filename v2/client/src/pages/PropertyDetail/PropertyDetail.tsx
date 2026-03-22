import * as React from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PropertyGallery } from "../../widgets/PropertyDetail/PropertyGallery/PropertyGallery.tsx";
import { PropertyHeader } from "../../widgets/PropertyDetail/PropertyHeader/PropertyHeader.tsx";
import { PropertyDescription } from "../../widgets/PropertyDetail/PropertyDescription/PropertyDescription.tsx";
import { SleepingArrangements } from "../../widgets/PropertyDetail/SleepingArrangements/SleepingArrangements.tsx";
import { AmenitiesList } from "../../widgets/PropertyDetail/AmenitiesList/AmenitiesList.tsx";
import { HouseRules } from "../../widgets/PropertyDetail/HouseRules/HouseRules.tsx";
import { ReviewsSection } from "../../widgets/PropertyDetail/ReviewsSection/ReviewsSection.tsx";
import { BookingCard } from "../../widgets/PropertyDetail/BookingCard/BookingCard.tsx";
import { HostCard } from "../../widgets/PropertyDetail/HostCard/HostCard.tsx";
import { MOCK_PROPERTY_DETAIL } from "../../shared/api/mock-detail.ts";
import s from "./PropertyDetail.module.css";

export function PropertyDetail() {
  // Имитация fetch(id)
  const property = MOCK_PROPERTY_DETAIL;

  if (!property) {
    return <div>Not Found</div>;
  }

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        
        {/* Navigation Bar */}
        <div className={s.navBar}>
          <Link to="/" className={s.navLink}>
            <button className={s.navBtn}>
              <ChevronLeft size={16} />
              <span className={s.navBtnText}>К главному поиску</span>
            </button>
          </Link>
        </div>

        <div className={s.contentWrapper}>
          {/* Main Content (Left) */}
          <div className={s.mainCol}>
            <PropertyGallery images={property.images} location={property.location} />
            
            <div className={s.stack}>
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
              
              <div className={s.reviewsRow}>
                <ReviewsSection 
                  rating={property.detailedReviews.rating}
                  count={property.detailedReviews.count}
                  items={property.detailedReviews.items}
                />
                <HostCard host={property.host} />
              </div>

              <div className={s.postedDate}>
                <p className={s.postedDateText}>Размещен 15.02.2025</p>
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <aside className={s.sidebar}>
            <div className={s.actionsRow}>
              <button className={s.actionBtn}>Поделиться</button>
              <button className={s.actionBtn}>Избранное</button>
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

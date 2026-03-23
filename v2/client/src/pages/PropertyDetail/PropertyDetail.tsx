import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { PropertyGallery } from "../../widgets/PropertyDetail/PropertyGallery/PropertyGallery.tsx";
import { api } from "../../shared/api/api-base.ts";
import { PropertyHeader } from "../../widgets/PropertyDetail/PropertyHeader/PropertyHeader.tsx";
import { PropertyDescription } from "../../widgets/PropertyDetail/PropertyDescription/PropertyDescription.tsx";
import { SleepingArrangements } from "../../widgets/PropertyDetail/SleepingArrangements/SleepingArrangements.tsx";
import { AmenitiesList } from "../../widgets/PropertyDetail/AmenitiesList/AmenitiesList.tsx";
import { HouseRules } from "../../widgets/PropertyDetail/HouseRules/HouseRules.tsx";
import { ReviewsSection } from "../../widgets/PropertyDetail/ReviewsSection/ReviewsSection.tsx";
import { BookingCard } from "../../widgets/PropertyDetail/BookingCard/BookingCard.tsx";
import { HostCard } from "../../widgets/PropertyDetail/HostCard/HostCard.tsx";
import { ReviewForm } from "../../features/ReviewForm/ui/ReviewForm.tsx";
import { MOCK_PROPERTY_DETAIL } from "../../shared/api/mock-detail.ts";
import s from "./PropertyDetail.module.css";

export function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/properties/${id}`);
      setProperty(response.data.data);
    } catch (error) {
      console.error("Failed to fetch property", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProperty();
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!property) return <div className="p-20 text-center">Объект не найден</div>;

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
                  rating={property.avgRating || 5}
                  count={property.reviewsCount || 0}
                  items={property.reviews || []}
                />
                <HostCard host={property.host} />
              </div>

              <ReviewForm 
                propertyId={property.id} 
                onSuccess={fetchProperty} 
              />

              <div className={s.postedDate}>
                <p className={s.postedDateText}>
                  Размещен {new Date(property.createdAt).toLocaleDateString("ru-RU")}
                </p>
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

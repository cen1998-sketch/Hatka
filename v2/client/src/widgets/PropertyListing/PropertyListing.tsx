import { PropertyCard } from "../../entities/property/ui/PropertyCard.tsx";
import type { Property } from "../../entities/property/model/property-slice.ts";
import { Skeleton } from "../../shared/ui/Skeleton/Skeleton.tsx";
import s from "./PropertyListing.module.css";

interface PropertyListingProps {
  properties: Property[];
  isLoading?: boolean;
}

export function PropertyListing({ properties, isLoading }: PropertyListingProps) {
  if (isLoading) {
    return (
      <div className={s.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className={s.skeletonCard} />
        ))}
      </div>
    );
  }

  return (
    <div className={s.grid}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

import * as React from "react";
import { ChevronLeft, ChevronRight, Square } from "lucide-react";
import s from "./PropertyGallery.module.css";

interface PropertyGalleryProps {
  images: string[];
  location: string;
}

export function PropertyGallery({ images, location }: PropertyGalleryProps) {
  return (
    <div className={s.gallery}>
      <div 
        className={s.mainImage}
        style={{ backgroundImage: `url(${images[0] || ''})` }}
      />

      <div className={s.dots}>
        <div className={s.dotSmall}></div>
        <div className={s.dotLarge}></div>
        <div className={s.dotMedium}></div>
        <div className={s.dotSmall}></div>
      </div>

      <div className={s.locationBadge}>
        <Square size={12} fill="white" color="white" />
        <span className={s.locationText}>
          {location}
        </span>
      </div>

      <div className={s.navArrows}>
        <button className={s.navBtn}>
          <ChevronLeft size={20} />
        </button>
        <button className={s.navBtn}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

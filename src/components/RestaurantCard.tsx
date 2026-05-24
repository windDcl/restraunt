import { Clock3, MapPin, Star } from "lucide-react";
import { Restaurant } from "../types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  variant?: "large" | "grid";
}

export default function RestaurantCard({
  restaurant,
  onClick,
  variant = "large",
}: RestaurantCardProps) {
  if (variant === "grid") {
    return (
      <article
        onClick={onClick}
        className="bg-surface-bright rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-variant/30 active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col group"
      >
        <div className="relative h-32 w-full overflow-hidden">
          <img
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={restaurant.image}
          />
          <div className="absolute top-2 right-2 bg-white/95 px-2 py-0.5 rounded-full flex items-center gap-1 text-xs font-bold shadow-sm">
            <Star className="w-3.5 h-3.5 text-secondary-container fill-secondary-container" />
            <span>{restaurant.rating}</span>
          </div>
        </div>
        <div className="p-3 space-y-2">
          <h3 className="font-display font-semibold text-sm text-on-surface truncate group-hover:text-primary transition-colors">
            {restaurant.name}
          </h3>
          <p className="text-xs text-on-surface-variant line-clamp-2">{restaurant.slogan}</p>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={onClick}
      className="bg-surface-bright rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-surface-variant/30 active:scale-[0.98] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition-all duration-200 cursor-pointer group flex flex-col"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          src={restaurant.image}
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="w-4 h-4 text-secondary-container fill-secondary-container" />
          <span className="text-sm font-bold text-on-surface">{restaurant.rating}</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display font-semibold text-lg text-on-surface group-hover:text-primary transition-colors">
            {restaurant.name}
          </h3>
          <p className="text-sm text-on-surface-variant mt-1.5">{restaurant.cuisine}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="w-3.5 h-3.5" />
            {restaurant.openHours}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {restaurant.address}
          </span>
        </div>
      </div>
    </article>
  );
}

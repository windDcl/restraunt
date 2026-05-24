import { Star, Clock, MapPin } from "lucide-react";
import { Restaurant } from "../types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  variant?: "large" | "grid";
  key?: string;
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
        className="bg-surface-bright rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-variant/30 active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col group pb-2.5"
      >
        <div className="relative h-32 w-full overflow-hidden">
          <img
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={restaurant.image}
          />
          {restaurant.rating && (
            <div className="absolute top-2 right-2 bg-white/95 px-2 py-0.5 rounded-full flex items-center gap-0.5 text-xs font-bold font-sans shadow-sm">
              <Star className="w-3.5 h-3.5 text-secondary-container fill-secondary-container" />
              <span>{restaurant.rating}</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-sans font-semibold text-sm text-on-surface truncate group-hover:text-primary transition-colors">
            {restaurant.name}
          </h3>
          <div className="flex justify-between items-center mt-1.5 text-xs text-on-surface-variant">
            <span className="text-primary font-semibold flex items-center gap-0.5">
              <Clock className="w-3 h-3 inline-block" />
              {restaurant.deliveryTime}
            </span>
            <span className="font-medium flex items-center gap-0.5">
              <Star className="w-3 h-3 text-secondary fill-secondary" />
              {restaurant.rating} ★
            </span>
          </div>
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
        {/* Rating badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="w-4 h-4 text-secondary-container fill-secondary-container" />
          <span className="text-sm font-bold font-sans text-on-surface">
            {restaurant.rating}
          </span>
        </div>
        {/* Banner/Promotion Tags */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {restaurant.bannerTag && (
            <span
              className={`px-3 py-1 rounded-lg text-white font-sans text-xs font-semibold shadow-sm ${
                restaurant.bannerTag === "Free Delivery"
                  ? "bg-primary"
                  : restaurant.bannerTag === "Premium Selection"
                  ? "bg-surface-bright backdrop-blur-md !text-on-surface border border-outline-variant/30"
                  : "bg-primary-container"
              }`}
            >
              {restaurant.bannerTag}
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-display font-semibold text-lg text-on-surface group-hover:text-primary transition-colors">
              {restaurant.name}
            </h3>
            <p className="text-sm font-sans text-on-surface-variant mt-1.5">
              {restaurant.cuisine}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-primary font-sans font-bold text-sm">
              {restaurant.deliveryTime}
            </p>
            <p className="text-xs font-sans text-on-surface-variant mt-1 flex items-center justify-end gap-0.5">
              <MapPin className="w-3 h-3 text-outline" />
              {restaurant.distance}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

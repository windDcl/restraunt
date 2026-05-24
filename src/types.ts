export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  tags: string[]; // e.g. ["Italian", "Pasta"]
  rating: number;
  reviewsCount?: string;
  bannerTag?: string; // e.g. "Free Delivery", "Popular Choice", "Premium Selection"
  deliveryTime: string; // e.g. "20-30 min"
  deliveryFee: number;
  distance: string; // e.g. "2.4 miles away" or "1.4 mi"
  image: string;
  featuredImageUrl?: string; // used for merchant details hero image
  menu: MenuItem[];
}

export interface CartItem {
  menuItem: MenuItem;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
}

export interface Address {
  name: string;
  line1: string;
  line2: string;
}

export interface Order {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  time: string;
  status: "Delivering" | "Completed" | "Cancelled";
  itemsCount: number;
  total: number;
  itemsSummary: string;
}

export type TabType = "Home" | "Search" | "Orders" | "Profile";

export interface UserProfile {
  name: string;
  avatar: string;
  tier: string;
  points: number;
  totalSaved: number;
  ordersCount: number;
  email: string;
}

export type MenuCategory = "招牌热菜" | "主食饭面" | "风味小吃" | "饮品" | "甜点";

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  available: boolean;
  stockQuantity: number;
}

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  slogan: string;
  rating: number;
  reviewsCount: string;
  address: string;
  phone: string;
  openHours: string;
  image: string;
  announcement: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Address {
  id?: number;
  name: string;
  line1: string;
  line2: string;
}

export interface OrderLineItem {
  id: number;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export type OrderStatus = "待接单" | "制作中" | "待取餐" | "已完成" | "已取消";

export interface Order {
  id: number;
  orderNo?: string;
  customerName: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  time: string;
  status: OrderStatus;
  itemsCount: number;
  total: number;
  itemsSummary: string;
  items: OrderLineItem[];
  note?: string | null;
}

export type TabType = "Home" | "Search" | "Orders" | "Profile";

export interface UserProfile {
  id: number;
  name: string;
  avatar: string;
  tier: string;
  points: number;
  totalSpent: number;
  ordersCount: number;
  email: string;
}

export interface AdminSession {
  id: number;
  username: string;
  displayName: string;
}

export interface BootstrapPayload {
  restaurant: Restaurant;
  pickupAddress: Address;
  menuItems: MenuItem[];
  userProfile: UserProfile;
  orders: Order[];
}

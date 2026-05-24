import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  Star,
  Clock,
  MapPin,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle,
  TrendingDown,
  Gift,
  CreditCard,
  X,
  MapPin as MapIcon,
  Tag,
  Receipt,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Bell,
  ArrowRight
} from "lucide-react";

import {
  CUISINES,
  MOCK_RESTAURANTS,
  INITIAL_USER,
  INITIAL_ORDERS,
  DEFAULT_ADDRESS
} from "./data";
import { Restaurant, MenuItem, CartItem, Order, TabType, UserProfile } from "./types";
import Header from "./components/Header";
import BottomNavBar from "./components/BottomNavBar";
import RestaurantCard from "./components/RestaurantCard";
import CartFloatingBar from "./components/CartFloatingBar";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("Home");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  
  // Initialize cart with the items matching the mockup checkout totals
  // Truffle Wagyu Burger ($18.50) + Crispy Buffalo Wings ($12.00) = $30.50 subtotal
  const [cart, setCart] = useState<CartItem[]>(() => {
    const sizzlingRestaurant = MOCK_RESTAURANTS.find((r) => r.id === "sizzling-grill")!;
    const items: CartItem[] = [];
    
    const burgerItem = sizzlingRestaurant.menu.find((item) => item.id === "truffle-wagyu-burger");
    if (burgerItem) {
      items.push({
        menuItem: burgerItem,
        restaurantId: sizzlingRestaurant.id,
        restaurantName: sizzlingRestaurant.name,
        quantity: 1
      });
    }
    
    const wingsItem = sizzlingRestaurant.menu.find((item) => item.id === "crispy-buffalo-wings");
    if (wingsItem) {
      items.push({
        menuItem: wingsItem,
        restaurantId: sizzlingRestaurant.id,
        restaurantName: sizzlingRestaurant.name,
        quantity: 1
      });
    }
    return items;
  });

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [isPromoApplied, setIsPromoApplied] = useState(true); // Default applied matching checkout total -$5.00
  const [couponDiscount, setCouponDiscount] = useState(5.00);

  // Screen level routing state
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Ordering simulation state
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Active category in merchant sidebar
  const [activeMerchantCategory, setActiveMerchantCategory] = useState("Combos");

  // Notification Banner State
  const [notification, setNotification] = useState<string | null>(null);

  // Handle flash message notifications
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Toggle active tab or clear states if clicking main flow
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedRestaurant(null);
    setShowCheckout(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Compute total numbers of items in the cart
  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Compute subtotal on the current items in the cart
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  }, [cart]);

  // Handler for opening Sizzling Grill restaurant details directly
  const handleFeaturedBannerClick = () => {
    const grill = MOCK_RESTAURANTS.find((r) => r.id === "sizzling-grill");
    if (grill) {
      setSelectedRestaurant(grill);
      setActiveMerchantCategory("Combos");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Cart operations
  const addToCart = (item: MenuItem, restaurant: Restaurant) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (c) => c.menuItem.id === item.id && c.restaurantId === restaurant.id
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        triggerNotification(`Added another ${item.name} to cart!`);
        return updated;
      } else {
        triggerNotification(`Added ${item.name} to cart!`);
        return [
          ...prevCart,
          {
            menuItem: item,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            quantity: 1
          }
        ];
      }
    });
  };

  const updateQuantity = (menuItemId: string, change: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.menuItem.id === menuItemId) {
            const nextQty = item.quantity + change;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  // Apply code promo
  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "GOURMET50") {
      setIsPromoApplied(true);
      setCouponDiscount(10.00);
      setPromoMessage("Coupon GOURMET50 Applied! $10.00 OFF");
    } else if (code === "WELCOME") {
      setIsPromoApplied(true);
      setCouponDiscount(5.00);
      setPromoMessage("Coupon WELCOME Applied! $5.00 OFF");
    } else if (code === "") {
      setPromoMessage("Please enter a coupon code.");
    } else {
      setIsPromoApplied(true);
      setCouponDiscount(3.00);
      setPromoMessage(`Coupon "${code}" applied - $3.00 off!`);
    }
  };

  // Trigger place order animation
  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    
    setTimeout(() => {
      // Confirmed state
      setOrderConfirmed(true);
      
      setTimeout(() => {
        // Complete order & Transition back to list
        const deliveryFee = 2.99;
        const discount = isPromoApplied ? couponDiscount : 0;
        const totalPaid = Math.max(1.00, cartSubtotal + deliveryFee - discount);

        // Build new orders
        const newOrderId = `GP-${Math.floor(1000 + Math.random() * 9000)}`;
        const primaryRestId = cart[0]?.restaurantId || "sizzling-grill";
        const matchedRestaurant = MOCK_RESTAURANTS.find(r => r.id === primaryRestId) || MOCK_RESTAURANTS[0];

        const firstItemName = cart[0]?.menuItem.name || "Meal Order";
        const summaryText = cart.length > 1 
          ? `${firstItemName} & ${cart.length - 1} other items`
          : `${firstItemName}`;

        const newOrder: Order = {
          id: newOrderId,
          restaurantName: matchedRestaurant.name,
          restaurantImage: matchedRestaurant.image,
          date: "Just Now",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "Delivering",
          itemsCount: cartItemCount,
          total: Number(totalPaid.toFixed(2)),
          itemsSummary: `${cartItemCount} ${cartItemCount === 1 ? 'item' : 'items'} • #${newOrderId}`
        };

        // Prepend new order
        setOrders(prev => [newOrder, ...prev]);

        // Increment user score/pts
        setUserProfile(prev => ({
          ...prev,
          points: prev.points + 120,
          ordersCount: prev.ordersCount + 1,
          totalSaved: prev.totalSaved + (isPromoApplied ? couponDiscount : 0)
        }));

        // Reset state
        setCart([]);
        setIsPromoApplied(false);
        setPromoCode("");
        setPromoMessage(null);
        setIsPlacingOrder(false);
        setOrderConfirmed(false);
        setShowCheckout(false);
        setSelectedRestaurant(null);
        
        // Go to Orders Screen so the user can track their active "Delivering" order!
        setActiveTab("Orders");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1500);
    }, 2000);
  };

  // Filter restaurants based on queries and cuisine category selections
  const filteredRestaurants = useMemo(() => {
    return MOCK_RESTAURANTS.filter((r) => {
      const matchCuisine = selectedCuisine 
        ? r.tags.some(tag => tag.toLowerCase() === selectedCuisine.toLowerCase())
        : true;
      
      const matchText = searchQuery 
        ? r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.menu.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;

      return matchCuisine && matchText;
    });
  }, [selectedCuisine, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed flex flex-col justify-between max-w-full overflow-x-hidden antialiased pb-28">
      {/* Toast notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg border border-outline-variant/10 text-center"
          >
            <Sparkles className="w-4 h-4 text-secondary-container" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER ROUTrES OR SCREENS */}
      {selectedRestaurant ? (
        /* SCREEN 2: MERCHANT DETAIL */
        <div className="flex-1 flex flex-col">
          {/* Merchant Navigation Header */}
          <header className="w-full top-0 sticky bg-surface shadow-sm flex justify-between items-center px-4 h-16 z-40">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="p-1 hover:bg-surface-container-high transition-colors active:scale-95 rounded-full cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-primary"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <h1 className="font-display font-bold text-headline-lg-mobile text-primary tracking-tight">
                GourmetGo
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowCheckout(true)} className="relative p-2 text-primary cursor-pointer hover:bg-surface-container rounded-full antialiased">
                <ShoppingBag className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-primary-container text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold font-sans ring-2 ring-surface">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant">
                <img
                  alt="User avatar"
                  className="w-full h-full object-cover"
                  src={userProfile.avatar}
                />
              </div>
            </div>
          </header>

          {/* Hero Banner Section */}
          <section className="relative w-full h-64 overflow-hidden">
            <img
              alt={selectedRestaurant.name}
              className="w-full h-full object-cover brightness-95"
              src={selectedRestaurant.image}
            />
            {/* Background Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="bg-secondary-container text-on-secondary-container font-sans text-xs font-bold px-3 py-1 rounded-lg mb-2 inline-block shadow-sm">
                    {selectedRestaurant.bannerTag || "Popular Choice"}
                  </span>
                  <h2 className="text-white font-display text-2xl md:text-3xl font-bold tracking-tight">
                    {selectedRestaurant.name}
                  </h2>
                  <p className="text-white/90 font-sans text-xs md:text-sm mt-1.5 opacity-90">
                    {selectedRestaurant.cuisine}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl text-white text-center min-w-[84px] shadow-sm shrink-0">
                  <div className="flex items-center justify-center gap-0.5">
                    <Star className="w-4 h-4 text-secondary-container fill-secondary-container" />
                    <span className="font-display font-bold text-base">
                      {selectedRestaurant.rating}
                    </span>
                  </div>
                  <p className="text-[9px] font-sans font-semibold uppercase tracking-wider opacity-85 mt-0.5">
                    {selectedRestaurant.reviewsCount || "1k+"} Reviews
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Stats Info Bar */}
          <div className="mx-4 -mt-6 relative z-10 bg-surface-bright shadow-md rounded-xl p-4 flex justify-between items-center border border-outline-variant/30">
            <div className="flex items-center gap-2 flex-1 justify-center">
              <Clock className="w-4.5 h-4.5 text-primary shrink-0" />
              <div>
                <p className="text-[10px] font-sans font-semibold uppercase tracking-wider text-on-surface-variant opacity-80">
                  Delivery
                </p>
                <p className="font-sans font-bold text-sm text-on-surface">
                  {selectedRestaurant.deliveryTime}
                </p>
              </div>
            </div>
            
            <div className="w-px h-8 bg-outline-variant/50"></div>
            
            <div className="flex items-center gap-2 flex-1 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125a1.125 1.125 0 0 0 1.125-1.125V9.75M3.75 12h13.75c.621 0 1.125-.504 1.125-1.125V8.25c0-.621-.504-1.125-1.125-1.125H3.75c-.621 0-1.125.504-1.125 1.125v2.625c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
              <div>
                <p className="text-[10px] font-sans font-semibold uppercase tracking-wider text-on-surface-variant opacity-80">
                  Fee
                </p>
                <p className="font-sans font-bold text-sm text-on-surface">
                  {selectedRestaurant.deliveryFee > 0 ? `$${selectedRestaurant.deliveryFee}` : "Free"}
                </p>
              </div>
            </div>
            
            <div className="w-px h-8 bg-outline-variant/50"></div>
            
            <div className="flex items-center gap-2 flex-1 justify-center">
              <MapIcon className="w-4.5 h-4.5 text-primary shrink-0" />
              <div>
                <p className="text-[10px] font-sans font-semibold uppercase tracking-wider text-on-surface-variant opacity-80">
                  Distance
                </p>
                <p className="font-sans font-bold text-sm text-on-surface">
                  {selectedRestaurant.distance}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Interactive Layout with categories sidebar */}
          <main className="mt-6 px-4 pb-36 flex gap-4 md:gap-8 max-w-5xl mx-auto w-full">
            {/* Left Sidebar Categories list */}
            <aside className="w-24 md:w-44 shrink-0">
              <div className="sticky top-20 flex flex-col gap-2">
                {["Combos", "Burgers", "Sides", "Drinks", "Desserts"].map((category) => {
                  const isActive = activeMerchantCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveMerchantCategory(category)}
                      className={`text-left py-3 px-3 rounded-xl font-sans font-semibold text-xs md:text-sm active:scale-98 transition-all border-l-4 ${
                        isActive
                          ? "bg-primary-container/10 text-primary border-primary font-bold"
                          : "text-on-surface-variant hover:bg-surface-container border-transparent"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Menu Items lists */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="font-display font-bold text-xl text-on-surface mb-4">
                  {activeMerchantCategory}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRestaurant.menu
                    .filter((item) => item.category === activeMerchantCategory)
                    .map((item) => {
                      // Check if item is in cart to display count
                      const cartMatch = cart.find(
                        (c) => c.menuItem.id === item.id && c.restaurantId === selectedRestaurant.id
                      );
                      const quantity = cartMatch ? cartMatch.quantity : 0;

                      return (
                        <div
                          key={item.id}
                          className="bg-surface-container-lowest rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex gap-3 border border-outline-variant/10 group"
                        >
                          {/* Image container with nice aspect ratio */}
                          <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-surface-container relative">
                            <img
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                              src={item.image}
                            />
                            {quantity > 0 && (
                              <div className="absolute inset-0 bg-black/40 backdrop-blur-2 xs flex items-center justify-center text-white text-base font-bold font-sans">
                                {quantity}x
                              </div>
                            )}
                          </div>

                          {/* Detail summary & Pricing */}
                          <div className="flex flex-col justify-between flex-1 min-w-0">
                            <div>
                              <h4 className="font-display font-semibold text-sm md:text-base text-on-surface truncate group-hover:text-primary transition-colors">
                                {item.name}
                              </h4>
                              <p className="text-on-surface-variant font-sans text-xs line-clamp-2 mt-1 min-h-[32px] leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                            
                            <div className="flex justify-between items-center mt-2">
                              <span className="font-sans font-bold text-sm text-primary">
                                ${item.price.toFixed(2)}
                              </span>
                              
                              <div className="flex items-center gap-1.5">
                                {quantity > 0 && (
                                  <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="bg-surface-container text-primary font-bold w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform cursor-pointer hover:bg-outline-variant/40"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => addToCart(item, selectedRestaurant)}
                                  className="bg-primary-container hover:bg-primary-container/90 text-white w-7 h-7 rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-sm cursor-pointer"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </main>

          {/* Checkout Bar triggers on Screen 2 */}
          <CartFloatingBar
            itemCount={cartItemCount}
            subtotal={cartSubtotal}
            onClick={() => setShowCheckout(true)}
            variant="merchant"
          />
        </div>
      ) : showCheckout ? (
        /* SCREEN 3: CHECKOUT SCREEN */
        <div className="flex-1 flex flex-col">
          {/* Top navigation for checkout */}
          <header className="header sticky top-0 z-40 bg-white shadow-sm flex items-center justify-between px-4 h-16 transition-all duration-300">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCheckout(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <span className="font-display font-bold text-headline-lg-mobile text-primary tracking-tight">
                GourmetGo Checkout
              </span>
            </div>
            <div>
              <Receipt className="w-5 h-5 text-primary" />
            </div>
          </header>

          <main className="max-w-md mx-auto px-4 pb-48 w-full flex-1">
            {/* Delivery Location Section */}
            <section className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold text-base text-on-surface">
                  Delivery Address
                </h2>
                <button 
                  onClick={() => triggerNotification("Delivery addresses are preset for Beverly Hills area.")}
                  className="text-primary font-sans font-bold text-xs hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5.5 h-5.5 text-primary fill-primary/20" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-sans font-bold text-sm text-on-surface">
                    {address.name}
                  </span>
                  <span className="font-sans text-xs text-on-surface-variant opacity-90 mt-0.5 truncate">
                    {address.line1}
                  </span>
                  <span className="font-sans text-xs text-on-surface-variant opacity-80 mt-0.5">
                    {address.line2}
                  </span>
                </div>
              </div>
            </section>

            {/* Divider divider */}
            <div className="h-px bg-surface-container/60 my-6"></div>

            {/* Selected food items in cart list */}
            <section className="order-items">
              <h2 className="font-display font-bold text-base text-on-surface mb-4">
                Your Order
              </h2>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm font-sans text-on-surface-variant">Your cart is empty.</p>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="mt-3 bg-primary text-white font-sans font-bold text-xs px-4 py-2 rounded-xl"
                  >
                    Add Delicious Food
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.menuItem.id} className="flex items-start gap-4">
                      {/* Thumbnail frame with shadow */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface-container shadow-sm border border-outline-variant/10">
                        <img
                          alt={item.menuItem.name}
                          className="w-full h-full object-cover"
                          src={item.menuItem.image}
                        />
                      </div>
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex justify-between items-start">
                          <span className="font-sans font-bold text-sm text-on-surface truncate pr-1">
                            {item.menuItem.name}
                          </span>
                          <span className="font-sans font-bold text-sm text-on-surface shrink-0">
                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <span className="font-sans text-xs text-on-surface-variant opacity-90 mt-1 line-clamp-1">
                          {item.menuItem.category === "Combos" ? "Signature combo choice" : item.menuItem.description}
                        </span>
                        
                        {/* Adjust qty buttons */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-outline-variant rounded-full px-2 py-1 bg-surface-container-low">
                            <button
                              onClick={() => updateQuantity(item.menuItem.id, -1)}
                              className="w-5 h-5 flex items-center justify-center text-primary active:scale-90 transition-transform cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="mx-3 font-sans font-bold text-xs text-on-surface select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.menuItem.id, 1)}
                              className="w-5 h-5 flex items-center justify-center text-primary active:scale-95 transition-transform cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Promo input wrapper matching mockup screen */}
              <div className="mt-6 flex flex-col gap-2">
                <div className="relative">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 pl-4 pr-24 text-xs font-sans font-medium focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="Enter Coupon (e.g. GOURMET50, WELCOME)"
                    type="text"
                  />
                  <button
                    onClick={applyPromo}
                    className="absolute right-2 top-2 bottom-2 px-4 bg-primary/15 hover:bg-primary/25 text-primary rounded-lg font-sans font-bold text-xs cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className="text-[11px] font-sans font-semibold text-primary/95 italic ml-1">
                    {promoMessage}
                  </p>
                )}
              </div>
            </section>

            {/* Divider divider */}
            <div className="h-px bg-surface-container/60 my-6"></div>

            {/* Cost summaries matching mock total lists exactly */}
            <section className="payment-details">
              <h2 className="font-display font-bold text-base text-on-surface mb-4">
                Payment Details
              </h2>
              <div className="space-y-3 font-sans text-xs md:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant opacity-90">Subtotal</span>
                  <span className="text-on-surface font-semibold">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant opacity-90">Delivery Fee</span>
                  <span className="text-on-surface font-semibold">$2.99</span>
                </div>
                {isPromoApplied && (
                  <div className="flex justify-between items-center text-primary">
                    <span className="font-bold flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Discount
                    </span>
                    <span className="font-bold">-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-surface-container-highest/60 flex justify-between items-center">
                  <span className="font-display font-bold text-base text-on-surface">Total</span>
                  <span className="font-display font-bold text-lg text-primary">
                    ${Math.max(1.00, cartSubtotal + 2.99 - (isPromoApplied ? couponDiscount : 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </section>
          </main>

          {/* Checkout Action Bottom Bar containing payment selection and CTA button */}
          <div className="fixed bottom-0 left-0 w-full z-40 bg-white shadow-[0_-4px_20px_rgba(255,87,34,0.08)] px-4 py-5 pb-safe rounded-t-[24px] border-t border-surface-container-highest">
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex items-center gap-3 bg-surface-container-low rounded-xl p-3 border border-outline-variant/50">
                <CreditCard className="w-5 h-5 text-secondary fill-secondary/15 shrink-0" />
                <span className="font-sans font-bold text-xs text-on-surface flex-1">
                  Visa •••• 4242
                </span>
                <button 
                  onClick={() => triggerNotification("Card details are pre-configured for verification.")}
                  className="text-primary font-sans font-bold text-[11px] cursor-pointer hover:underline"
                >
                  Edit
                </button>
              </div>

              <button
                disabled={isPlacingOrder || cart.length === 0}
                onClick={handlePlaceOrder}
                className="w-full bg-primary-container text-white py-4 rounded-2xl font-display font-bold text-base shadow-[0_8px_20px_rgba(255,87,34,0.25)] hover:shadow-[0_12px_28px_rgba(255,87,34,0.35)] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer h-14"
              >
                {isPlacingOrder ? (
                  <div className="flex items-center gap-2">
                    {/* Compact loading spinner */}
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>{orderConfirmed ? "Order Confirmed!" : "Processing Order..."}</span>
                  </div>
                ) : (
                  <>
                    <span>Place Order</span>
                    <ArrowRight className="w-5 h-5 text-white" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* RENDER BASIC TAB WORKFLOW SHELL WITH NAV TABS */
        <div className="flex-1 flex flex-col">
          {/* Reuse the custom premium Header bar */}
          <Header
            user={userProfile}
            cartCount={cartItemCount}
            onCartClick={() => setShowCheckout(true)}
            onProfileClick={() => handleTabChange("Profile")}
          />

          {/* MAIN CONTAINER CONTROLLING ACTIVE TABS */}
          <div className="flex-1">
            {activeTab === "Home" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Search anchor bar matching page 1 */}
                <section className="px-4 mt-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Search className="w-5 h-5 text-on-surface-variant/80" />
                    </div>
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-12 focus:ring-1 focus:ring-primary/20 text-sm font-sans placeholder-on-surface-variant/60 shadow-sm transition-all outline-none"
                      placeholder="Cravings? Search restaurants or dishes..."
                      type="text"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-primary" onClick={() => handleTabChange("Search")}>
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                  </div>
                </section>

                {/* Explore Cuisines category checklist scroller */}
                <section>
                  <div className="flex justify-between items-center px-4 mb-3">
                    <h2 className="font-display font-semibold text-base text-on-surface">
                      Explore Cuisines
                    </h2>
                    <button
                      onClick={() => handleTabChange("Search")}
                      className="text-primary font-sans font-bold text-xs hover:underline cursor-pointer"
                    >
                      See All
                    </button>
                  </div>
                  
                  {/* Category Horizontal list wrap */}
                  <div className="flex overflow-x-auto gap-4 px-4 no-scrollbar pb-2">
                    {CUISINES.map((cuisine) => {
                      const isSelected = selectedCuisine === cuisine.name;
                      return (
                        <div
                          key={cuisine.name}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedCuisine(null); // click to reset filter
                            } else {
                              setSelectedCuisine(cuisine.name);
                              triggerNotification(`Filtered by ${cuisine.name}`);
                            }
                          }}
                          className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group select-none"
                        >
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isSelected
                                ? "ring-2 ring-primary bg-primary-container/10 scale-103"
                                : "bg-surface-container-highest group-hover:bg-primary-container/15"
                            }`}
                          >
                            <img
                              alt={cuisine.name}
                              className="w-12 h-12 object-cover rounded-full"
                              src={cuisine.image}
                            />
                          </div>
                          <span
                            className={`text-xs font-sans font-medium transition-colors ${
                              isSelected ? "text-primary font-boldScale" : "text-on-surface-variant"
                            }`}
                          >
                            {cuisine.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Promo Banner element mimicking mockup screen */}
                <section className="px-4">
                  <div
                    onClick={handleFeaturedBannerClick}
                    className="bg-gradient-to-br from-[#b02f00] to-[#ff5722] rounded-2xl p-6 relative overflow-hidden shadow-md shadow-primary/10 cursor-pointer group hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative z-10 max-w-[62%]">
                      <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                        50% OFF
                      </h3>
                      <p className="font-sans text-xs text-white/90 mt-1 leading-relaxed">
                        On your first 3 orders with GourmetGo
                      </p>
                      <button className="mt-4 bg-white hover:bg-surface-bright text-primary px-5 py-2 rounded-full font-sans font-bold text-xs active:scale-95 transition-transform cursor-pointer shadow-sm">
                        Claim Now
                      </button>
                    </div>

                    {/* chicken design ornament vector */}
                    <div className="absolute right-[-24px] top-[-10px] w-36 h-36 origin-center transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6">
                      <img
                        alt="Med Roast Feast"
                        className="w-full h-full object-cover rounded-full border-4 border-white/20 shadow-lg"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL0pjvbpbRidUt3J65d2aofS6AV-E2hW0sDILC_4qa78I0-POfWAwiGDTystlOonXhURuSRg7B6XRM8kKIARp8My4i5AtKfqbCffI0T9cUmNtil0ECu80TMsNUT4U5oByJupqltM5eafHXGv-sgTton1PN32s9lX-S0IRZsUYh8R8PjW5tNgaSk5xaqqZ9MeGKm6INnXh0bWGesY74XFipYn8zi1lJCtZ6TeFXtEcm2r4_u4Z8kKU-hQGhwGB3k3wKNAFfQ-AMwkY"
                      />
                    </div>
                  </div>
                </section>

                {/* Nearby Restaurants listing of page 1 */}
                <section className="space-y-4">
                  <div className="flex justify-between items-center px-4 mb-2">
                    <h2 className="font-display font-semibold text-base text-on-surface">
                      {selectedCuisine ? `${selectedCuisine} Places` : "Nearby Restaurants"}
                    </h2>
                    <div className="flex gap-2 text-on-surface-variant">
                      <button 
                        onClick={() => {
                          setSelectedCuisine(null);
                          setSearchQuery("");
                          triggerNotification("Restored standard layout and sorting filters.");
                        }}
                        className="text-primary hover:text-primary/80 transition-colors cursor-pointer text-xs font-sans font-bold flex items-center gap-1"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        Clear Filter
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6 px-4">
                    {filteredRestaurants.length === 0 ? (
                      <div className="text-center py-10 bg-surface-container-low rounded-xl">
                        <p className="text-sm font-sans text-on-surface-variant">
                          No restaurants match your filters.
                        </p>
                        <button
                          onClick={() => {
                            setSelectedCuisine(null);
                            setSearchQuery("");
                          }}
                          className="mt-3 text-xs font-sans font-bold text-primary hover:underline"
                        >
                          Show All Options
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Featured Top listing restaurants */}
                        {filteredRestaurants.slice(0, 2).map((restaurant) => (
                          <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            onClick={() => {
                              setSelectedRestaurant(restaurant);
                              setActiveMerchantCategory("Combos");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          />
                        ))}

                        {/* Bento dynamic side-by-side grid listing restaurant cards */}
                        {filteredRestaurants.length > 2 && (
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            {filteredRestaurants.slice(2).map((restaurant) => (
                              <RestaurantCard
                                key={restaurant.id}
                                restaurant={restaurant}
                                variant="grid"
                                onClick={() => {
                                  setSelectedRestaurant(restaurant);
                                  setActiveMerchantCategory("Combos");
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === "Search" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 px-4 pt-4"
              >
                {/* Real-time search and filter screen */}
                <div>
                  <h2 className="font-display font-bold text-xl text-on-surface">Search</h2>
                  <p className="text-xs font-sans text-on-surface-variant opacity-95 mt-1">
                    Discover local gourmet cuisines, dishes, and delicacies
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-primary/25 text-sm font-sans placeholder-on-surface-variant/70 shadow-sm transition-all outline-none"
                    placeholder="Search by meal name, tag or restaurant..."
                    type="text"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 inset-y-0 flex items-center text-on-surface-variant/80 hover:text-primary transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Popular searches suggestions */}
                <div>
                  <h3 className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                    Popular Cravings
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {["Burgers", "Sushi", "Truffle", "Spicy", "Pasta", "Ramen"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSearchQuery(tag);
                          triggerNotification(`Searching for "${tag}"`);
                        }}
                        className="bg-surface-container-low hover:bg-primary-container/10 hover:text-primary px-3 py-2 rounded-xl text-on-surface font-semibold shrink-0 cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Results */}
                <div className="space-y-4">
                  <h3 className="text-sm font-sans font-bold text-on-surface">
                    Results ({filteredRestaurants.length})
                  </h3>
                  
                  <div className="space-y-4">
                    {filteredRestaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        onClick={() => {
                          setSelectedRestaurant(restaurant);
                          setActiveMerchantCategory("Combos");
                        }}
                        className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20 hover:border-primary/20 cursor-pointer flex gap-4 transition-all duration-300"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container/60">
                          <img
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                            src={restaurant.image}
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h4 className="font-display font-semibold text-sm md:text-base text-on-surface truncate">
                              {restaurant.name}
                            </h4>
                            <p className="text-xs font-sans text-on-surface-variant truncate mt-0.5">
                              {restaurant.cuisine}
                            </p>
                          </div>
                          
                          <div className="flex justify-between items-center text-xs mt-1">
                            <span className="text-primary font-bold">{restaurant.deliveryTime}</span>
                            <span className="text-on-surface-variant font-medium flex items-center gap-0.5">
                              <Star className="w-3.5 h-3.5 text-secondary-container fill-secondary-container" />
                              {restaurant.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Orders" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 px-4 pt-4"
              >
                {/* Dynamic Orders tracking screen */}
                <div>
                  <h2 className="font-display font-bold text-xl text-on-surface">Your Orders</h2>
                  <p className="text-xs font-sans text-on-surface-variant opacity-95 mt-1">
                    Track live deliveries or check culinary histories
                  </p>
                </div>

                {/* Active/Delivering order highlights */}
                <div className="space-y-4">
                  {orders.filter(o => o.status === "Delivering").map((item) => (
                    <div
                      key={item.id}
                      className="bg-primary-container/[0.04] border-2 border-primary-container/20 rounded-2xl p-5 shadow-sm space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container-high border border-outline-variant/30 relative">
                            <img
                              alt={item.restaurantName}
                              className="w-full h-full object-cover"
                              src={item.restaurantImage}
                            />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-base text-on-surface">
                              {item.restaurantName}
                            </h3>
                            <p className="text-primary font-sans font-bold text-xs mt-1 animate-pulse flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full bg-primary-container inline-block"></span>
                              Active Delivery • On the Way!
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-primary-container text-white text-xs font-semibold rounded-full select-none shadow-sm shadow-primary/10">
                          Live Track
                        </span>
                      </div>

                      {/* Delivery meter progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-sans text-on-surface-variant inline-block font-semibold">
                          <span>Preparing Meal</span>
                          <span className="text-primary">Out for Delivery (10 min away)</span>
                          <span>Arrived</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                          <div className="bg-primary-container h-full w-[75%] rounded-full animate-pulse"></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20 font-sans">
                        <span>OrderId: {item.id}</span>
                        <span className="font-bold text-primary font-sans text-sm">${item.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}

                  {/* Completed / past Orders list */}
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-base text-on-surface">Past Deliveries</h3>
                    
                    {orders.filter(o => o.status !== "Delivering").map((order) => (
                      <div
                        key={order.id}
                        className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl flex justify-between items-center hover:shadow-sm transition-all duration-300"
                      >
                        <div className="flex gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface-container relative border border-outline-variant/10">
                            <img
                              alt={order.restaurantName}
                              className="w-full h-full object-cover"
                              src={order.restaurantImage}
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-display font-semibold text-sm text-on-surface truncate">
                              {order.restaurantName}
                            </h4>
                            <p className="text-[11px] font-sans text-on-surface-variant opacity-90 mt-0.5">
                              {order.date}, {order.time}
                            </p>
                            <p className="text-xs text-on-surface-variant mt-1 font-semibold">
                              {order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-sans font-semibold text-on-tertiary-fixed-variant bg-surface-container-high px-2 py-0.5 rounded-full block text-center">
                            Completed
                          </span>
                          <span className="text-sm font-sans font-bold text-on-surface block mt-2">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Profile" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 px-4 pt-4"
              >
                {/* Alex Thompson Profile page */}
                <section className="relative">
                  <div className="absolute inset-0 bg-primary-container/5 rounded-3xl -rotate-1 scale-103"></div>
                  
                  <div className="relative bg-surface p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-outline-variant">
                    <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-md transform -rotate-2 overflow-hidden shrink-0">
                      <img
                        alt="Alex Avatar"
                        className="w-full h-full object-cover"
                        src={userProfile.avatar}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h1 className="font-display font-bold text-xl text-on-surface truncate">
                        {userProfile.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full select-none shadow-sm">
                          {userProfile.tier}
                        </span>
                        <span className="text-on-surface-variant text-[11px] font-sans font-semibold flex items-center gap-0.5">
                          <Sparkles className="w-3 h-3 text-secondary-container fill-secondary-container" />
                          {userProfile.points} pts
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => triggerNotification("Settings are configured with default secure sandbox credentials.")}
                      className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-outline hover:text-primary transition-colors border border-outline-variant active:scale-90 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827a1.125 1.125 0 0 1 .26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </button>
                  </div>
                </section>

                {/* Quick bento statistics layout */}
                <section className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col gap-1">
                    <span className="text-on-surface-variant font-sans text-[11px] font-bold uppercase tracking-wider opacity-85">
                      Total Saved
                    </span>
                    <span className="text-headline-md font-display font-bold text-primary text-xl">
                      ${userProfile.totalSaved.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col gap-1">
                    <span className="text-on-surface-variant font-sans text-[11px] font-bold uppercase tracking-wider opacity-85">
                      Total Orders
                    </span>
                    <span className="text-headline-md font-display font-bold text-primary text-xl">
                      {userProfile.ordersCount}
                    </span>
                  </div>
                </section>

                {/* Profile recent orders histories */}
                <section className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h2 className="font-display font-bold text-base text-on-surface">Recent Activity</h2>
                    <button
                      onClick={() => handleTabChange("Orders")}
                      className="text-primary font-sans font-bold text-xs hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => {
                      const isDelivering = order.status === "Delivering";
                      return (
                        <div
                          key={order.id}
                          className="group relative bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-2xl shadow-xs transition-all duration-300"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex gap-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container-high border border-outline-variant/10">
                                <img
                                  alt={order.restaurantName}
                                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                                  src={order.restaurantImage}
                                />
                              </div>
                              <div>
                                <h3 className="font-display font-bold text-sm text-on-surface">
                                  {order.restaurantName}
                                </h3>
                                <p className="text-on-surface-variant/80 font-sans text-[11px]">
                                  {order.date}, {order.time}
                                </p>
                              </div>
                            </div>
                            
                            <span
                              className={`px-3 py-1 text-[11px] font-sans font-bold rounded-full ${
                                isDelivering
                                  ? "bg-primary-container text-white animate-pulse"
                                  : "bg-surface-container-high text-on-tertiary-fixed-variant"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20 font-sans">
                            <span className="text-on-surface-variant text-[11px]">
                              {order.itemsSummary}
                            </span>
                            <span className="text-primary font-display font-bold text-sm">
                              ${order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Account Settings Links matching mockup page 4 */}
                <section className="space-y-2 pb-6">
                  <h2 className="font-sans font-bold text-xs text-on-surface-variant uppercase tracking-widest px-1 opacity-80">
                    Account Services
                  </h2>
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden shadow-xs">
                    <button 
                      onClick={() => setShowCheckout(true)}
                      className="w-full flex items-center justify-between p-4 hover:bg-surface-container transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-primary group-hover:scale-103 transition-transform" />
                        <span className="font-sans font-semibold text-sm text-on-surface">
                          Payment Methods
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-outline" />
                    </button>
                    
                    <div className="h-[1px] bg-outline-variant/30 mx-4"></div>
                    
                    <button 
                      onClick={() => triggerNotification("Delivery addresses are pre-configured for Beverly Hills area.")}
                      className="w-full flex items-center justify-between p-4 hover:bg-surface-container transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary group-hover:scale-103 transition-transform" />
                        <span className="font-sans font-semibold text-sm text-on-surface">
                          Saved Addresses
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-outline" />
                    </button>
                    
                    <div className="h-[1px] bg-outline-variant/30 mx-4"></div>
                    
                    <button 
                      onClick={() => triggerNotification("Promo discount WELCOME ($5.00) and GOURMET50 ($10.00) are valid.")}
                      className="w-full flex items-center justify-between p-4 hover:bg-surface-container transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Tag className="w-5 h-5 text-primary group-hover:scale-103 transition-transform" />
                        <span className="font-sans font-semibold text-sm text-on-surface">
                          Promos & Credits
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-outline" />
                    </button>
                  </div>
                </section>
              </motion.div>
            )}
          </div>

          {/* Floating Action Cart bar on primary tab index */}
          <CartFloatingBar
            itemCount={cartItemCount}
            subtotal={cartSubtotal}
            onClick={() => setShowCheckout(true)}
            variant="home"
          />

          {/* Reusable premium Bottom Navigation Bar */}
          <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      )}
    </div>
  );
}

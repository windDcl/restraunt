import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Clock3,
  MapPin,
  Minus,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Store,
  UserRound,
  X,
} from "lucide-react";

import Header from "./components/Header";
import BottomNavBar from "./components/BottomNavBar";
import CartFloatingBar from "./components/CartFloatingBar";
import {
  Address,
  AdminSession,
  BootstrapPayload,
  CartItem,
  MenuCategory,
  MenuItem,
  Order,
  OrderStatus,
  Restaurant,
  TabType,
  UserProfile,
} from "./types";

const CATEGORY_OPTIONS: Array<"全部" | MenuCategory> = [
  "全部",
  "招牌热菜",
  "主食饭面",
  "风味小吃",
  "饮品",
  "甜点",
];

const ORDER_STATUS_OPTIONS: OrderStatus[] = ["待接单", "制作中", "待取餐", "已完成", "已取消"];

const EMPTY_MENU_FORM = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "招牌热菜" as MenuCategory,
};

const EMPTY_RESTAURANT: Restaurant = {
  id: 0,
  name: "",
  cuisine: "",
  slogan: "",
  rating: 0,
  reviewsCount: "",
  address: "",
  phone: "",
  openHours: "",
  image: "",
  announcement: "",
};

const EMPTY_USER: UserProfile = {
  id: 0,
  name: "",
  avatar: "",
  tier: "",
  points: 0,
  totalSpent: 0,
  ordersCount: 0,
  email: "",
};

const EMPTY_ADDRESS: Address = {
  name: "",
  line1: "",
  line2: "",
};

function formatCurrency(value: number) {
  return `¥${value.toFixed(2)}`;
}

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "请求失败" }));
    throw new Error(error.message || "请求失败");
  }

  return response.json();
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("Home");
  const [restaurant, setRestaurant] = useState<Restaurant>(EMPTY_RESTAURANT);
  const [pickupAddress, setPickupAddress] = useState<Address>(EMPTY_ADDRESS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(EMPTY_USER);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"全部" | MenuCategory>("全部");
  const [showCheckout, setShowCheckout] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [editingMenuId, setEditingMenuId] = useState<number | null>(null);
  const [menuForm, setMenuForm] = useState(EMPTY_MENU_FORM);
  const [uploadingImage, setUploadingImage] = useState(false);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart],
  );
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0),
    [cart],
  );

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === "全部" || item.category === activeCategory;
      const matchesQuery =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, menuItems, searchQuery]);

  const recommendedItems = useMemo(() => menuItems.slice(0, 3), [menuItems]);
  const activeOrders = useMemo(
    () => orders.filter((order) => !["已完成", "已取消"].includes(order.status)),
    [orders],
  );

  const triggerNotification = (message: string) => {
    setNotification(message);
    window.setTimeout(() => setNotification(null), 2400);
  };

  const loadBootstrap = async () => {
    setLoading(true);
    try {
      const payload = await requestJson<BootstrapPayload>("/api/bootstrap");
      setRestaurant(payload.restaurant);
      setPickupAddress(payload.pickupAddress);
      setMenuItems(payload.menuItems);
      setUserProfile(payload.userProfile);
      setOrders(payload.orders);
    } catch (error) {
      triggerNotification(error instanceof Error ? error.message : "加载数据失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBootstrap();
  }, []);

  const addToCart = (item: MenuItem) => {
    if (!item.available || item.stockQuantity <= 0) {
      triggerNotification(`${item.name} 当前库存不足`);
      return;
    }

    setCart((current) => {
      const found = current.find((entry) => entry.menuItem.id === item.id);
      if (found) {
        return current.map((entry) =>
          entry.menuItem.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        );
      }
      return [...current, { menuItem: item, quantity: 1 }];
    });
    triggerNotification(`已加入 ${item.name}`);
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCart((current) =>
      current
        .map((entry) =>
          entry.menuItem.id === itemId
            ? { ...entry, quantity: entry.quantity + delta }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    try {
      await requestJson("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          userId: userProfile.id,
          customerName: userProfile.name,
          pickupMethod: pickupAddress.name || "到店自取",
          note: "到店自取",
          items: cart.map((item) => ({
            menuItemId: item.menuItem.id,
            quantity: item.quantity,
          })),
        }),
      });

      setCart([]);
      setShowCheckout(false);
      setActiveTab("Orders");
      await loadBootstrap();
      triggerNotification("订单已提交，数据已写入数据库");
    } catch (error) {
      triggerNotification(error instanceof Error ? error.message : "下单失败");
    }
  };

  const submitAdminLogin = async () => {
    try {
      const admin = await requestJson<AdminSession>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({
          username: adminUsername,
          password: adminPassword,
        }),
      });
      setAdminSession(admin);
      setAdminError("");
      triggerNotification(`欢迎，${admin.displayName}`);
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : "登录失败");
    }
  };

  const resetMenuForm = () => {
    setEditingMenuId(null);
    setMenuForm(EMPTY_MENU_FORM);
  };

  const uploadMenuImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    try {
      const response = await fetch("/api/upload/menu-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "图片上传失败" }));
        throw new Error(error.message || "图片上传失败");
      }

      const result = (await response.json()) as { path: string };
      setMenuForm((current) => ({ ...current, image: result.path }));
      triggerNotification("图片已上传到项目目录");
    } catch (error) {
      triggerNotification(error instanceof Error ? error.message : "图片上传失败");
    } finally {
      setUploadingImage(false);
    }
  };

  const beginEditMenuItem = (item: MenuItem) => {
    setEditingMenuId(item.id);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      image: item.image,
      category: item.category,
    });
  };

  const saveMenuItem = async () => {
    if (!menuForm.name || !menuForm.description || !menuForm.price || !menuForm.image) {
      triggerNotification("请先补全菜品信息");
      return;
    }

    const payload = {
      name: menuForm.name,
      description: menuForm.description,
      price: Number(menuForm.price),
      image: menuForm.image,
      category: menuForm.category,
    };

    try {
      if (editingMenuId) {
        await requestJson(`/api/menu-items/${editingMenuId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        triggerNotification("菜品已更新到数据库");
      } else {
        await requestJson("/api/menu-items", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        triggerNotification("菜品已写入数据库");
      }
      resetMenuForm();
      await loadBootstrap();
    } catch (error) {
      triggerNotification(error instanceof Error ? error.message : "保存菜品失败");
    }
  };

  const toggleDishAvailability = async (item: MenuItem) => {
    try {
      await requestJson(`/api/menu-items/${item.id}/availability`, {
        method: "PATCH",
        body: JSON.stringify({ available: !item.available }),
      });
      await loadBootstrap();
      triggerNotification(`菜品已${item.available ? "停售" : "恢复在售"}`);
    } catch (error) {
      triggerNotification(error instanceof Error ? error.message : "更新菜品状态失败");
    }
  };

  const deleteDish = async (id: number) => {
    try {
      await requestJson(`/api/menu-items/${id}`, {
        method: "DELETE",
      });
      setCart((current) => current.filter((entry) => entry.menuItem.id !== id));
      if (editingMenuId === id) resetMenuForm();
      await loadBootstrap();
      triggerNotification("菜品已从数据库删除");
    } catch (error) {
      triggerNotification(error instanceof Error ? error.message : "删除菜品失败");
    }
  };

  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    try {
      await requestJson(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await loadBootstrap();
      triggerNotification(`订单状态已更新为“${status}”`);
    } catch (error) {
      triggerNotification(error instanceof Error ? error.message : "更新订单状态失败");
    }
  };

  const renderMenuCards = (items: MenuItem[]) => (
    <div className="grid grid-cols-1 gap-4">
      {items.map((item) => {
        const inCart = cart.find((entry) => entry.menuItem.id === item.id)?.quantity ?? 0;
        return (
          <div
            key={item.id}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 flex gap-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-base text-on-surface">
                      {item.name}
                    </h3>
                    {!item.available && (
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-[10px] font-bold text-on-surface-variant">
                        已停售
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-primary-container/10 text-[10px] font-bold text-primary">
                      库存 {item.stockQuantity}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-5">
                    {item.description}
                  </p>
                </div>
                <span className="font-bold text-primary whitespace-nowrap">
                  {formatCurrency(item.price)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px] text-on-surface-variant">{item.category}</span>
                <div className="flex items-center gap-2">
                  {inCart > 0 && (
                    <>
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-full bg-surface-container text-primary flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold min-w-4 text-center">{inCart}</span>
                    </>
                  )}
                  <button
                    onClick={() => addToCart(item)}
                    className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center cursor-pointer disabled:opacity-50"
                    disabled={!item.available}
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
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-primary">渔香记小馆</p>
          <p className="text-sm text-on-surface-variant mt-2">正在从数据库加载数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans antialiased pb-28">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-full text-xs font-semibold shadow-lg"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <Header
        user={userProfile}
        cartCount={cartCount}
        onCartClick={() => setShowCheckout(true)}
        onProfileClick={() => setActiveTab("Profile")}
        onAdminClick={() => {
          setShowAdminPanel(true);
          setAdminError("");
        }}
      />

      <main className="max-w-5xl mx-auto px-4 pt-4">
        {activeTab === "Home" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <section className="rounded-[28px] overflow-hidden bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
              <div className="relative h-64">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-6 flex flex-col justify-end">
                  <span className="w-fit px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white backdrop-blur">
                    数据来自 MySQL
                  </span>
                  <h1 className="mt-3 text-white text-3xl font-display font-bold">{restaurant.name}</h1>
                  <p className="text-white/90 text-sm mt-1">{restaurant.slogan}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-[11px] text-on-surface-variant">评分</p>
                  <p className="mt-1 font-bold text-lg">{restaurant.rating}</p>
                  <p className="text-xs text-on-surface-variant">{restaurant.reviewsCount}</p>
                </div>
                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-[11px] text-on-surface-variant">营业时间</p>
                  <p className="mt-1 font-bold text-lg">{restaurant.openHours}</p>
                  <p className="text-xs text-on-surface-variant">门店实时数据</p>
                </div>
                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-[11px] text-on-surface-variant">联系电话</p>
                  <p className="mt-1 font-bold text-lg">{restaurant.phone}</p>
                  <p className="text-xs text-on-surface-variant">前台可咨询</p>
                </div>
                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-[11px] text-on-surface-variant">取餐方式</p>
                  <p className="mt-1 font-bold text-lg">{pickupAddress.name || "到店自取"}</p>
                  <p className="text-xs text-on-surface-variant">支持堂食点餐</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-primary-container/10 border border-primary-container/15 p-5">
              <div className="flex items-start gap-3">
                <Store className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h2 className="font-display font-bold text-lg">门店公告</h2>
                  <p className="text-sm text-on-surface-variant mt-1">{restaurant.announcement}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-on-surface-variant">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {restaurant.address}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {restaurant.phone}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="w-4 h-4" />
                      {restaurant.openHours}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-xl">今日推荐</h2>
                  <p className="text-sm text-on-surface-variant mt-1">热门菜品直接从数据库菜单表读取</p>
                </div>
                <button
                  onClick={() => setActiveTab("Search")}
                  className="text-primary font-bold text-sm cursor-pointer"
                >
                  查看完整菜单
                </button>
              </div>
              {renderMenuCards(recommendedItems)}
            </section>
          </motion.div>
        )}

        {activeTab === "Search" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <section>
              <h2 className="font-display font-bold text-xl">店内菜单</h2>
              <p className="text-sm text-on-surface-variant mt-1">菜品、库存、上下架状态都来自 MySQL</p>
            </section>

            <section className="bg-surface-container-low rounded-2xl px-4 py-3 flex items-center gap-3">
              <Search className="w-5 h-5 text-on-surface-variant" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="搜索菜品名称或口味"
                className="bg-transparent flex-1 outline-none text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-on-surface-variant cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </section>

            <section className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {CATEGORY_OPTIONS.map((category) => {
                const active = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap cursor-pointer ${
                      active
                        ? "bg-primary-container text-white"
                        : "bg-surface-container-low text-on-surface-variant"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </section>

            {renderMenuCards(filteredMenu)}
          </motion.div>
        )}

        {activeTab === "Orders" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <section>
              <h2 className="font-display font-bold text-xl">我的订单</h2>
              <p className="text-sm text-on-surface-variant mt-1">订单记录、订单明细和状态都来自数据库</p>
            </section>

            {activeOrders.length > 0 && (
              <section className="space-y-3">
                <h3 className="font-display font-bold text-base">进行中的订单</h3>
                {activeOrders.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-primary-container/20 bg-primary-container/[0.05] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display font-bold text-lg">{order.restaurantName}</p>
                        <p className="text-sm text-on-surface-variant mt-1">{order.itemsSummary}</p>
                        <p className="text-xs text-on-surface-variant mt-2">
                          订单号：{order.orderNo || order.id} · {order.date} {order.time}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-primary-container text-white text-xs font-bold">
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                      <div className="text-sm text-on-surface-variant">{order.note || "无备注"}</div>
                      <div className="font-bold text-primary">{formatCurrency(order.total)}</div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            <section className="space-y-3">
              <h3 className="font-display font-bold text-base">全部订单</h3>
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl bg-surface-container-lowest border border-outline-variant/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold">{order.customerName}</p>
                      <p className="text-sm text-on-surface-variant mt-1">{order.itemsSummary}</p>
                      <p className="text-xs text-on-surface-variant mt-2">
                        {order.orderNo || order.id} · {order.date} {order.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface-container-high">
                        {order.status}
                      </span>
                      <p className="mt-3 font-bold text-primary">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-wrap gap-2">
                    {order.items.map((item) => (
                      <span key={item.id} className="px-3 py-1 rounded-full bg-surface-container-high text-xs">
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </motion.div>
        )}

        {activeTab === "Profile" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <section className="rounded-3xl bg-surface border border-outline-variant/20 p-5 flex items-center gap-4">
              <img src={userProfile.avatar} alt="用户头像" className="w-20 h-20 rounded-2xl object-cover" />
              <div className="flex-1">
                <h2 className="font-display font-bold text-xl">{userProfile.name}</h2>
                <p className="mt-1 text-sm text-on-surface-variant">{userProfile.tier}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-on-surface-variant">
                  <span>积分 {userProfile.points}</span>
                  <span>累计订单 {userProfile.ordersCount}</span>
                  <span>累计消费 {formatCurrency(userProfile.totalSpent)}</span>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/20 p-4">
                <p className="text-xs text-on-surface-variant">门店地址</p>
                <p className="font-bold mt-2">{restaurant.address}</p>
              </div>
              <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/20 p-4">
                <p className="text-xs text-on-surface-variant">联系电话</p>
                <p className="font-bold mt-2">{restaurant.phone}</p>
              </div>
            </section>

            <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/20 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-lg">管理员入口</h3>
              </div>
              <p className="text-sm text-on-surface-variant mt-2">
                管理员可以直接维护数据库中的菜谱和订单状态。
              </p>
              <button
                onClick={() => setShowAdminPanel(true)}
                className="mt-4 px-4 py-3 rounded-xl bg-primary-container text-white font-bold cursor-pointer"
              >
                打开管理员登录
              </button>
            </section>
          </motion.div>
        )}
      </main>

      <CartFloatingBar
        itemCount={cartCount}
        subtotal={cartSubtotal}
        onClick={() => setShowCheckout(true)}
        variant="home"
      />
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />

      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          >
            <div className="max-w-lg mx-auto h-full bg-white overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-outline-variant/20 p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-xl">确认下单</h2>
                  <p className="text-sm text-on-surface-variant mt-1">订单提交后会直接写入 MySQL 数据库</p>
                </div>
                <button onClick={() => setShowCheckout(false)} className="cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-5">
                <section className="rounded-2xl bg-surface-container-lowest p-4 border border-outline-variant/20">
                  <p className="text-xs text-on-surface-variant">取餐方式</p>
                  <p className="font-bold mt-2">{pickupAddress.name}</p>
                  <p className="text-sm text-on-surface-variant mt-1">{pickupAddress.line1}</p>
                  <p className="text-sm text-on-surface-variant">{pickupAddress.line2}</p>
                </section>

                <section className="space-y-3">
                  <h3 className="font-display font-bold text-lg">购物车</h3>
                  {cart.length === 0 ? (
                    <div className="rounded-2xl bg-surface-container-low p-8 text-center text-on-surface-variant">
                      购物车为空，先去菜单里点几道菜吧。
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.menuItem.id} className="rounded-2xl border border-outline-variant/20 p-4 flex items-center gap-3">
                        <img src={item.menuItem.image} alt={item.menuItem.name} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1">
                          <p className="font-bold">{item.menuItem.name}</p>
                          <p className="text-sm text-on-surface-variant mt-1">
                            {formatCurrency(item.menuItem.price)} × {item.quantity}
                          </p>
                        </div>
                        <div className="font-bold text-primary">
                          {formatCurrency(item.menuItem.price * item.quantity)}
                        </div>
                      </div>
                    ))
                  )}
                </section>

                <section className="rounded-2xl bg-surface-container-lowest p-4 border border-outline-variant/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">商品数量</span>
                    <span className="font-semibold">{cartCount} 件</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">商品小计</span>
                    <span className="font-semibold">{formatCurrency(cartSubtotal)}</span>
                  </div>
                  <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                    <span className="font-display font-bold text-lg">实付金额</span>
                    <span className="font-display font-bold text-xl text-primary">
                      {formatCurrency(cartSubtotal)}
                    </span>
                  </div>
                </section>

                <button
                  onClick={placeOrder}
                  disabled={cart.length === 0}
                  className="w-full h-14 rounded-2xl bg-primary-container text-white font-display font-bold text-base disabled:opacity-50 cursor-pointer"
                >
                  提交订单
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdminPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm"
          >
            <div className="max-w-5xl mx-auto h-full bg-white overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white border-b border-outline-variant/20 p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-xl">管理员后台</h2>
                  <p className="text-sm text-on-surface-variant mt-1">所有管理动作都直接写数据库</p>
                </div>
                <button onClick={() => setShowAdminPanel(false)} className="cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!adminSession ? (
                <div className="max-w-md mx-auto px-4 py-10">
                  <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/20 p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <UserRound className="w-5 h-5 text-primary" />
                      <h3 className="font-display font-bold text-lg">管理员登录</h3>
                    </div>
                    <p className="text-sm text-on-surface-variant">演示账号：`admin`，密码：`123456`</p>
                    <input
                      value={adminUsername}
                      onChange={(event) => setAdminUsername(event.target.value)}
                      placeholder="用户名"
                      className="w-full rounded-2xl border border-outline-variant/30 px-4 py-3 outline-none"
                    />
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(event) => setAdminPassword(event.target.value)}
                      placeholder="密码"
                      className="w-full rounded-2xl border border-outline-variant/30 px-4 py-3 outline-none"
                    />
                    {adminError && <p className="text-sm text-red-500">{adminError}</p>}
                    <button
                      onClick={submitAdminLogin}
                      className="w-full rounded-2xl bg-primary-container text-white font-bold py-3 cursor-pointer"
                    >
                      登录后台
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-6 space-y-6">
                  <section className="rounded-3xl bg-surface-container-lowest border border-outline-variant/20 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display font-bold text-xl">菜谱管理</h3>
                        <p className="text-sm text-on-surface-variant mt-1">新增、编辑、删除、上下架都走数据库接口</p>
                      </div>
                      <button
                        onClick={() => {
                          setAdminSession(null);
                          setAdminUsername("");
                          setAdminPassword("");
                          resetMenuForm();
                        }}
                        className="px-4 py-2 rounded-xl bg-surface-container-high text-sm font-bold cursor-pointer"
                      >
                        退出登录
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
                      <input
                        value={menuForm.name}
                        onChange={(event) => setMenuForm({ ...menuForm, name: event.target.value })}
                        placeholder="菜品名称"
                        className="rounded-2xl border border-outline-variant/30 px-4 py-3 outline-none"
                      />
                      <input
                        value={menuForm.price}
                        onChange={(event) => setMenuForm({ ...menuForm, price: event.target.value })}
                        placeholder="价格，例如 28"
                        className="rounded-2xl border border-outline-variant/30 px-4 py-3 outline-none"
                      />
                      <select
                        value={menuForm.category}
                        onChange={(event) =>
                          setMenuForm({ ...menuForm, category: event.target.value as MenuCategory })
                        }
                        className="rounded-2xl border border-outline-variant/30 px-4 py-3 outline-none"
                      >
                        {CATEGORY_OPTIONS.filter((item) => item !== "全部").map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <input
                        value={menuForm.image}
                        onChange={(event) => setMenuForm({ ...menuForm, image: event.target.value })}
                        placeholder="图片相对路径，例如 /uploads/menu/xxx.jpg"
                        className="rounded-2xl border border-outline-variant/30 px-4 py-3 outline-none"
                      />
                      <div className="rounded-2xl border border-dashed border-outline-variant/30 px-4 py-3">
                        <label className="text-sm font-semibold text-on-surface block mb-2">
                          上传菜品图片
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              void uploadMenuImage(file);
                            }
                          }}
                          className="block w-full text-sm"
                        />
                        <p className="text-xs text-on-surface-variant mt-2">
                          {uploadingImage ? "图片上传中..." : "上传后会自动写入项目相对路径"}
                        </p>
                      </div>
                      <textarea
                        value={menuForm.description}
                        onChange={(event) => setMenuForm({ ...menuForm, description: event.target.value })}
                        placeholder="菜品描述"
                        className="md:col-span-2 min-h-24 rounded-2xl border border-outline-variant/30 px-4 py-3 outline-none"
                      />
                    </div>

                    {menuForm.image && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-2">当前图片预览</p>
                        <img
                          src={menuForm.image}
                          alt="菜品预览"
                          className="w-40 h-40 rounded-2xl object-cover border border-outline-variant/20"
                        />
                      </div>
                    )}

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={saveMenuItem}
                        className="px-5 py-3 rounded-2xl bg-primary-container text-white font-bold cursor-pointer"
                      >
                        {editingMenuId ? "保存修改" : "新增菜品"}
                      </button>
                      {editingMenuId && (
                        <button
                          onClick={resetMenuForm}
                          className="px-5 py-3 rounded-2xl bg-surface-container-high font-bold cursor-pointer"
                        >
                          取消编辑
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      {menuItems.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-outline-variant/20 p-4">
                          <div className="flex items-start gap-3">
                            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold">{item.name}</p>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container-high">
                                  {item.available ? "在售" : "停售"}
                                </span>
                              </div>
                              <p className="text-sm text-on-surface-variant mt-1">{item.category}</p>
                              <p className="text-xs text-on-surface-variant mt-1">库存 {item.stockQuantity}</p>
                              <p className="font-bold text-primary mt-2">{formatCurrency(item.price)}</p>
                            </div>
                          </div>
                          <p className="text-sm text-on-surface-variant mt-3">{item.description}</p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            <button
                              onClick={() => beginEditMenuItem(item)}
                              className="px-3 py-2 rounded-xl bg-surface-container-high text-sm font-bold cursor-pointer"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => toggleDishAvailability(item)}
                              className="px-3 py-2 rounded-xl bg-surface-container-high text-sm font-bold cursor-pointer"
                            >
                              {item.available ? "设为停售" : "恢复在售"}
                            </button>
                            <button
                              onClick={() => deleteDish(item.id)}
                              className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-bold cursor-pointer"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-3xl bg-surface-container-lowest border border-outline-variant/20 p-5">
                    <h3 className="font-display font-bold text-xl">订单管理</h3>
                    <p className="text-sm text-on-surface-variant mt-1">修改状态后会直接更新数据库，完成订单会触发库存扣减</p>
                    <div className="space-y-4 mt-5">
                      {orders.map((order) => (
                        <div key={order.id} className="rounded-2xl border border-outline-variant/20 p-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                              <p className="font-bold">{order.customerName}</p>
                              <p className="text-sm text-on-surface-variant mt-1">{order.itemsSummary}</p>
                              <p className="text-xs text-on-surface-variant mt-2">
                                {order.orderNo || order.id} · {order.date} {order.time}
                              </p>
                              <p className="text-xs text-on-surface-variant mt-1">
                                共 {order.itemsCount} 件商品，金额 {formatCurrency(order.total)}
                              </p>
                            </div>
                            <select
                              value={order.status}
                              onChange={(event) => updateOrderStatus(order.id, event.target.value as OrderStatus)}
                              className="rounded-xl border border-outline-variant/30 px-4 py-3 outline-none"
                            >
                              {ORDER_STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-wrap gap-2">
                            {order.items.map((item) => (
                              <span key={item.id} className="px-3 py-1 rounded-full bg-surface-container-high text-xs">
                                {item.name} × {item.quantity}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

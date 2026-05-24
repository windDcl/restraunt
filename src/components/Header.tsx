import { Shield, ShoppingBasket } from "lucide-react";
import { UserProfile } from "../types";

interface HeaderProps {
  user: UserProfile;
  cartCount: number;
  onCartClick: () => void;
  onProfileClick: () => void;
  onAdminClick: () => void;
}

export default function Header({
  user,
  cartCount,
  onCartClick,
  onProfileClick,
  onAdminClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 transition-all duration-300 shadow-sm bg-surface">
      <div className="flex items-center gap-3">
        <button
          onClick={onProfileClick}
          className="w-10 h-10 overflow-hidden duration-150 rounded-full cursor-pointer bg-surface-container-high active:scale-95 border-2 border-primary-container"
        >
          <img
            alt="用户头像"
            className="object-cover w-full h-full"
            src={user.avatar}
          />
        </button>
        <div>
          <p className="tracking-tight font-display text-headline-lg-mobile text-primary font-bold">
            渔香记小馆
          </p>
          <p className="text-[11px] text-on-surface-variant">堂食与到店自取点餐站</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onAdminClick}
          className="px-3 py-2 rounded-full text-xs font-bold text-primary bg-primary-container/10 hover:bg-primary-container/20 transition-colors cursor-pointer"
        >
          <span className="inline-flex items-center gap-1">
            <Shield className="w-4 h-4" />
            管理员
          </span>
        </button>
        <button
          onClick={onCartClick}
          className="relative p-2.5 transition-colors rounded-full text-primary hover:bg-surface-container-high active:scale-95 cursor-pointer"
        >
          <ShoppingBasket className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-container text-white text-[10px] font-bold ring-2 ring-surface">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

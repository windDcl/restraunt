import { ShoppingBasket } from "lucide-react";
import { UserProfile } from "../types";

interface HeaderProps {
  user: UserProfile;
  cartCount: number;
  onCartClick: () => void;
  onProfileClick: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function Header({
  user,
  cartCount,
  onCartClick,
  onProfileClick,
  showBackButton = false,
  onBack,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 transition-all duration-300 shadow-sm bg-surface">
      <div className="flex items-center gap-3">
        {showBackButton ? (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 duration-150 rounded-full hover:bg-surface-container-high active:scale-95 cursor-pointer"
          >
            {/* Custom arrow left styled matching premium outline */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={onProfileClick}
            className="w-10 h-10 overflow-hidden duration-150 rounded-full cursor-pointer bg-surface-container-high active:scale-95 border-2 border-primary-container"
          >
            <img
              alt="User Profile"
              className="object-cover w-full h-full"
              src={user.avatar}
            />
          </button>
        )}
        <span
          onClick={() => {
            if (onBack) onBack();
          }}
          className="tracking-tight cursor-pointer font-display text-headline-lg-mobile text-primary font-bold"
        >
          GourmetGo
        </span>
      </div>

      <div className="flex items-center gap-4">
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

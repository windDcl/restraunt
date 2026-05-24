import { ArrowRight, ShoppingCart } from "lucide-react";

interface CartFloatingBarProps {
  itemCount: number;
  subtotal: number;
  onClick: () => void;
  variant?: "home" | "merchant";
}

export default function CartFloatingBar({
  itemCount,
  subtotal,
  onClick,
  variant = "home",
}: CartFloatingBarProps) {
  if (itemCount === 0) return null;

  const formattedPrice = `¥${subtotal.toFixed(2)}`;

  if (variant === "merchant") {
    return (
      <div className="fixed bottom-0 left-0 w-full z-30 p-4 mb-2">
        <div
          onClick={onClick}
          className="max-w-4xl mx-auto bg-primary-container text-white rounded-2xl shadow-[0_8px_32px_rgba(255,87,34,0.3)] hover:shadow-[0_12px_40px_rgba(255,87,34,0.45)] flex items-center justify-between px-5 py-4 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center relative shrink-0">
              <ShoppingCart className="w-5.5 h-5.5 text-white" />
              <span className="absolute -top-1.5 -right-1.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-primary-container">
                {itemCount}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-sans font-semibold tracking-wider text-white/85 uppercase">
                已加入 {itemCount} 件商品
              </p>
              <p className="font-display font-bold text-lg leading-tight">
                {formattedPrice}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="bg-white text-primary hover:bg-surface-bright font-sans font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-sm shrink-0 cursor-pointer"
          >
            去结算
            <ArrowRight className="w-4 h-4 text-primary shrink-0" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-[88px] left-0 w-full px-4 z-30 pointer-events-none">
      <div className="max-w-md mx-auto">
        <button
          onClick={onClick}
          className="w-full bg-primary-container text-white py-4 rounded-xl flex items-center justify-between px-6 shadow-[0_8px_24px_rgba(255,87,34,0.35)] hover:shadow-[0_12px_32px_rgba(255,87,34,0.45)] active:scale-98 transition-all pointer-events-auto cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center font-sans font-bold text-sm">
              {itemCount}
            </div>
            <span className="font-sans font-bold text-sm tracking-wide">
              查看购物车
            </span>
          </div>
          <span className="font-sans font-bold text-sm">{formattedPrice}</span>
        </button>
      </div>
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, MapPin, Phone } from "lucide-react";
import { cn } from "../../lib/utils";

export default function MobileNav() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Services", path: "/services", icon: Sparkles },
    { name: "BOOK", path: "/book", highlight: true },
    { name: "Track", path: "/track", icon: MapPin },
    { name: "Contact", path: "/contact", icon: Phone },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-[60px] bg-white border-t border-gray-200 flex items-center justify-around z-50 pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;

        if (item.highlight) {
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center -mt-8 relative group"
            >
              <div className="w-14 h-14 bg-black rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-xs uppercase group-hover:scale-105 transition-transform">
                BOOK
              </div>
            </Link>
          );
        }

        const Icon = item.icon!;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center text-[10px] font-bold uppercase transition-colors h-full justify-center space-y-1 w-16",
              isActive ? "text-black" : "text-gray-500 hover:text-gray-500"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive && "text-black")} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

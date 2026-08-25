import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import WhatsAppFAB from "./WhatsAppFAB";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F7]">
      <Header />
      <main className="flex-grow pt-[72px] md:pt-[80px]">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <WhatsAppFAB />
    </div>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Car, 
  Droplets, 
  Calendar, 
  Award, 
  HelpCircle, 
  ArrowRight, 
  Zap, 
  Percent, 
  CheckCircle2 
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  tagline: string;
  category: "car" | "tank" | "home";
  price: number;
  originalPrice: number;
  billingPeriod: string;
  washesCount: string;
  popular?: boolean;
  features: string[];
  savingsText: string;
}

export default function SubscriptionsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<"all" | "car" | "tank" | "home">("all");
  const [activeFrequency, setActiveFrequency] = useState<"monthly" | "quarterly">("monthly");

  const plans: Plan[] = [
    {
      id: "car-silver",
      name: "Silver Car Wash Pass",
      tagline: "Ideal for daily office commuters in Korba",
      category: "car",
      price: 999,
      originalPrice: 1400,
      billingPeriod: "per month",
      washesCount: "4 Washes / Month (1 Wash Every Week)",
      features: [
        "4x Doorstep High-Pressure Snow Foam Washes",
        "Tire & Rim Degreasing + Gloss Dressing",
        "Exterior Glass & Mirror Crystal Streak-Free Wipe",
        "Door Sills & Mat Cleaning",
        "Preferred Weekend / Morning Slot Allocation",
        "Zero Travel / Fuel Surcharge in Korba"
      ],
      savingsText: "Save ₹400 / Month vs single washes"
    },
    {
      id: "car-gold",
      name: "Gold Pro Detailing Pass",
      tagline: "Most Popular: Complete Interior + Exterior Car Care",
      category: "car",
      price: 1599,
      originalPrice: 2400,
      billingPeriod: "per month",
      washesCount: "4 Washes + 1 Deep Interior Clean / Month",
      popular: true,
      features: [
        "4x Doorstep pH-Neutral High-Pressure Foam Washes",
        "1x Full Interior Vacuuming & Dashboard Polish",
        "Air Vent Steam Disinfection & Odor Neutralizer",
        "Underbody Pressure Jet Spray",
        "Engine Bay Surface Dry Clean",
        "Dedicated Senior Technician Assigned",
        "1 Free Reschedule anytime in month"
      ],
      savingsText: "Save ₹800 / Month (33% OFF)"
    },
    {
      id: "car-diamond",
      name: "Diamond Ceramic & Wax Pass",
      tagline: "Showroom Mirror Shine & Scratch Defense",
      category: "car",
      price: 2699,
      originalPrice: 4200,
      billingPeriod: "per month",
      washesCount: "4 Washes + Wax Polish + 2 Deep Vacuums",
      features: [
        "4x Premium Ceramic-Infused Foam Washes",
        "1x Dual-Action Carnauba Machine Waxing",
        "2x Deep Interior Shampoo & Vacuum Sessions",
        "Leather / Fabric Seat Stain Extraction",
        "Headlight & Tail-lamp De-yellowing Wipe",
        "Rain-Repellent Windshield Coating",
        "VIP Priority Dispatch Support"
      ],
      savingsText: "Save ₹1,500 / Month"
    },
    {
      id: "tank-amc",
      name: "Water Tank Annual AMC",
      tagline: "100% Pure & Safe Drinking Water for Your Family",
      category: "tank",
      price: 1499,
      originalPrice: 2200,
      billingPeriod: "per year",
      washesCount: "2 Deep Mechanized Cleanings / Year",
      features: [
        "2x Scheduled Semi-Annual Tank Disinfections",
        "High-Pressure Rotary Jet Desludging",
        "Anti-Bacterial Slurry Vacuum Extraction",
        "UV Light Disinfection & Bleach Free Sterilization",
        "Free Tank Lid Seal & Float Valve Inspection",
        "Automated Reminder Call when due"
      ],
      savingsText: "Save ₹700 / Year"
    },
    {
      id: "home-amc",
      name: "Complete Home & Sofa Care Pass",
      tagline: "Total Living Room & Upholstery Hygiene",
      category: "home",
      price: 2999,
      originalPrice: 4500,
      billingPeriod: "per year",
      washesCount: "4 Deep Upholstery Sessions / Year",
      features: [
        "4x Deep Extraction Sofa & Cushion Washes",
        "2x Mattress Sanitization & Allergen Removal",
        "Curtain Steam Cleaning & Dust Removal",
        "Balcony & Window Sliding Track Pressure Wash",
        "Eco-friendly pet & child safe chemicals"
      ],
      savingsText: "Save ₹1,500 / Year"
    }
  ];

  const filteredPlans = plans.filter(p => selectedCategory === "all" || p.category === selectedCategory);

  const handleSelectPlan = (plan: Plan) => {
    navigate(`/book?service=monthly-car-wash&package=${encodeURIComponent(plan.name)}&amount=${plan.price}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300/80 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>Monthly Passes & AMC Contracts</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Never Worry About a Dirty Car or Tank Again
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Subscribe to Korba's favorite doorstep cleaning plans. Save up to <strong>35%</strong> with fixed weekly slots, dedicated verified technicians, and zero hassle.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {[
              { id: "all", label: "All Passes" },
              { id: "car", label: "🚗 Monthly Car Wash" },
              { id: "tank", label: "💧 Water Tank AMC" },
              { id: "home", label: "🛋️ Sofa & Home Hygiene" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all ${
                  selectedCategory === tab.id
                    ? "bg-black text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative border ${
                plan.popular
                  ? "border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/50"
                  : "border-gray-200 shadow-sm hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-black font-black text-xs uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                  ⭐ Most Popular in Korba
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="border-b border-gray-100 pb-5">
                  <h3 className="text-xl font-black text-gray-900">{plan.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{plan.tagline}</p>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-gray-900">
                      ₹{plan.price}
                    </span>
                    <span className="text-sm font-semibold text-gray-400 line-through">
                      ₹{plan.originalPrice}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      / {plan.billingPeriod}
                    </span>
                  </div>

                  <div className="mt-2 inline-block bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {plan.savingsText}
                  </div>

                  <div className="mt-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>{plan.washesCount}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 py-6 text-xs text-gray-600">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-all ${
                    plan.popular
                      ? "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20"
                      : "bg-black hover:bg-gray-800 text-white"
                  }`}
                >
                  <span>Subscribe Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits & Trust Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 text-sm">Pause or Cancel Anytime</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Going out of town? Simply pause your subscription or roll forward unused washes to next month.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 text-sm">Dedicated Senior Washer</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Same trusted technician visits your residence weekly so you get consistent 5-star wash quality.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 text-sm">Premium pH-Neutral Foam</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Zero harmful chemicals or harsh detergents. 100% paint & ceramic coating safe.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

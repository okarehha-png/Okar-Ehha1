import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  Users,
  Copy,
  Check,
  Sparkles,
  Phone,
  Tag,
  Gift
} from "lucide-react";
import { Customer, Booking } from "../../types/admin";

interface WhatsAppMarketingTabProps {
  customers: Customer[];
  bookings: Booking[];
}

export default function WhatsAppMarketingTab({ customers, bookings }: WhatsAppMarketingTabProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("festival");
  const [customMsg, setCustomMsg] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [targetGroup, setTargetGroup] = useState<string>("all");

  const phoneList = Array.from(new Set(bookings.map(b => b.mobile).filter(Boolean)));

  const TEMPLATES: Record<string, { title: string; text: string; icon: string }> = {
    festival: {
      title: "Festival / Season Offer (20% OFF)",
      icon: "🎉",
      text: `🌟 *Festive Special Offer from OKAR EHHA!* 🌟\n\nGet your Car, Sofa, or Water Tank deep cleaned at your doorstep in Korba!\n\n✨ *Flat 20% OFF* on all Complete Car Spa & Interior Sanitization.\n\n📅 Book your preferred slot today:\n👉 Visit: https://okarehha.in\n📞 Or reply to this WhatsApp message!\n\n_Okar Ehha - Doorstep Mechanized Cleaning in Korba_`
    },
    carSpa: {
      title: "Monsoon / Dust Care Car Package",
      icon: "🚗",
      text: `🚗 *Protect Your Car from Mud & Dust!* 🚗\n\nIs your car losing its shine? *Okar Ehha* brings high-pressure foam wash, interior vacuuming & dashboard dressing right to your parking lot in Korba!\n\n⚡ Packages start at just *₹499*.\n\nBook doorstep service now:\n👉 Call/WhatsApp: 98261XXXXX\n👉 Visit: https://okarehha.in`
    },
    waterTank: {
      title: "Safe Drinking Water Tank Cleaning",
      icon: "💧",
      text: `💧 *Pure & Clean Water For Your Family!* 💧\n\nWhen was the last time your overhead water tank was cleaned? Sludge, algae & bacteria accumulate over time.\n\n*Okar Ehha 5-Stage Mechanized Tank Cleaning:*\n1. Sludge Removal\n2. High-Pressure Washing\n3. Vacuum Cleaning\n4. Anti-Bacterial Spray\n5. UV Sanitization\n\nBook your slot in Korba today: https://okarehha.in`
    },
    review: {
      title: "Google Review & Feedback Request",
      icon: "⭐",
      text: `⭐ *How was your Okar Ehha experience?* ⭐\n\nThank you for choosing Okar Ehha Doorstep Cleaning in Korba! We hope our team did a great job.\n\nCould you take 30 seconds to rate us on Google?\n👉 https://g.page/r/okarehha/review\n\nYour feedback helps our local team serve you better!`
    }
  };

  const currentTemplate = TEMPLATES[selectedTemplate] || TEMPLATES.festival;

  const handleCopy = () => {
    navigator.clipboard.writeText(customMsg || currentTemplate.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <span>WhatsApp Broadcast & Notification Hub</span>
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Send promotional offers, seasonal discounts, booking follow-ups, and review requests to Korba clients
        </p>
      </div>

      {/* Target Audience Bar */}
      <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Broadcast Reach</span>
            <p className="text-base font-black text-white">{phoneList.length} Verified Customer Contacts</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-bold">Target Segment:</span>
          <select
            value={targetGroup}
            onChange={(e) => setTargetGroup(e.target.value)}
            className="bg-[#0B0F17] border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-amber-400 font-bold"
          >
            <option value="all">All Korba Customers ({phoneList.length})</option>
            <option value="repeat">Repeat Clients (2+ bookings)</option>
            <option value="car">Car Wash Clients</option>
            <option value="tank">Water Tank Clients</option>
          </select>
        </div>
      </div>

      {/* Templates Selector & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Select Ready WhatsApp Template
          </h3>

          {Object.keys(TEMPLATES).map((key) => {
            const t = TEMPLATES[key];
            const isSelected = selectedTemplate === key;

            return (
              <div
                key={key}
                onClick={() => {
                  setSelectedTemplate(key);
                  setCustomMsg("");
                }}
                className={`
                  p-4 rounded-2xl border cursor-pointer transition-all
                  ${isSelected ? 'bg-amber-500/10 border-amber-500 text-white shadow-md' : 'bg-[#121824] border-gray-800 text-gray-400 hover:border-gray-700'}
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{t.icon}</span>
                  <span className="font-bold text-xs text-white">{t.title}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Editor & Live Preview */}
        <div className="lg:col-span-2 bg-[#121824] border border-amber-500/20 rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Message Content</span>
              </span>

              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-gray-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>

            <textarea
              rows={9}
              value={customMsg || currentTemplate.text}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="w-full bg-[#0B0F17] border border-gray-800 rounded-xl p-4 text-xs font-mono text-gray-200 leading-relaxed focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-gray-400">
              💡 Tip: You can test send this message directly to your own WhatsApp first.
            </span>

            <div className="flex gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(customMsg || currentTemplate.text)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

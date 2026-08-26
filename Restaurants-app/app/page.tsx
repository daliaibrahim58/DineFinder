"use client";

import Hero from "@/components/home/Hero";
import RestaurantSection from "@/components/home/RestaurantSection";
import RestaurantChatbot from "@/components/chatbot/RestaurantChatbot";

import AdminPage from "@/app/admin/page";

import { useAppSelector } from "@/redux/hooks";

export default function HomePage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // =====================================================
  // Admin
  // =====================================================

  if (isAuthenticated && user?.role === "admin") {
    return <AdminPage />;
  }

  // =====================================================
  // Normal User / Guest
  // =====================================================

  return (
    <>
      <Hero />

      <RestaurantSection />

      <RestaurantChatbot />
    </>
  );
}

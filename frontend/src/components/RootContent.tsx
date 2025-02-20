'use client';

import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";
import Header from "@/components/header";

export default function RootContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeFromStorage } = useAuthStore();

  useEffect(() => {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      initializeFromStorage();
    }
  }, [initializeFromStorage]);

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
} 
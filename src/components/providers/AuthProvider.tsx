"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { CartProvider, LikesProvider } from "@/contexts";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <CartProvider>
        <LikesProvider>{children}</LikesProvider>
      </CartProvider>
    </SessionProvider>
  );
}

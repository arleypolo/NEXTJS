"use client";

import { useCartStore, type CartItem } from "@/stores";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function useCart() {
  const { data: session } = useSession();
  
  const {
    items,
    totalItems,
    totalPrice,
    isLoading,
    isSyncing,
    error,
    addItem,
    removeItem,
    updateQuantity: storeUpdateQuantity,
    clearCart: storeClearCart,
    syncWithServer,
    submitCart: storeSubmitCart,
  } = useCartStore();

  // Sincronizar con servidor cuando usuario inicia sesión
  useEffect(() => {
    if (session?.user?.id) {
      syncWithServer(parseInt(session.user.id));
    }
  }, [session?.user?.id, syncWithServer]);

  const addToCart = async (item: Omit<CartItem, "quantity">, quantity = 1) => {
    addItem(item, quantity);
  };

  const removeFromCart = async (productId: string) => {
    removeItem(productId);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    storeUpdateQuantity(productId, quantity);
  };

  const clearCart = async () => {
    storeClearCart();
  };

  const submitCart = async () => {
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Usuario no autenticado",
      };
    }
    return storeSubmitCart(parseInt(session.user.id));
  };

  return {
    items,
    totalItems,
    totalPrice,
    isLoading,
    isSyncing,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    submitCart,
  };
}

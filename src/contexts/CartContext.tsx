"use client";

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { useCartStore, CartItem } from "@/stores";

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  submitCart: () => Promise<{ success: boolean; cartId?: number; error?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  
  // Usar el store de Zustand
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
    setLoading,
    syncWithServer,
    submitCart: storeSubmitCart,
  } = useCartStore();

  // Sincronizar con el servidor cuando el usuario inicia sesión
  useEffect(() => {
    if (session?.user?.id) {
      const userId = parseInt(session.user.id);
      if (!isNaN(userId)) {
        syncWithServer(userId);
      }
    }
  }, [session?.user?.id, syncWithServer]);

  // Wrapper para addToCart con async
  const addToCart = async (item: Omit<CartItem, "quantity">, quantity = 1): Promise<void> => {
    setLoading(true);
    // Pequeño delay para feedback visual
    await new Promise(resolve => setTimeout(resolve, 100));
    addItem(item, quantity);
    setLoading(false);
  };

  // Wrapper para removeFromCart
  const removeFromCart = async (productId: string): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    removeItem(productId);
    setLoading(false);
  };

  // Wrapper para updateQuantity
  const updateQuantity = async (productId: string, quantity: number): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    storeUpdateQuantity(productId, quantity);
    setLoading(false);
  };

  // Wrapper para clearCart
  const clearCart = async (): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    storeClearCart();
    setLoading(false);
  };

  // Enviar carrito al servidor
  const submitCart = async (): Promise<{ success: boolean; cartId?: number; error?: string }> => {
    if (!session?.user?.id) {
      return { success: false, error: "Usuario no autenticado" };
    }

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return { success: false, error: "ID de usuario inválido" };
    }

    return storeSubmitCart(userId);
  };

  return (
    <CartContext.Provider
      value={{
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

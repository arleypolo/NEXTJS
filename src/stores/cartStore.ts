import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Tipos
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  error: string | null;
}

export interface CartActions {
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setLoading: (isLoading: boolean) => void;
  setSyncing: (isSyncing: boolean) => void;
  setError: (error: string | null) => void;
  syncWithServer: (userId: number) => Promise<void>;
  submitCart: (userId: number) => Promise<{ success: boolean; cartId?: number; error?: string }>;
}

export interface CartStore extends CartState, CartActions {
  // Computed values
  totalItems: number;
  totalPrice: number;
}

// Función para calcular totales
const calculateTotals = (items: CartItem[]) => ({
  totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
});

// Store de Zustand con persistencia
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      items: [],
      isLoading: false,
      isSyncing: false,
      lastSyncedAt: null,
      error: null,
      totalItems: 0,
      totalPrice: 0,

      // Acciones
      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId);

          let newItems: CartItem[];
          if (existingItem) {
            newItems = state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            );
          } else {
            newItems = [...state.items, { ...item, quantity }];
          }

          return {
            items: newItems,
            ...calculateTotals(newItems),
            error: null,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.productId !== productId);
          return {
            items: newItems,
            ...calculateTotals(newItems),
            error: null,
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          let newItems: CartItem[];

          if (quantity <= 0) {
            newItems = state.items.filter((i) => i.productId !== productId);
          } else {
            newItems = state.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i
            );
          }

          return {
            items: newItems,
            ...calculateTotals(newItems),
            error: null,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
          error: null,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),
      setSyncing: (isSyncing) => set({ isSyncing }),
      setError: (error) => set({ error }),

      // Sincronizar carrito con el servidor (obtener carrito del usuario)
      syncWithServer: async (userId) => {
        const { setSyncing, setError } = get();
        setSyncing(true);

        try {
          const response = await fetch(`https://fakestoreapi.com/carts/user/${userId}`);

          if (!response.ok) {
            throw new Error("Error al obtener el carrito del servidor");
          }

          const carts = await response.json();

          set({ lastSyncedAt: new Date(), error: null });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Error desconocido";
          setError(errorMessage);
        } finally {
          setSyncing(false);
        }
      },

      // Enviar carrito al servidor (checkout)
      submitCart: async (userId) => {
        const { items, setLoading, setError, clearCart } = get();
        setLoading(true);

        try {
          // Preparar datos para FakeStoreAPI
          const cartData = {
            userId,
            date: new Date().toISOString().split("T")[0],
            products: items.map((item) => ({
              productId: parseInt(item.productId),
              quantity: item.quantity,
            })),
          };

          const response = await fetch("https://fakestoreapi.com/carts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(cartData),
          });

          if (!response.ok) {
            throw new Error("Error al enviar el carrito");
          }

          const result = await response.json();

          // Limpiar carrito después de enviar exitosamente
          clearCart();

          return {
            success: true,
            cartId: result.id,
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Error desconocido";
          setError(errorMessage);
          return {
            success: false,
            error: errorMessage,
          };
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }),
    }
  )
);

// Selectores para optimización
export const selectCartItems = (state: CartStore) => state.items;
export const selectTotalItems = (state: CartStore) => state.totalItems;
export const selectTotalPrice = (state: CartStore) => state.totalPrice;
export const selectIsLoading = (state: CartStore) => state.isLoading;
export const selectIsSyncing = (state: CartStore) => state.isSyncing;
export const selectError = (state: CartStore) => state.error;

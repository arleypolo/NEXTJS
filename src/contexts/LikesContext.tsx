"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface LikesContextType {
  likedProducts: Set<string>;
  isLoading: boolean;
  toggleLike: (productId: string) => Promise<boolean>;
  isLiked: (productId: string) => boolean;
  likesCount: number;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

export function LikesProvider({ children }: { children: ReactNode }) {
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar likes desde localStorage al iniciar
  useEffect(() => {
    const savedLikes = localStorage.getItem("likes");
    if (savedLikes) {
      try {
        setLikedProducts(new Set(JSON.parse(savedLikes)));
      } catch {
        setLikedProducts(new Set());
      }
    }
    setIsInitialized(true);
  }, []);

  // Guardar en localStorage cuando cambia
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("likes", JSON.stringify([...likedProducts]));
    }
  }, [likedProducts, isInitialized]);

  const toggleLike = useCallback(
    async (productId: string): Promise<boolean> => {
      const isCurrentlyLiked = likedProducts.has(productId);
      
      setIsLoading(true);
      
      // Simular un pequeño delay para feedback visual
      await new Promise(resolve => setTimeout(resolve, 100));

      setLikedProducts((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.delete(productId);
        } else {
          newSet.add(productId);
        }
        return newSet;
      });

      setIsLoading(false);
      return !isCurrentlyLiked;
    },
    [likedProducts]
  );

  const isLiked = useCallback(
    (productId: string) => likedProducts.has(productId),
    [likedProducts]
  );

  return (
    <LikesContext.Provider
      value={{
        likedProducts,
        isLoading,
        toggleLike,
        isLiked,
        likesCount: likedProducts.size,
      }}
    >
      {children}
    </LikesContext.Provider>
  );
}

export function useLikes() {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error("useLikes must be used within a LikesProvider");
  }
  return context;
}

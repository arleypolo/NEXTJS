"use client";

import { useState, useEffect, useCallback } from "react";

export function useLikes() {
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

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
  }, []);

  // Guardar en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem("likes", JSON.stringify([...likedProducts]));
  }, [likedProducts]);

  const toggleLike = useCallback(
    async (productId: string): Promise<boolean> => {
      const isCurrentlyLiked = likedProducts.has(productId);
      setIsLoading(true);

      try {
        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 200));

        setLikedProducts((prev) => {
          const newSet = new Set(prev);
          if (isCurrentlyLiked) {
            newSet.delete(productId);
          } else {
            newSet.add(productId);
          }
          return newSet;
        });

        return !isCurrentlyLiked;
      } finally {
        setIsLoading(false);
      }
    },
    [likedProducts]
  );

  const isLiked = useCallback(
    (productId: string) => likedProducts.has(productId),
    [likedProducts]
  );

  return {
    likedProducts,
    isLoading,
    toggleLike,
    isLiked,
    likesCount: likedProducts.size,
  };
}

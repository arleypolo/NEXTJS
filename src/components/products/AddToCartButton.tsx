"use client";

import { useCart } from "@/hooks";
import { useState } from "react";
import styles from "./AddToCartButton.module.scss";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  image?: string;
  stock?: number;
  showQuantity?: boolean;
}

export default function AddToCartButton({
  productId,
  name,
  price,
  image,
  stock = 99,
  showQuantity = true,
}: AddToCartButtonProps) {
  const { addToCart, isLoading, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const currentInCart = items.find((i) => i.productId === productId)?.quantity || 0;
  const maxQuantity = stock - currentInCart;
  const isOutOfStock = stock <= 0 || maxQuantity <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;

    await addToCart({ productId, name, price, image }, quantity);
    setAdded(true);
    setQuantity(1);

    setTimeout(() => setAdded(false), 2000);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  if (isOutOfStock) {
    return (
      <button className={`${styles.button} ${styles.disabled}`} disabled>
        Agotado
      </button>
    );
  }

  return (
    <div className={styles.container}>
      {showQuantity && (
        <div className={styles.quantitySelector}>
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className={styles.quantityButton}
            aria-label="Reducir cantidad"
          >
            −
          </button>
          <span className={styles.quantity}>{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= maxQuantity}
            className={styles.quantityButton}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      )}
      <button
        onClick={handleAddToCart}
        disabled={isLoading || added}
        className={`${styles.button} ${added ? styles.added : ""}`}
      >
        {isLoading ? (
          <span className={styles.spinner} />
        ) : added ? (
          <>
            <svg viewBox="0 0 24 24" className={styles.checkIcon}>
              <path
                fill="currentColor"
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
              />
            </svg>
            ¡Agregado!
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" className={styles.cartIcon}>
              <path
                fill="currentColor"
                d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
              />
            </svg>
            Agregar al carrito
          </>
        )}
      </button>
    </div>
  );
}

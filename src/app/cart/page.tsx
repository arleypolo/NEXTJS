"use client";

import { useState } from "react";
import { useCart } from "@/hooks";
import { OptimizedImage } from "@/components/ui";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./cart.module.scss";

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { 
    items, 
    totalItems, 
    totalPrice, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    isLoading,
    isSyncing,
    error,
    submitCart 
  } = useCart();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);

  const handleCheckout = async () => {
    if (!session) {
      router.push("/auth/login?callbackUrl=/cart");
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    const result = await submitCart();

    if (result.success) {
      setSubmitResult({
        success: true,
        message: `¡Pedido #${result.cartId} enviado exitosamente! Gracias por tu compra.`,
      });
    } else {
      setSubmitResult({
        success: false,
        message: result.error || "Error al procesar el pedido",
      });
    }

    setIsSubmitting(false);
  };

  if (submitResult?.success) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successContent}>
          <svg viewBox="0 0 24 24" className={styles.successIcon}>
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
          <h1>¡Compra exitosa!</h1>
          <p>{submitResult.message}</p>
          <Link href="/products" className={styles.continueButton}>
            Seguir comprando
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <svg viewBox="0 0 24 24" className={styles.emptyIcon}>
          <path
            fill="currentColor"
            d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
          />
        </svg>
        <h1>Tu carrito está vacío</h1>
        <p>Agrega productos para comenzar a comprar</p>
        <Link href="/products" className={styles.continueButton}>
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Tu Carrito</h1>
          <span className={styles.itemCount}>{totalItems} artículos</span>
        </header>

        <div className={styles.content}>
          <div className={styles.itemsList}>
            {items.map((item) => (
              <div key={item.productId} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <OptimizedImage
                    src={item.image || "/images/placeholder.svg"}
                    alt={item.name}
                    width={100}
                    height={100}
                    aspectRatio="square"
                  />
                </div>

                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                </div>

                <div className={styles.quantityControls}>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={isLoading}
                    className={styles.quantityBtn}
                  >
                    −
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={isLoading}
                    className={styles.quantityBtn}
                  >
                    +
                  </button>
                </div>

                <div className={styles.itemTotal}>
                  {formatPrice(item.price * item.quantity)}
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  disabled={isLoading}
                  className={styles.removeBtn}
                  aria-label="Eliminar"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      fill="currentColor"
                      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <aside className={styles.summary}>
            <h2>Resumen del pedido</h2>
            
            <div className={styles.summaryRow}>
              <span>Subtotal ({totalItems} artículos)</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Envío</span>
              <span className={styles.freeShipping}>Gratis</span>
            </div>
            
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            {submitResult && !submitResult.success && (
              <div className={styles.errorMessage}>
                {submitResult.message}
              </div>
            )}

            {isSyncing && (
              <div className={styles.syncingMessage}>
                Sincronizando carrito...
              </div>
            )}

            <button 
              className={styles.checkoutBtn}
              onClick={handleCheckout}
              disabled={isLoading || isSubmitting || items.length === 0}
            >
              {isSubmitting ? "Procesando..." : session ? "Proceder al pago" : "Iniciar sesión para pagar"}
            </button>

            <button onClick={clearCart} disabled={isLoading || isSubmitting} className={styles.clearBtn}>
              Vaciar carrito
            </button>

            <Link href="/products" className={styles.continueLink}>
              ← Continuar comprando
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

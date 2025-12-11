"use client";

import Link from "next/link";
import { memo } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import LikeButton from "./LikeButton";
import styles from "./ProductCard.module.scss";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  stock?: number;
  priority?: boolean; // Para las primeras imágenes visibles
}

function ProductCard({
  id,
  name,
  price,
  image,
  description,
  category,
  stock = 0,
  priority = false,
}: ProductCardProps) {
  const isOutOfStock = stock <= 0;
  const formattedPrice = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(price);

  return (
    <article className={styles.card}>
      <Link href={`/products/${id}`} className={styles.imageLink}>
        <div className={styles.imageContainer}>
          <OptimizedImage
            src={image || "/images/placeholder.svg"}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            aspectRatio="square"
            priority={priority}
            className={styles.image}
          />
          {isOutOfStock && (
            <div className={styles.outOfStock}>
              <span>Agotado</span>
            </div>
          )}
          {category && <span className={styles.category}>{category}</span>}
          <div className={styles.likeWrapper}>
            <LikeButton productId={id} size="medium" />
          </div>
        </div>
      </Link>

      <div className={styles.content}>
        <Link href={`/products/${id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{name}</h3>
        </Link>

        {description && (
          <p className={styles.description}>{description}</p>
        )}

        <div className={styles.footer}>
          <span className={styles.price}>{formattedPrice}</span>
          {stock > 0 && stock <= 5 && (
            <span className={styles.lowStock}>¡Últimas {stock} unidades!</span>
          )}
        </div>
      </div>
    </article>
  );
}

// Memoizar para evitar re-renders innecesarios
export default memo(ProductCard);

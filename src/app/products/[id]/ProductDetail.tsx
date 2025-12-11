"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';
import { OptimizedImage } from "@/components/ui";
import { LikeButton, AddToCartButton, ProductCard } from "@/components/products";
import type { NormalizedProduct } from "@/services/fakeStoreApi";
import styles from "./product.module.scss";

interface ProductDetailProps {
  product: NormalizedProduct;
  relatedProducts: NormalizedProduct[];
}

export default function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
  const t = useTranslations('products');
  const tNav = useTranslations('navigation');
  
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/">{tNav('home')}</Link>
        <span>/</span>
        <Link href="/products">{tNav('products')}</Link>
        <span>/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link>
        <span>/</span>
        <span className={styles.current}>{product.name}</span>
      </nav>

      {/* Main product section */}
      <div className={styles.productMain}>
        {/* Image gallery */}
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <OptimizedImage
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
            />
          </div>
        </div>

        {/* Product info */}
        <div className={styles.infoSection}>
          <div className={styles.header}>
            <span className={styles.category}>{product.category}</span>
            <LikeButton productId={product.id} size="large" />
          </div>

          <h1 className={styles.title}>{product.name}</h1>

          {/* Rating */}
          <div className={styles.rating}>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  viewBox="0 0 24 24"
                  className={`${styles.star} ${
                    star <= Math.round(product.rating) ? styles.filled : ""
                  }`}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className={styles.ratingText}>
              {product.rating.toFixed(1)} ({product.reviewCount} {t('reviews')})
            </span>
          </div>

          {/* Price */}
          <div className={styles.priceSection}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            <span className={styles.stock}>
              {product.stock > 0 ? (
                <>
                  <span className={styles.inStock}>{t('inStock')}</span>
                  <span className={styles.stockCount}>
                    ({product.stock})
                  </span>
                </>
              ) : (
                <span className={styles.outOfStock}>{t('outOfStock')}</span>
              )}
            </span>
          </div>

          {/* Description */}
          <div className={styles.description}>
            <h2>{t('description')}</h2>
            <p>{product.description}</p>
          </div>

          {/* Add to cart */}
          <div className={styles.actions}>
            <AddToCartButton
              productId={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              stock={product.stock}
              showQuantity
            />
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className={styles.relatedSection}>
          <h2>{t('relatedProducts')}</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                id={relatedProduct.id}
                name={relatedProduct.name}
                price={relatedProduct.price}
                image={relatedProduct.image}
                category={relatedProduct.category}
                stock={relatedProduct.stock}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

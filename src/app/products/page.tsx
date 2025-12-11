import Link from "next/link";
import { getProducts, getCategories } from "@/services/fakeStoreApi";
import { Badge } from "@/components/ui";
import { ProductCard } from "@/components/products";
import { getTranslations } from 'next-intl/server';
import styles from "./Products.module.scss";

// ISR: Revalidar cada 60 segundos
export const revalidate = 60;

export async function generateMetadata() {
  const t = await getTranslations('products');
  return {
    title: `${t('title')} | ProductPlatform`,
    description: t('subtitle'),
  };
}

export default async function ProductsPage() {
  const t = await getTranslations('products');
  
  // Obtener datos de FakeStoreAPI
  const [{ products, total }, categories] = await Promise.all([
    getProducts({ limit: 20 }),
    getCategories(),
  ]);

  return (
    <div className={styles.productsPage}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className={styles.header}>
          <h1 className={styles.title}>{t('allProducts')}</h1>
          <p className={styles.subtitle}>
            {total} {t('title').toLowerCase()}
          </p>
        </header>

        {/* Categorías con enlaces */}
        <div className={styles.categories}>
          <span className={styles.categoryLabel}>{t('category')}:</span>
          <Link
            href="/products"
            className={styles.categoryLink}
          >
            <Badge $variant="info">{t('allCategories')}</Badge>
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className={styles.categoryLink}
            >
              <Badge $variant="default">{category}</Badge>
            </Link>
          ))}
        </div>

        {/* Grid de productos */}
        <div className={styles.productsGrid}>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              description={product.description}
              category={product.category}
              stock={product.stock}
              priority={index < 4}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className={styles.emptyState}>
            <p>{t('noProducts')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

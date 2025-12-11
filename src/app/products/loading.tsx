import { ProductCardSkeleton } from "@/components/ui";
import styles from "./Products.module.scss";

export default function ProductsLoading() {
  return (
    <div className={styles.productsPage}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className={styles.header}>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonSubtitle}></div>
        </header>

        <div className={styles.skeletonCategories}></div>

        <div className={styles.productsGrid}>
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

import Skeleton from "./Skeleton";
import styles from "./ProductCardSkeleton.module.scss";

export default function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
      </div>
      <div className={styles.content}>
        <Skeleton variant="text" width="40%" height="0.75rem" />
        <Skeleton variant="text" width="90%" height="1.25rem" />
        <Skeleton variant="text" width="100%" height="0.875rem" />
        <Skeleton variant="text" width="70%" height="0.875rem" />
        <div className={styles.footer}>
          <Skeleton variant="rounded" width="5rem" height="1.5rem" />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import styles from "../../../not-found.module.scss";
import { Button } from "@/components/ui";

export default function CategoryNotFound() {
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.container}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Categoría no encontrada</h2>
        <p className={styles.message}>
          La categoría que buscas no existe.
        </p>
        <div className={styles.actions}>
          <Link href="/products">
            <Button $size="lg">Ver todos los productos</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

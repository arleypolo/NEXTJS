import Link from "next/link";
import styles from "./not-found.module.scss";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.container}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Página no encontrada</h2>
        <p className={styles.message}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div className={styles.actions}>
          <Link href="/">
            <Button $size="lg">Volver al inicio</Button>
          </Link>
          <Link href="/products">
            <Button $variant="outline" $size="lg">
              Ver productos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
